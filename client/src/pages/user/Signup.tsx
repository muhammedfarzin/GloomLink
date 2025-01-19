import FormBox from "../../components/FormBox";
import InputBox from "../../components/InputBox";
import GloomLinkLogo from "../../assets/images/GloomLink-Logo.svg";
import SignUpIllustrationDark from "../../assets/images/SignUp-Illustration-Dark.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DropDownBox from "../../components/DropDownBox";
import axios, { AxiosError } from "axios";
import { validateSignUpForm, type SignUpFormType } from "./formValidations";
import {
  logout,
  setAuthUser,
  type TokensState,
  type UserAuthState,
} from "../../redux/reducers/auth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const maxDate = new Date(new Date().setFullYear(new Date().getFullYear() - 5));
const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.auth.userData);
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
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken && userData && userData.status !== "blocked") {
      navigate("/");
    } else {
      dispatch(logout({ type: "user" }));
    }
  }, [userData]);

  const handleOnSignup: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      setLoading("Signing up...");
      const isValidated = validateSignUpForm(formData, setErrorMessage);
      if (!isValidated) return;

      const response = await axios.post("/api/user/signup", {
        ...formData,
        dob: dob?.toISOString(),
        gender: gender,
      });

      const userData = response.data.userData as UserAuthState;
      const tokens = response.data.tokens as TokensState;

      dispatch(setAuthUser({ userData, tokens }));
      navigate("/signup/verify");
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        setErrorMessage(error.response.data.message);
      } else setErrorMessage("Something went wrong");
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
        <img src={GloomLinkLogo} alt="GloomLink" className="w-44 md:w-64" />
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
          <FormBox
            title="Sign Up"
            errorMessage={errorMessage}
            onSubmit={handleOnSignup}
          >
            <div className="flex gap-2">
              <InputBox
                value={formData.firstname}
                name="firstname"
                onChange={handleOnChange}
                placeholder="First name"
                type="text"
              />
              <InputBox
                value={formData.lastname}
                name="lastname"
                onChange={handleOnChange}
                placeholder="Last name"
                type="text"
              />
            </div>

            <InputBox
              value={formData.username}
              name="username"
              onChange={handleOnChange}
              placeholder="Username"
              type="text"
            />
            <InputBox
              value={formData.email}
              name="email"
              onChange={handleOnChange}
              placeholder="Email"
              type="email"
            />
            <InputBox
              value={formData.mobile}
              name="mobile"
              onChange={handleOnChange}
              placeholder="Mobile"
              type="number"
            />

            <div className="flex gap-2">
              <DropDownBox
                placeholder="Gender (Optional)"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="m">Male</option>
                <option value="f">Female</option>
              </DropDownBox>

              <DatePicker
                selected={dob}
                onChange={(date) => date && setDob(date)}
                placeholderText="Date of Birth (Optional)"
                maxDate={maxDate}
                dateFormat="dd-MMM-yyyy"
                wrapperClassName="input my-1"
                className="bg-[#353535] text-white"
                calendarClassName="!bg-[#353535]"
                monthClassName={() => "text-[blue]"}
                dayClassName={(date) =>
                  date < maxDate
                    ? "!text-white hover:!bg-[#585858]"
                    : "!text-white opacity-25"
                }
              />
            </div>

            <InputBox
              value={formData.password}
              name="password"
              onChange={handleOnChange}
              placeholder="Password"
              type="password"
            />
            <InputBox
              value={formData.confirmPassword}
              name="confirmPassword"
              onChange={handleOnChange}
              placeholder="Confirm password"
              type="password"
            />

            <button
              type="submit"
              className="btn btn-primary border w-full"
              disabled={!!loading}
            >
              {loading ?? "Sign Up"}
            </button>
          </FormBox>

          <Link
            to="/login"
            className="btn btn-dark border w-72 block mx-auto !mt-4 p-3"
          >
            <span className="ml-4 text-sm">Already have an account?</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Signup;
