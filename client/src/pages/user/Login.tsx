import GloomLinkLogo from "../../assets/images/GloomLink-Logo.svg";
import LoginIllustrationDark from "../../assets/images/Login-Illustration-Dark.svg";
import EnvelopeIcon from "../../assets/icons/Envelope.svg";
import GoogleIcon from "../../assets/icons/Google.svg";
import FormBox from "../../components/FormBox";
import InputBox from "../../components/InputBox";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios, { AxiosError } from "axios";

interface LoginFormType {
  username: string;
  password: string;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormType>({
    username: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState<string>();

  const handleOnLogin: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const validateForm = () => {
      if (!formData.username || !formData.password) {
        setErrorMessage("Please enter username and password");
        return false;
      }
      return true;
    };

    if (validateForm()) {
      try {
        const response = await axios.post(BASE_URL + "/user/login", formData);
        const { accessToken, refreshToken } = response.data.tokens as Record<
          string,
          string
        >;
        
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        navigate("/");
      } catch (error) {
        if (error instanceof AxiosError && error.response) {
          setErrorMessage(error.response.data.message);
        } else setErrorMessage("Something went wrong");
      }
    }
  };

  const handleOnChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div className="py-3 px-4 md:py-6 md:px-14">
        <img src={GloomLinkLogo} alt="GloomLink" className="w-44 md:w-64" />
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

            <button type="submit" className="btn btn-primary border w-full">
              Login
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

            <button className="btn btn-dark border w-72 mt-5 block mx-auto p-3">
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
