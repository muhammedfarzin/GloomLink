import { useEffect, useState } from "react";
import GloomLinkLogo from "../../assets/images/GloomLink-Logo.svg";
import LoginIllustrationDark from "../../assets/images/Login-Illustration-Dark.svg";
import FormBox from "../../components/FormBox";
import InputBox from "../../components/InputBox";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import {
  AdminAuthState,
  logout,
  setAuthAdmin,
  TokensState,
} from "../../redux/reducers/auth";
import { LoginFormType, validateLoginForm } from "../user/formValidations";
import adminApiClient from "@/adminApiClient";

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const adminData = useSelector((state: RootState) => state.auth.adminData);
  const colorTheme = useSelector((state: RootState) => state.theme.colorTheme);
  const [formData, setFormData] = useState<LoginFormType>({
    username: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const adminAccessToken = localStorage.getItem("adminAccessToken");
    if (adminData && adminAccessToken) {
      navigate("/admin");
    } else {
      dispatch(logout({ type: "admin" }));
    }
  }, [adminData]);

  const handleOnLogin: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const isValidated = validateLoginForm(formData, setErrorMessage);

    if (!isValidated) return;

    try {
      const response = await adminApiClient.post("/login", formData);
      const adminData = response.data.userData as AdminAuthState;
      const tokens = response.data.tokens as TokensState;

      dispatch(setAuthAdmin({ adminData, tokens }));
      navigate("/admin");
    } catch (error: any) {
      setErrorMessage(error.message || "Something went wrong");
    }
  };

  const handleOnChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
            title="Admin Login"
            errorMessage={errorMessage}
            onSubmit={handleOnLogin}
          >
            <InputBox
              placeholder="Username"
              type="text"
              name="username"
              onChange={handleOnChange}
            />
            <InputBox
              placeholder="Password"
              type="password"
              name="password"
              onChange={handleOnChange}
            />
            <button className="btn btn-primary border w-full">Login</button>
          </FormBox>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
