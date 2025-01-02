import GloomLinkLogo from "../../assets/images/GloomLink-Logo.svg";
import LoginIllustrationDark from "../../assets/images/Login-Illustration-Dark.svg";
import FormBox from "../../components/FormBox";
import InputBox from "../../components/InputBox";

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
          <FormBox title="Admin Login">
            <InputBox placeholder="Username" type="text" />
            <InputBox placeholder="Password" type="password" />
            <button className="btn btn-primary border w-full">Login</button>
          </FormBox>
        </div>
      </div>
    </>
  );
};

export default Login;
