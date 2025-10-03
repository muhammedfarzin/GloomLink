import { RequestHandler } from "express";
import firebaseAdmin from "firebase-admin";
import { CreateUser } from "../../application/use-cases/CreateUser";
import firebaseServiceAccount from "../../infrastructure/configuration/firebase-service-account-file.json";
import { SendVerificationEmail } from "../../application/use-cases/SendVerificationEmail";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { VerifyOtp } from "../../application/use-cases/VerifyOtp";
import { LoginUser } from "../../application/use-cases/LoginUser";
import { SignInWithGoogle } from "../../application/use-cases/SignInWithGoogle";
import { RefreshToken } from "../../application/use-cases/RefreshToken";
import { AdminLogin } from "../../application/use-cases/AdminLogin";
import { UserMapper } from "../../infrastructure/database/mappers/UserMapper";
import container from "../../shared/inversify.config";
import { TYPES } from "../../shared/types";
import { ITokenService } from "../../application/services/ITokenService";
import {
  adminLoginInputSchema,
  googleAuthSchema,
  loginInputSchema,
  otpInputSchema,
  refreshTokenSchema,
  signupInputSchema,
} from "../validation/authSchemas";

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(
    firebaseServiceAccount as firebaseAdmin.ServiceAccount
  ),
});

export const login: RequestHandler = async (req, res, next) => {
  try {
    const validatedBody = loginInputSchema.parse(req.body);

    const loginUserUseCase = container.get<LoginUser>(TYPES.LoginUser);
    const user = await loginUserUseCase.execute(validatedBody);

    if (user.status === "not-verified") {
      const sendEmailUseCase = container.get<SendVerificationEmail>(
        TYPES.SendVerificationEmail
      );
      await sendEmailUseCase.execute({ email: user.email });
    }

    const userResponse = UserMapper.toResponse(user);
    const tokenService = container.get<ITokenService>(TYPES.ITokenService);
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
    const createUserUseCase = container.get<CreateUser>(TYPES.CreateUser);
    const newUser = await createUserUseCase.execute({
      ...validatedBody,
      authType: "email",
    });

    // --- Send Verification Email ---
    const sendEmailUseCase = container.get<SendVerificationEmail>(
      TYPES.SendVerificationEmail
    );
    await sendEmailUseCase.execute({ email: newUser.email });

    // --- Generate Token & Respond ---
    const userResponse = UserMapper.toResponse(newUser);

    const tokenService = container.get<ITokenService>(TYPES.ITokenService);
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

    const sendEmailUseCase = container.get<SendVerificationEmail>(
      TYPES.SendVerificationEmail
    );

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

    const verifyOtpUseCase = container.get<VerifyOtp>(TYPES.VerifyOtp);
    const updatedUser = await verifyOtpUseCase.execute({
      email: req.user.email,
      otp,
    });

    const userResponse = UserMapper.toResponse(updatedUser);

    const tokenService = container.get<ITokenService>(TYPES.ITokenService);
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

    const signInWithGoogleUseCase = container.get<SignInWithGoogle>(
      TYPES.SignInWithGoogle
    );

    const user = await signInWithGoogleUseCase.execute({
      email: decodedData.email,
      name: decodedData.name,
      uid: decodedData.uid,
    });

    const userResponse = UserMapper.toResponse(user);

    const tokenService = container.get<ITokenService>(TYPES.ITokenService);
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

    const refreshTokenUseCase = container.get<RefreshToken>(TYPES.RefreshToken);
    const newTokens = await refreshTokenUseCase.execute({ token });

    res.status(200).json({
      tokens: newTokens,
      message: "Token refreshed successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const adminLogin: RequestHandler = async (req, res, next) => {
  try {
    const validatedBody = adminLoginInputSchema.parse(req.body);

    const adminLoginUseCase = container.get<AdminLogin>(TYPES.AdminLogin);
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
