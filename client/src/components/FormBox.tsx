import React from "react";

interface FormBoxProps {
  children: React.ReactNode;
  title: string,
  method?: string;
}

const FormBox: React.FC<FormBoxProps> = ({ children, title, method = "post" }) => {
  return (
    <div
      className="w-full max-w-[450px] mx-auto rounded-2xl p-4 bg-[#505050]"
      id="login-box"
    >
      <h3 className={`text-center text-3xl font-bold text-white mb-2`}>
        {title}
      </h3>
      <form method={method}>
        {children}
      </form>
    </div>
  );
};

export default FormBox;
