import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import GloomLinkLogo from "../../assets/images/GloomLink-Logo.svg";
import LoginIllustrationDark from "../../assets/images/Login-Illustration-Dark.svg";
import EnvelopeIcon from "../../assets/icons/Envelope.svg";
import GoogleIcon from "../../assets/icons/Google.svg";
import FormBox from "../../components/FormBox";
import InputBox from "../../components/InputBox";
import {
  logout,
  setAuthUser,
  type TokensState,
  type UserAuthState,
} from "../../redux/reducers/auth";
import { validateLoginForm, type LoginFormType } from "./formValidations";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { signInWithPopup } from "firebase/auth";
import { firebaseAuth, googleAuthProvider } from "@/firebase";
import { FirebaseError } from "firebase/app";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const colorTheme = useSelector((state: RootState) => state.theme.colorTheme);
  const userData = useSelector((state: RootState) => state.auth.userData);
  const [loading, setLoading] = useState<string | null>(null);
  const [formData, setFormData] = useState<LoginFormType>({
    username: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken && userData && userData.status !== "blocked") {
      navigate("/");
    } else {
      dispatch(logout({ type: "user" }));
    }
  }, [userData]);

  const handleSuccessLogin = (data: any) => {
    const userData = data.userData as UserAuthState;
    const tokens = data.tokens as TokensState;

    dispatch(setAuthUser({ userData, tokens }));
    navigate("/");
  };

  const handleOnLogin: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLoading("Authenticating...");
    setErrorMessage("");

    const isValidated = validateLoginForm(formData, setErrorMessage);

    if (isValidated) {
      try {
        const response = await axios.post("/api/user/login", formData);
        handleSuccessLogin(response.data);
      } catch (error) {
        if (error instanceof AxiosError && error.response) {
          setErrorMessage(error.response.data.message);
        } else setErrorMessage("Something went wrong");
      } finally {
        setLoading(null);
      }
    }
  };

  const handleOnChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading("Logging in with Google");
      const credentials = await signInWithPopup(
        firebaseAuth,
        googleAuthProvider
      );
      const token = await credentials.user.getIdToken();
      const response = await axios.post("/api/user/auth/google", {
        token,
      });

      handleSuccessLogin(response.data);
    } catch (error: any) {
      if (error instanceof FirebaseError) {
        setErrorMessage("Google authentication failed");
      } else if (error instanceof AxiosError && error.response) {
        setErrorMessage(error.response.data.message);
      } else setErrorMessage(error.message || "Something went wrong");
    } finally {
      setLoading(null);
    }
  };

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
            src={LoginIllustrationDark}
            alt="Login Illustration"
            className="w-[400px] mx-auto my-auto"
          />
        </div>

        <div className="w-full md:w-1/2 px-4 my-auto text-center">
          <FormBox
            title="Login"
            errorMessage={errorMessage}
            onSubmit={handleOnLogin}
          >
            <InputBox
              value={formData.username}
              name="username"
              placeholder="Phone number, username, or email"
              type="text"
              onChange={handleOnChange}
            />
            <InputBox
              value={formData.password}
              name="password"
              placeholder="Password"
              type="password"
              onChange={handleOnChange}
            />

            <button
              type="submit"
              className="btn btn-primary border w-full"
              disabled={!!loading}
            >
              {loading || "Login"}
            </button>
          </FormBox>

          <span className="text-[#82919E] font-bold text-base block my-3">
            Continue with
          </span>

          <div id="auth-options">
            <Link
              to="/signup"
              className="btn btn-dark border w-72 block mx-auto p-3"
            >
              <img src={EnvelopeIcon} alt="email" className="inline" />
              <span className="ml-4 text-sm">Sign Up with Email</span>
            </Link>

            <button
              className="btn btn-dark border w-72 mt-5 block mx-auto p-3"
              onClick={handleGoogleLogin}
              disabled={!!loading}
            >
              <img src={GoogleIcon} alt="google" className="inline" />
              <span className="ml-4 text-sm">Continue with Google</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
