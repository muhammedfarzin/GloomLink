import { RequestHandler } from "express";
import { inject } from "inversify";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { UserMapper } from "../../infrastructure/mappers/UserMapper";
import { TYPES } from "../../shared/types";

import type { ITokenService } from "../../domain/services/ITokenService";
import type { IExternalAuthService } from "../../domain/services/IExternalAuthService";

import type { ICreateUser } from "../../domain/use-cases/ICreateUser";
import type { ILoginUser } from "../../domain/use-cases/ILoginUser";
import type { ISignInWithGoogle } from "../../domain/use-cases/ISignInWithGoogle";
import type { ISendVerificationEmail } from "../../domain/use-cases/ISendVerificationEmail";
import type { IVerifyOtp } from "../../domain/use-cases/IVerifyOtp";
import type { IRefreshToken } from "../../domain/use-cases/IRefreshToken";
import type { IAdminLogin } from "../../domain/use-cases/IAdminLogin";

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
    @inject(TYPES.ICreateUser) private createUserUseCase: ICreateUser,
    @inject(TYPES.ILoginUser) private loginUserUseCase: ILoginUser,
    @inject(TYPES.ISignInWithGoogle)
    private signInWithGoogleUseCase: ISignInWithGoogle,
    @inject(TYPES.ISendVerificationEmail)
    private sendVerificationEmailUseCase: ISendVerificationEmail,
    @inject(TYPES.IVerifyOtp) private verifyOtpUseCase: IVerifyOtp,
    @inject(TYPES.IRefreshToken) private refreshTokenUseCase: IRefreshToken,
    @inject(TYPES.IAdminLogin) private adminLoginUseCase: IAdminLogin,
    @inject(TYPES.ITokenService) private tokenService: ITokenService,
    @inject(TYPES.IExternalAuthService)
    private externalAuthService: IExternalAuthService,
  ) {}

  login: RequestHandler = async (req, res, next) => {
    try {
      const validatedBody = loginInputSchema.parse(req.body);

      const user = await this.loginUserUseCase.execute(validatedBody);

      if (!user.isVerified()) {
        await this.sendVerificationEmailUseCase.execute({
          email: user.getEmail(),
        });
      }

      const userResponse = UserMapper.toResponseWithStatus(user);
      const tokens = this.tokenService.generate(
        { role: "user", id: userResponse.userId },
        userResponse.status !== "not-verified",
      );
      const messageResponse =
        userResponse.status === "not-verified"
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
      await this.sendVerificationEmailUseCase.execute({
        email: newUser.getEmail(),
      });

      // --- Generate Token & Respond ---
      const userResponse = UserMapper.toResponseWithStatus(newUser);

      const tokens = this.tokenService.generate(
        { role: "user", id: userResponse.userId },
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

      const userResponse = UserMapper.toResponseWithStatus(updatedUser);

      const tokens = this.tokenService.generate(
        { role: "user", id: userResponse.userId },
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
      const userResponse = UserMapper.toResponseWithStatus(user);
      const tokens = this.tokenService.generate(
        { role: "user", id: userResponse.userId },
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
