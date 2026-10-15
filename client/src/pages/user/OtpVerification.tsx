import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import GloomLinkLogo from "@/assets/images/GloomLink-Logo.svg";
import OtpIllustrationDark from "@/assets/images/OTP-Illustration-Dark.svg";
import FormBox from "@/components/FormBox";
import TimerButton from "@/components/TimerButton";
import { validateOtpForm } from "./formValidations";
import {
  logout,
  setAuthUser,
  type TokensState,
  type UserAuthState,
} from "@/redux/reducers/auth";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { authApiClient } from "@/apiClient";
import { useToaster } from "@/hooks/useToaster";
import { SESSION_STORAGE_KEYS } from "@/constants/storageKeys";

const OtpVerification: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const colorTheme = useSelector((state: RootState) => state.theme.colorTheme);
  const { toastError, toastMessage } = useToaster();
  const [loading, setLoading] = useState<string | null>(null);
  const [otp, setOtp] = useState<string>("");

  const verificationEmail = sessionStorage.getItem(
    SESSION_STORAGE_KEYS.verificationEmail,
  );

  const handleResendOtp = async () => {
    try {
      setLoading("Resending OTP...");
      const response = await authApiClient.post("/resend-otp", {
        email: verificationEmail,
      });
      toastMessage(response.data.message);
    } catch (error: any) {
      toastError(error.message);
    } finally {
      setLoading(null);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading("Verifying...");

    try {
      validateOtpForm(otp, (errorMessage) => {
        throw new Error(errorMessage);
      });

      const response = await authApiClient.post("/verify-otp", {
        email: verificationEmail,
        otp,
      });
      const userData = response.data.userData as UserAuthState;
      const tokens = response.data.tokens as TokensState;

      dispatch(setAuthUser({ userData, tokens }));
      sessionStorage.removeItem(SESSION_STORAGE_KEYS.verificationEmail);
      navigate("/");
    } catch (error: any) {
      if (error.status === 401) {
        error.message = "Time expired, please try again";
        dispatch(logout({ type: "user" }));
      } else if (error.status === 404) {
        error.message = "Your otp has been expired";
      }
      toastError(error.message);
    } finally {
      setLoading(null);
    }
  };

  const cancelVerification = () => {
    sessionStorage.removeItem(SESSION_STORAGE_KEYS.verificationEmail);
    dispatch(logout({ type: "user" }));
    navigate("/auth/login");
  };

  if (!verificationEmail) {
    return <Navigate to="/auth/login" />;
  }

  return (
    <>
      <div className="py-3 px-4 md:py-6 md:px-14">
        <img
          src={GloomLinkLogo}
          alt="GloomLink"
          className="w-44 md:w-64"
          style={{
            filter: `invert(${colorTheme === "dark" ? 0 : 1})`,
          }}
        />
      </div>

      <div className="flex">
        <div className="hidden md:block w-1/2">
          <img
            src={OtpIllustrationDark}
            alt="OTP Illustration"
            className="w-[400px] mx-auto my-auto"
          />
        </div>

        <div className="w-full md:w-1/2 px-4 my-auto text-center">
          <FormBox title="Enter OTP" onSubmit={handleVerifyOtp}>
            <div className="w-full flex justify-between mt-[-1rem]">
              <span
                className="cursor-pointer hover:opacity-75"
                onClick={cancelVerification}
              >
                Cancel
              </span>
              <TimerButton onClick={handleResendOtp}>Resend OTP</TimerButton>
            </div>
            <input
              className="input-box"
              value={otp}
              name="otp"
              placeholder="Enter OTP send to your email"
              type="number"
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              type="submit"
              className="btn btn-primary border w-full p-2"
              disabled={!!loading}
            >
              {loading || "Verify"}
            </button>
          </FormBox>
        </div>
      </div>
    </>
  );
};

export default OtpVerification;
