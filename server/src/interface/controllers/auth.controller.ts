import { RequestHandler } from "express";
import firebaseAdmin from "firebase-admin";
import { CreateUser } from "../../application/use-cases/CreateUser";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { OtpRepository } from "../../infrastructure/repositories/OtpRepository.js";
import { BcryptPasswordHasher } from "../../infrastructure/services/BcryptPasswordHasher";
import { type TokenPayloadType } from "../../application/services/token.service.js";
import firebaseServiceAccount from "../../infrastructure/configuration/firebase-service-account-file.json";
import {
  removeFromCloudinary,
  uploadToCloudinary,
} from "../../application/services/cloudinary.service.js";
import {
  adminLoginInputSchema,
  googleAuthSchema,
  loginInputSchema,
  otpInputSchema,
  refreshTokenSchema,
  signupInputSchema,
} from "../validation/authSchemas";
import { OtpService } from "../../infrastructure/services/OtpService";
import { MailService } from "../../infrastructure/services/MailService";
import { SendVerificationEmail } from "../../application/use-cases/SendVerificationEmail";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { VerifyOtp } from "../../application/use-cases/VerifyOtp";
import { LoginUser } from "../../application/use-cases/LoginUser";
import { SignInWithGoogle } from "../../application/use-cases/SignInWithGoogle";
import { JwtTokenService } from "../../infrastructure/services/JwtTokenService";
import { RefreshToken } from "../../application/use-cases/RefreshToken";
import { AdminLogin } from "../../application/use-cases/AdminLogin";
import { UserMapper } from "../../infrastructure/database/mappers/UserMapper";

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(
    firebaseServiceAccount as firebaseAdmin.ServiceAccount
  ),
});

export const login: RequestHandler = async (req, res, next) => {
  try {
    const validatedBody = loginInputSchema.parse(req.body);

    const userRepository = new UserRepository();
    const passwordHasher = new BcryptPasswordHasher();
    const loginUserUseCase = new LoginUser(userRepository, passwordHasher);
    const user = await loginUserUseCase.execute(validatedBody);

    if (user.status === "not-verified") {
      const otpRepository = new OtpRepository();
      const otpService = new OtpService(otpRepository);
      const mailService = new MailService();
      const sendEmailUseCase = new SendVerificationEmail(
        otpService,
        mailService
      );
      await sendEmailUseCase.execute({ email: user.email });
    }

    const userResponse = UserMapper.toAuthResponse(user);
    const tokenService = new JwtTokenService();
    const tokens = tokenService.generate(
      { role: "user", id: userResponse._id },
      user.status !== "not-verified"
    );
    const messageResponse =
      user.status === "not-verified" ? "Verify your email" : "Login successful";

    res.status(200).json({
      userData: userResponse,
      tokens,
      message: messageResponse,
    });
  } catch (error) {
    next(error);
  }
};

export const signup: RequestHandler = async (req, res, next) => {
  try {
    const validatedBody = signupInputSchema.parse(req.body);

    // --- Create User ---
    const userRepository = new UserRepository();
    const passwordHasher = new BcryptPasswordHasher();
    const createUserUseCase = new CreateUser(userRepository, passwordHasher);
    const newUser = await createUserUseCase.execute({
      ...validatedBody,
      authType: "email",
    });

    // --- Send Verification Email ---
    const otpRepository = new OtpRepository();
    const otpService = new OtpService(otpRepository);
    const mailService = new MailService();
    const sendEmailUseCase = new SendVerificationEmail(otpService, mailService);
    await sendEmailUseCase.execute({ email: newUser.email });

    // --- Generate Token & Respond ---
    const userResponse = UserMapper.toAuthResponse(newUser);

    const tokenService = new JwtTokenService();
    const tokens = tokenService.generate(
      { role: "user", id: userResponse._id },
      false
    );

    res.status(201).json({
      tokens,
      userData: userResponse,
      message: "User created successfully. Please check your email for OTP.",
    });
  } catch (err) {
    next(err);
  }
};

export const resendOTP: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user")
      throw new HttpError(401, "Unauthorized");

    const otpRepository = new OtpRepository();
    const otpService = new OtpService(otpRepository);
    const mailService = new MailService();
    const sendEmailUseCase = new SendVerificationEmail(otpService, mailService);
    await sendEmailUseCase.execute({ email: req.user.email });

    res.status(200).json({ message: "Otp has been send successfully" });
  } catch (error) {
    next(error);
  }
};

