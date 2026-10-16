import { RequestHandler } from "express";
import { inject } from "inversify";
import { HttpError } from "../errors/HttpError";
import { UserMapper } from "../mappers/UserMapper";
import { User } from "@/domain/entities/User";
import { TYPES } from "@/shared/types";

import type { ITokenService, Tokens } from "@/domain/services/ITokenService";
import type { IExternalAuthService } from "@/domain/services/IExternalAuthService";

import type { ICreateUser } from "@/domain/use-cases/ICreateUser";
import type { ILoginUser } from "@/domain/use-cases/ILoginUser";
import type { ISignInWithGoogle } from "@/domain/use-cases/ISignInWithGoogle";
import type { ISendVerificationEmail } from "@/domain/use-cases/ISendVerificationEmail";
import type { IVerifyOtp } from "@/domain/use-cases/IVerifyOtp";
import type { IRefreshToken } from "@/domain/use-cases/IRefreshToken";
import type { IAdminLogin } from "@/domain/use-cases/IAdminLogin";
import type { IRequestPasswordReset } from "@/domain/use-cases/IRequestPasswordReset";
import type { IResetPassword } from "@/domain/use-cases/IResetPassword";

import {
  googleAuthSchema,
  loginInputSchema,
  otpEmailSchema,
  otpInputSchema,
  passwordResetIdentifierSchema,
  refreshTokenSchema,
  resetPasswordInputSchema,
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
    @inject(TYPES.IRequestPasswordReset)
    private requestPasswordResetUseCase: IRequestPasswordReset,
    @inject(TYPES.IResetPassword) private resetPasswordUseCase: IResetPassword,
  ) {}

  login: RequestHandler = async (req, res, next) => {
    try {
      const { role, ...validatedBody } = loginInputSchema.parse(req.body);
      let user: User | undefined;
      let tokens: Tokens;
      let userResponse: any;

      if (role === "user") {
        const authResponse = await this.loginUserUseCase.execute(validatedBody);
        user = authResponse.user;

        if (!user.isVerified()) {
          await this.sendVerificationEmailUseCase.execute({
            email: user.getEmail(),
          });
          res.status(403).json({
            message: "Verify your email",
            verificationEmail: user.getEmail(),
          });
          return;
        }

        userResponse = UserMapper.toResponse(user);
        tokens = authResponse.tokens!;
      } else {
        tokens = await this.adminLoginUseCase.execute(validatedBody);
        userResponse = { username: validatedBody.username };
      }

      res.status(200).json({
        message: "Login successful",
        userData: userResponse,
        tokens,
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

      // --- Response ---
      const userResponse = UserMapper.toResponse(newUser);

      res.status(201).json({
        userData: userResponse,
        verificationEmail: newUser.getEmail(),
        message: "User created successfully. Please check your email for OTP.",
      });
    } catch (err) {
      next(err);
    }
  };

  resendOTP: RequestHandler = async (req, res, next) => {
    try {
      const { email } = otpEmailSchema.parse(req.body);
      await this.sendVerificationEmailUseCase.execute({ email });

      res.status(200).json({ message: "Otp has been send successfully" });
    } catch (error) {
      next(error);
    }
  };

  verifyOTP: RequestHandler = async (req, res, next) => {
    try {
      const { otp, email } = otpInputSchema.parse(req.body);

      const updatedUser = await this.verifyOtpUseCase.execute({
        email,
        otp,
      });

      const userResponse = UserMapper.toResponse(updatedUser);

      const tokens = this.tokenService.generate(
        { role: "user", id: userResponse.id },
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
        { role: "user", id: userResponse.id },
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

  requestPasswordReset: RequestHandler = async (req, res, next) => {
    try {
      const { identifier } = passwordResetIdentifierSchema.parse(req.body);
      await this.requestPasswordResetUseCase.execute({ identifier });
      res.status(200).json({
        message:
          "If an account exists with the provided information, a password reset code has been sent.",
      });
    } catch (error) {
      next(error);
    }
  };

  resetPassword: RequestHandler = async (req, res, next) => {
    try {
      const body = resetPasswordInputSchema.parse(req.body);
      await this.resetPasswordUseCase.execute(body);
      res.status(200).json({ message: "Password reset successfully." });
    } catch (error) {
      next(error);
    }
  };
}
