import { RootState } from "@/redux/store";
import React from "react";
import { useSelector } from "react-redux";

interface FormBoxProps
  extends React.DetailedHTMLProps<
    React.FormHTMLAttributes<HTMLFormElement>,
    HTMLFormElement
  > {
  children: React.ReactNode;
  title: string;
  method?: string;
  errorMessage?: string;
}

const FormBox: React.FC<FormBoxProps> = ({
  children,
  title,
  method = "post",
  errorMessage,
  ...props
}) => {
  const colorTheme = useSelector((state: RootState) => state.theme.colorTheme);

  return (
    <div
      className="w-full max-w-[450px] mx-auto rounded-2xl p-4"
      id="login-box"
      style={{
        backgroundColor: colorTheme.formBackground,
      }}
    >
      <h3
        className={`text-center text-3xl font-bold mb-2`}
        style={{ color: colorTheme.text }}
      >
        {title}
      </h3>
      <form method={method} {...props}>
        {errorMessage ? (
          <p className="text-red-500 font-bold text-xs">{errorMessage}</p>
        ) : null}
        {children}
      </form>
    </div>
  );
};

export default FormBox;
