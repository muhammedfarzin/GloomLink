import FormBox from "../../components/FormBox";
import InputBox from "../../components/InputBox";
import GloomLinkLogo from "../../assets/images/GloomLink-Logo.svg";
import SignUpIllustrationDark from "../../assets/images/SignUp-Illustration-Dark.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import DropDownBox from "../../components/DropDownBox";

const maxDate = new Date(new Date().setFullYear(new Date().getFullYear() - 5));
const Signup = () => {
  const [dob, setDob] = useState<Date>();
  const [gender, setGender] = useState<string>();

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

        <div className="w-full md:w-1/2 px-4 my-auto text-center">
          <FormBox title="Sign Up">
            <div className="flex gap-2">
              <InputBox placeholder="First name" type="text" />
              <InputBox placeholder="Last name" type="text" />
            </div>

            <InputBox placeholder="Username" type="text" />
            <InputBox placeholder="Email" type="email" />

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
                placeholderText="Date of Birth"
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

            <InputBox placeholder="Password" type="password" />
            <InputBox placeholder="Confirm password" type="password" />

            <button className="btn btn-primary border w-full">Sign Up</button>
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
