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
      className={`my-1 disabled:opacity-50 bg-input/80 focus:bg-input text-foreground ${className}`}
      {...props}
    />
  );
};

export default InputBox;
