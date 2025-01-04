import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  backgroundColor?: string;
}

const Button: React.FC<ButtonProps> = ({
  className = "",
  backgroundColor,
  ...props
}) => {
  const colorTheme = useSelector((state: RootState) => state.theme.colorTheme);
  const bgColor = backgroundColor || colorTheme.primary;

  return (
    <button
      className={"rounded-md px-2 py-1 " + className}
      style={{ backgroundColor: bgColor }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.backgroundColor = bgColor + "bb")
      }
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = bgColor)}
      {...props}
    />
  );
};

export default Button;
