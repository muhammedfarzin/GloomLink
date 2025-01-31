import React from "react";

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
  return (
    <div
      className="w-full max-w-[450px] mx-auto rounded-2xl p-4 bg-formBox"
      id="login-box"
    >
      <h3 className="text-center text-3xl font-bold mb-2 text-foreground">
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
