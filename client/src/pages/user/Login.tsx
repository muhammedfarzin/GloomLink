import GloomLinkLogo from "../../assets/GloomLink-Logo.svg";
import LoginIllustrationDark from "../../assets/Login-Illustration-Dark.svg";
import EnvelopeIcon from "../../assets/Envelope.svg";
import GoogleIcon from "../../assets/Google.svg";
import FormBox from "../../components/FormBox";
import InputBox from "../../components/InputBox";
import { Link } from "react-router-dom";

const Login: React.FC = () => {
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
          <FormBox title="Login">
            <InputBox placeholder="Phone number, username, or email" type="text" />
            <InputBox placeholder="Password" type="password" />
            <button className="btn btn-primary border w-full">Login</button>
          </FormBox>

          <span className="text-[#82919E] font-bold text-base block my-3">
            Continue with
          </span>

          <div id="auth-options">
            <Link
              to="/signup"
              className="btn btn-dark border w-72 block mx-auto"
            >
              <img src={EnvelopeIcon} alt="email" className="inline" />
              <span className="ml-4 text-sm">Sign Up with Email</span>
            </Link>

            <button className="btn btn-dark border w-72 mt-5 block mx-auto">
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
