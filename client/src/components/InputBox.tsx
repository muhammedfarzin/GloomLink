import React from "react";
import { useSelector } from "react-redux";
import { type RootState } from "../redux/store";

interface InputBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const InputBox: React.FC<InputBoxProps> = ({
  type = "text",
  className,
  ...props
}) => {
  const colorTheme = useSelector((state: RootState) => state.theme.colorTheme);

  return (
    <input
      type={type}
      className={`my-1 ${className}`}
      onFocus={(e) =>
        (e.currentTarget.style.backgroundColor = colorTheme.primary + 'bb')
      }
      onBlur={(e) =>
        (e.currentTarget.style.backgroundColor = colorTheme.primary)
      }
      style={{
        backgroundColor: colorTheme.primary,
        color: colorTheme.text,
      }}
      {...props}
    />
  );
};

export default InputBox;
