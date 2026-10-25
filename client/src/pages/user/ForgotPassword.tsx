import { useState } from "react";
import { Link } from "react-router-dom";
import FormBox from "@/components/FormBox";
import GloomLinkLogo from "@/assets/images/GloomLink-Logo.svg";
import ForgotPasswordIllustration from "@/assets/images/Forgot-Password-Illustration-Dark.svg";
import { authApiClient } from "@/apiClient";
import { useToaster } from "@/hooks/useToaster";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import FieldError from "@/components/FieldError";
import {
  applyServerFormErrors,
  validateForgotFields,
  type FieldErrors,
} from "@/lib/formValidations";

const ForgotPassword = () => {
  const colorTheme = useSelector((state: RootState) => state.theme.colorTheme);
  const { toastError, toastMessage } = useToaster();
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [requested, setRequested] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const requestForgotPassword = async () => {
    await authApiClient.post("/forgot-password", { identifier });
    setRequested(true);
    toastMessage(
      "If an account exists with the provided information, a password reset code has been sent.",
    );
  };

  const resetPassword = async () => {
    await authApiClient.post("/reset-password", {
      identifier,
      otp,
      password,
    });
    toastMessage("Password reset successfully. You can now log in.");
    setCompleted(true);
  };

  const handleSubmit = async () => {
    const validationErrors = validateForgotFields(
      identifier,
      requested,
      otp,
      password,
    );
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;
    setLoading(true);
    try {
      if (!requested) {
        await requestForgotPassword();
      } else {
        await resetPassword();
      }
    } catch (error: any) {
      const serverErrors = applyServerFormErrors(error);
      if (Object.keys(serverErrors).length) {
        setErrors((current) => ({ ...current, ...serverErrors }));
      } else toastError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="py-3 px-4 md:py-6 md:px-14">
        <img
          src={GloomLinkLogo}
          alt="GloomLink"
          className="w-44 md:w-64"
          style={{ filter: `invert(${colorTheme === "dark" ? 0 : 1})` }}
        />
      </div>
      <div className="flex">
        <div className="hidden md:block w-1/2 my-auto">
          <img
            src={ForgotPasswordIllustration}
            alt="A secure password reset code arriving by email"
            className="w-[400px] mx-auto"
          />
        </div>
        <div className="w-full md:w-1/2 px-4 my-12 md:my-auto text-center">
          {completed ? (
            <div className="w-full max-w-[450px] mx-auto rounded-2xl p-6 bg-formBox">
              <h3 className="text-2xl font-bold mb-3 text-foreground">
                Password updated
              </h3>
              <p className="text-[#82919E] mb-4">
                Your password has been changed. You can now sign in with it.
              </p>
              <Link
                to="../login"
                className="btn btn-primary border w-full block p-2"
              >
                Back to login
              </Link>
            </div>
          ) : (
            <FormBox
              title={requested ? "Reset password" : "Forgot password"}
              onSubmit={handleSubmit}
            >
              <p className="text-[#82919E] mb-4">
                {requested
                  ? "Enter the six-digit code sent to your account email and choose a new password."
                  : "We'll send a reset code to your account email."}
              </p>
              <input
                className="input-box"
                aria-invalid={!!errors.identifier}
                type="text"
                autoComplete="username"
                placeholder="Email, username, or phone number"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  setErrors((current) => ({ ...current, identifier: "" }));
                }}
                disabled={requested}
              />
              <FieldError message={errors.identifier} />
              {requested && (
                <>
                  <input
                    className="input-box"
                    aria-invalid={!!errors.otp}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    placeholder="Six-digit reset code"
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value);
                      setErrors((current) => ({ ...current, otp: "" }));
                    }}
                  />
                  <FieldError message={errors.otp} />
                  <input
                    className="input-box"
                    aria-invalid={!!errors.password}
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    placeholder="New password (8+ characters)"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors((current) => ({ ...current, password: "" }));
                    }}
                  />
                  <FieldError message={errors.password} />
                </>
              )}
              <button
                type="submit"
                className="btn btn-primary border w-full p-2"
                disabled={loading}
              >
                {loading
                  ? "Please wait..."
                  : requested
                    ? "Reset password"
                    : "Send reset code"}
              </button>
              {requested && (
                <button
                  type="button"
                  className="mt-3 text-sm text-[#82919E] hover:underline"
                  onClick={() => setRequested(false)}
                >
                  Use a different account
                </button>
              )}
            </FormBox>
          )}
          <Link
            to="../login"
            className="inline-block mt-4 text-[#82919E] hover:underline"
          >
            Back to login
          </Link>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
