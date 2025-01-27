import React from "react";
import { useSelector } from "react-redux";
import { type RootState } from "../redux/store";

export interface InputBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  backgroundColor?: string;
}

const InputBox: React.FC<InputBoxProps> = ({
  type = "text",
  className,
  backgroundColor,
  ...props
}) => {
  const colorTheme = useSelector((state: RootState) => state.theme.colorTheme);
  const backgroundColorTheme = backgroundColor || colorTheme.primary;

  return (
    <input
      type={type}
      className={`my-1 disabled:opacity-50 ${className}`}
      onFocus={(e) =>
        (e.currentTarget.style.backgroundColor = backgroundColorTheme + 'dc')
      }
      onBlur={(e) =>
        (e.currentTarget.style.backgroundColor = backgroundColorTheme)
      }
      style={{
        backgroundColor: backgroundColorTheme,
        color: colorTheme.text,
      }}
      {...props}
    />
  );
};

export default InputBox;