export const verifyOTP: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user")
      throw new HttpError(401, "Unauthorized");

    const { otp } = otpInputSchema.parse(req.body);

    const otpRepository = new OtpRepository();
    const userRepository = new UserRepository();
    const passwordHasher = new BcryptPasswordHasher();
    const verifyOtpUseCase = new VerifyOtp(
      otpRepository,
      userRepository,
      passwordHasher
    );
    const updatedUser = await verifyOtpUseCase.execute({
      email: req.user.email,
      otp,
    });

    const userResponse = UserMapper.toAuthResponse(updatedUser);

    const tokenService = new JwtTokenService();
    const tokens = tokenService.generate(
      { role: "user", id: userResponse._id },
      true
    );

    res.status(200).json({
      userData: userResponse,
      tokens,
      message: "OTP verified successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const signInUsingGoogle: RequestHandler = async (req, res, next) => {
  try {
    const { token } = googleAuthSchema.parse(req.body);

    const decodedData = await firebaseAdmin.auth().verifyIdToken(token);

    const userRepository = new UserRepository();
    const signInWithGoogleUseCase = new SignInWithGoogle(userRepository);
    const user = await signInWithGoogleUseCase.execute({
      email: decodedData.email,
      name: decodedData.name,
      uid: decodedData.uid,
    });

    const userResponse = UserMapper.toAuthResponse(user);

    const tokenService = new JwtTokenService();
    const tokens = tokenService.generate(
      { role: "user", id: userResponse._id },
      true
    );

    res.status(200).json({
      userData: userResponse,
      tokens,
      message: "Google login successfully",
    });
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "auth/id-token-expired"
    ) {
      return next(new HttpError(401, "Google auth token has expired."));
    }
    next(error);
  }
};

export const refreshToken: RequestHandler = async (req, res, next) => {
  try {
    const { token } = refreshTokenSchema.parse(req.body);

    const tokenService = new JwtTokenService();
    const userRepository = new UserRepository();
    const refreshTokenUseCase = new RefreshToken(tokenService, userRepository);
    const newTokens = await refreshTokenUseCase.execute({ token });

    res.status(200).json({
      tokens: newTokens,
      message: "Token refreshed successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user") {
      throw new HttpError(401, "Unauthorized");
    }

    const {
      username,
      firstname,
      lastname,
      mobile,
      dob,
      gender,
      password,
      newPassword,
    } = req.body as Partial<User> & { newPassword?: string };
    let image = req.file?.path;
    let existImage: string | undefined;

    if (!firstname) throw new HttpError(400, "Please enter firstname.");
    else if (!lastname) throw new HttpError(400, "Please enter lastname.");
    else if (!username) throw new HttpError(400, "Please enter username.");
    else if (!mobile) throw new HttpError(400, "Please enter mobile number.");

    const user = await userRepository.findById(req.user._id, null, true);
    if (!user) throw new HttpError(401, "Unauthorized");
    if (req.user.authType === "email") {
      if (!password) throw new HttpError(400, "Please enter password.");

      const userVerified = await userRepository.verifyUser(
        user.username,
        password
      );

      if (!userVerified)
        throw new HttpError(400, "Invalid password. Please try again");

      if (newPassword) user.password = newPassword;
    }

    if (image) {
      existImage = user.image;
      image = await uploadToCloudinary(image, "profile");
    }

    user.username = username;
    user.firstname = firstname;
    user.lastname = lastname;
    user.mobile = mobile;
    user.dob = dob;
    user.gender = gender;
    user.image = image;
    const {
      _id,
      username: newUsername,
      firstname: newFirstname,
      lastname: newLastname,
      status,
      email,
      authType,
    } = (await user.save()).toObject();
    const resUserData = {
      _id,
      username: newUsername,
      firstname: newFirstname,
      lastname: newLastname,
      status,
      email,
      authType,
    };

    if (existImage) removeFromCloudinary(existImage);

    const tokenPayload: TokenPayloadType = {
      role: "user",
      ...resUserData,
      _id: resUserData._id.toString(),
      authType: resUserData.authType || "email",
    };
    const tokens = generateToken(tokenPayload);

    res.status(200).json({
      userData: resUserData,
      tokens,
      message: "Updated profile successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const adminLogin: RequestHandler = async (req, res, next) => {
  try {
    const validatedBody = adminLoginInputSchema.parse(req.body);

    const tokenService = new JwtTokenService();
    const adminLoginUseCase = new AdminLogin(tokenService);
    const tokens = await adminLoginUseCase.execute(validatedBody);

    res.status(200).json({
      tokens,
      userData: { username: validatedBody.username },
      message: "Admin login successful",
    });
  } catch (error) {
    next(error);
  }
};
