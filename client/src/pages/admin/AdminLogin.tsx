import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import GloomLinkLogo from "@/assets/images/GloomLink-Logo.svg";
import LoginIllustrationDark from "@/assets/images/Login-Illustration-Dark.svg";
import FormBox from "@/components/FormBox";
import { RootState } from "@/redux/store";
import {
  AdminAuthState,
  logout,
  setAuthAdmin,
  TokensState,
} from "@/redux/reducers/auth";
import { LoginFormType, validateLoginForm } from "../user/formValidations";
import { authApiClient } from "@/apiClient";
import { useToaster } from "@/hooks/useToaster";

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const adminData = useSelector((state: RootState) => state.auth.adminData);
  const colorTheme = useSelector((state: RootState) => state.theme.colorTheme);
  const { toastError } = useToaster();
  const [loading, setLoading] = useState<string | null>(null);
  const [formData, setFormData] = useState<LoginFormType>({
    username: "",
    password: "",
  });

  useEffect(() => {
    const adminAccessToken = localStorage.getItem("adminAccessToken");
    if (adminData && adminAccessToken) {
      navigate("/admin");
    } else {
      dispatch(logout({ type: "admin" }));
    }
  }, [adminData]);

  const handleOnLogin = async () => {
    setLoading("Authenticating...");
    const isValidated = validateLoginForm(formData, toastError);

    if (!isValidated) return;

    try {
      const response = await authApiClient.post("/login", {
        ...formData,
        role: "admin",
      });
      const adminData = response.data.userData as AdminAuthState;
      const tokens = response.data.tokens as TokensState;

      dispatch(setAuthAdmin({ adminData, tokens }));
      navigate("/admin");
    } catch (error: any) {
      toastError(error.message);
    } finally {
      setLoading(null);
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
          <FormBox title="Admin Login" onSubmit={handleOnLogin}>
            <input
              placeholder="Username"
              type="text"
              name="username"
              className="input-box"
              onChange={handleOnChange}
            />
            <input
              placeholder="Password"
              type="password"
              name="password"
              className="input-box"
              onChange={handleOnChange}
            />
            <button
              className="btn btn-primary border w-full"
              disabled={!!loading}
              type="submit"
            >
              {loading || "Login"}
            </button>
          </FormBox>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
