import FormBox from "../../components/FormBox";
import GloomLinkLogo from "../../assets/images/GloomLink-Logo.svg";
import SignUpIllustrationDark from "../../assets/images/SignUp-Illustration-Dark.svg";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DropDownBox from "../../components/DropDownBox";
import {
  applyServerFormErrors,
  validateSignUpFields,
  type FieldErrors,
  type SignUpFormType,
} from "@/lib/formValidations";
import FieldError from "@/components/FieldError";
import { logout } from "../../redux/reducers/auth";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import DateInput from "@/components/DateInput";
import { authApiClient } from "@/apiClient";
import { useToaster } from "@/hooks/useToaster";
import { SESSION_STORAGE_KEYS } from "@/constants/storageKeys";

const maxDate = new Date(new Date().setFullYear(new Date().getFullYear() - 5));
const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const colorTheme = useSelector((state: RootState) => state.theme.colorTheme);
  const userData = useSelector((state: RootState) => state.auth.userData);
  const { toastError } = useToaster();
  const [loading, setLoading] = useState<string | null>(null);
  const [formData, setFormData] = useState<SignUpFormType>({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });
  const [dob, setDob] = useState<Date>();
  const [gender, setGender] = useState<string>();
  const [errors, setErrors] = useState<FieldErrors>({});

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken && userData && userData.status !== "blocked") {
      navigate("/");
    } else {
      dispatch(logout({ type: "user" }));
    }
  }, [userData]);

  const handleOnSignup = async () => {
    try {
      setLoading("Signing up...");
      const validationErrors = validateSignUpFields(formData);
      setErrors(validationErrors);
      if (Object.keys(validationErrors).length) return;

      const response = await authApiClient.post("/signup", {
        ...formData,
        dob: dob?.toISOString(),
        gender: gender,
      });

      sessionStorage.setItem(
        SESSION_STORAGE_KEYS.verificationEmail,
        response.data.verificationEmail,
      );
      navigate("verify");
    } catch (error: any) {
      const serverErrors = applyServerFormErrors(error);
      if (Object.keys(serverErrors).length) {
        setErrors((current) => ({ ...current, ...serverErrors }));
      } else toastError(error.message);
    } finally {
      setLoading(null);
    }
  };

  const handleOnChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((current) => ({ ...current, [e.target.name]: "" }));
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
            src={SignUpIllustrationDark}
            alt="SignUp Illustration"
            className="w-[400px] mx-auto my-auto"
          />
        </div>

        <div className="w-full md:w-1/2 px-4 my-auto text-center md:mt-[-2.5rem]">
          <FormBox title="Sign Up" onSubmit={handleOnSignup}>
            <div className="flex gap-2">
              <input
                className="input-box"
                aria-invalid={!!errors.firstname}
                value={formData.firstname}
                name="firstname"
                onChange={handleOnChange}
                placeholder="First name"
                type="text"
              />
              <input
                className="input-box"
                aria-invalid={!!errors.lastname}
                value={formData.lastname}
                name="lastname"
                onChange={handleOnChange}
                placeholder="Last name"
                type="text"
              />
            </div>
            <div className="flex gap-2">
              <div className="w-1/2">
                <FieldError message={errors.firstname} />
              </div>
              <div className="w-1/2">
                <FieldError message={errors.lastname} />
              </div>
            </div>

            <input
              className="input-box"
              aria-invalid={!!errors.username}
              value={formData.username}
              name="username"
              onChange={handleOnChange}
              placeholder="Username"
              type="text"
            />
            <FieldError message={errors.username} />
            <input
              className="input-box"
              aria-invalid={!!errors.email}
              value={formData.email}
              name="email"
              onChange={handleOnChange}
              placeholder="Email"
              type="email"
            />
            <FieldError message={errors.email} />
            <input
              className="input-box"
              aria-invalid={!!errors.mobile}
              value={formData.mobile}
              name="mobile"
              onChange={handleOnChange}
              placeholder="Mobile"
              type="number"
            />
            <FieldError message={errors.mobile} />

            <div className="flex gap-2 items-center">
              <DropDownBox
                placeholder="Gender (Optional)"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="m">Male</option>
                <option value="f">Female</option>
              </DropDownBox>

              <DateInput
                date={dob}
                maxDate={maxDate}
                setDate={setDob}
                className="w-full"
              />
            </div>

            <input
              className="input-box"
              aria-invalid={!!errors.password}
              value={formData.password}
              name="password"
              onChange={handleOnChange}
              placeholder="Password"
              type="password"
            />
            <FieldError message={errors.password} />
            <input
              className="input-box"
              aria-invalid={!!errors.confirmPassword}
              value={formData.confirmPassword}
              name="confirmPassword"
              onChange={handleOnChange}
              placeholder="Confirm password"
              type="password"
            />
            <FieldError message={errors.confirmPassword} />

            <button
              type="submit"
              className="btn btn-primary border w-full p-2"
              disabled={!!loading}
            >
              {loading ?? "Sign Up"}
            </button>
          </FormBox>

          <Link
            to="../login"
            className="btn btn-dark border w-72 block mx-auto !mt-4 p-2"
          >
            <span className="ml-4 text-sm">Already have an account?</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Signup;
