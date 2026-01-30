import { RequestHandler } from "express";
import { inject } from "inversify";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { UserMapper } from "../../infrastructure/database/mappers/UserMapper";
import { TYPES } from "../../shared/types";

import type { ITokenService } from "../../application/services/ITokenService";
import type { IExternalAuthService } from "../../application/services/IExternalAuthService";

import type { VerifyOtp } from "../../application/use-cases/VerifyOtp";
import type { LoginUser } from "../../application/use-cases/LoginUser";
import type { SignInWithGoogle } from "../../application/use-cases/SignInWithGoogle";
import type { RefreshToken } from "../../application/use-cases/RefreshToken";
import type { AdminLogin } from "../../application/use-cases/AdminLogin";
import type { CreateUser } from "../../application/use-cases/CreateUser";
import type { SendVerificationEmail } from "../../application/use-cases/SendVerificationEmail";

import {
  adminLoginInputSchema,
  googleAuthSchema,
  loginInputSchema,
  otpInputSchema,
  refreshTokenSchema,
  signupInputSchema,
} from "../validation/authSchemas";

export class AuthController {
  constructor(
    @inject(TYPES.CreateUser) private createUserUseCase: CreateUser,
    @inject(TYPES.LoginUser) private loginUserUseCase: LoginUser,
    @inject(TYPES.SignInWithGoogle)
    private signInWithGoogleUseCase: SignInWithGoogle,
    @inject(TYPES.SendVerificationEmail)
    private sendVerificationEmailUseCase: SendVerificationEmail,
    @inject(TYPES.VerifyOtp) private verifyOtpUseCase: VerifyOtp,
    @inject(TYPES.RefreshToken) private refreshTokenUseCase: RefreshToken,
    @inject(TYPES.AdminLogin) private adminLoginUseCase: AdminLogin,
    @inject(TYPES.ITokenService) private tokenService: ITokenService,
    @inject(TYPES.IExternalAuthService)
    private externalAuthService: IExternalAuthService,
  ) {}

  login: RequestHandler = async (req, res, next) => {
    try {
      const validatedBody = loginInputSchema.parse(req.body);

      const user = await this.loginUserUseCase.execute(validatedBody);

      if (user.status === "not-verified") {
        await this.sendVerificationEmailUseCase.execute({ email: user.email });
      }

      const userResponse = UserMapper.toResponse(user);
      const tokens = this.tokenService.generate(
        { role: "user", id: userResponse._id },
        user.status !== "not-verified",
      );
      const messageResponse =
        user.status === "not-verified"
          ? "Verify your email"
          : "Login successful";

      res.status(200).json({
        userData: userResponse,
        tokens,
        message: messageResponse,
      });
    } catch (error) {
      next(error);
    }
  };

  signup: RequestHandler = async (req, res, next) => {
    try {
      const validatedBody = signupInputSchema.parse(req.body);

      // --- Create User ---
      const newUser = await this.createUserUseCase.execute({
        ...validatedBody,
        authType: "email",
      });

      // --- Send Verification Email ---
      await this.sendVerificationEmailUseCase.execute({ email: newUser.email });

      // --- Generate Token & Respond ---
      const userResponse = UserMapper.toResponse(newUser);

      const tokens = this.tokenService.generate(
        { role: "user", id: userResponse._id },
        false,
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

  resendOTP: RequestHandler = async (req, res, next) => {
    try {
      if (!req.user || req.user.role !== "user")
        throw new HttpError(401, "Unauthorized");

      await this.sendVerificationEmailUseCase.execute({
        email: req.user.email,
      });

      res.status(200).json({ message: "Otp has been send successfully" });
    } catch (error) {
      next(error);
    }
  };

  verifyOTP: RequestHandler = async (req, res, next) => {
    try {
      if (!req.user || req.user.role !== "user")
        throw new HttpError(401, "Unauthorized");

      const { otp } = otpInputSchema.parse(req.body);

      const updatedUser = await this.verifyOtpUseCase.execute({
        email: req.user.email,
        otp,
      });

      const userResponse = UserMapper.toResponse(updatedUser);

      const tokens = this.tokenService.generate(
        { role: "user", id: userResponse._id },
        true,
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

  signInUsingGoogle: RequestHandler = async (req, res, next) => {
    try {
      const { token } = googleAuthSchema.parse(req.body);

      const authData =
        await this.externalAuthService.verifyGoogleAuthToken(token);
      const user = await this.signInWithGoogleUseCase.execute(authData);
      const userResponse = UserMapper.toResponse(user);
      const tokens = this.tokenService.generate(
        { role: "user", id: userResponse._id },
        true,
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

  refreshToken: RequestHandler = async (req, res, next) => {
    try {
      const { token } = refreshTokenSchema.parse(req.body);

      const newTokens = await this.refreshTokenUseCase.execute({ token });

      res.status(200).json({
        tokens: newTokens,
        message: "Token refreshed successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  adminLogin: RequestHandler = async (req, res, next) => {
    try {
      const validatedBody = adminLoginInputSchema.parse(req.body);

      const tokens = await this.adminLoginUseCase.execute(validatedBody);

      res.status(200).json({
        tokens,
        userData: { username: validatedBody.username },
        message: "Admin login successful",
      });
    } catch (error) {
      next(error);
    }
  };
}
