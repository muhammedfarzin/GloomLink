import React, { useEffect, useState } from "react";
import GloomLinkLogo from "../../assets/images/GloomLink-Logo.svg";
import OtpIllustrationDark from "../../assets/images/OTP-Illustration-Dark.svg";
import FormBox from "../../components/FormBox";
import InputBox from "../../components/InputBox";
import TimerButton from "./components/TimerButton";
import { validateOtpForm } from "./formValidations";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import {
  logout,
  setAuthUser,
  type TokensState,
  type UserAuthState,
} from "../../redux/reducers/auth";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";

const OtpVerification: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.auth.userData);
  const [otp, setOtp] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>();
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!accessToken || !userData || userData.status !== "not-verified")
      navigate("/login");
  }, [userData]);

  const handleResendOtp = async () => {
    try {
      const response = await axios.post(
        "/api/user/signup/resend-otp",
        {
          accessToken,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setErrorMessage(response.data.message || "");
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        setErrorMessage(error.response.data.message);
      } else setErrorMessage("Something went wrong");
    }
  };

  const handleVerifyOtp: React.MouseEventHandler<HTMLFormElement> = async (
    e
  ) => {
    e.preventDefault();
    setErrorMessage("");
    const isValidated = validateOtpForm(otp, setErrorMessage);

    if (!isValidated) return;

    try {
      const response = await axios.post(
        "/api/user/signup/verify-otp",
        {
          otp,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const userData = response.data.userData as UserAuthState;
      const tokens = response.data.tokens as TokensState;

      dispatch(setAuthUser({ userData, tokens }));
      navigate("/");
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        if (error.status === 401) {
          error.response.data.message = "Time expired, please try again";
          dispatch(logout({ type: "user" }));
        } else if (error.status === 404) {
          error.response.data.message = "Your otp has been expired";
          dispatch(logout({ type: "user" }));
        }
        setErrorMessage(error.response.data.message);
      } else setErrorMessage("Something went wrong");
    }
  };

  return (
    <>
      <div className="py-3 px-4 md:py-6 md:px-14">
        <img src={GloomLinkLogo} alt="GloomLink" className="w-44 md:w-64" />
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
          <FormBox
            title="Enter OTP"
            errorMessage={errorMessage}
            onSubmit={handleVerifyOtp}
          >
            <div className="w-full flex justify-end mt-[-1rem]">
              <TimerButton onClick={handleResendOtp}>Resend OTP</TimerButton>
            </div>
            <InputBox
              value={otp}
              name="otp"
              placeholder="Enter OTP send to your email"
              type="number"
              onChange={(e) => setOtp(e.target.value)}
            />

            <button type="submit" className="btn btn-primary border w-full">
              Verify
            </button>
          </FormBox>
        </div>
      </div>
    </>
  );
};

export default OtpVerification;
