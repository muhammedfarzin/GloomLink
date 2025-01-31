import React from "react";

export interface InputBoxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const InputBox: React.FC<InputBoxProps> = ({
  type = "text",
  className = "",
  ...props
}) => {
  return (
    <input
      type={type}
      className={`my-1 disabled:opacity-50 bg-input opacity-85 focus:opacity-100 text-foreground ${className}`}
      {...props}
    />
  );
};

export default InputBox;
