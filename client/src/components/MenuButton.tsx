import { useSelector } from "react-redux";
import { Link, type LinkProps } from "react-router-dom";
import { RootState } from "../redux/store";

interface MenuButtonProps extends LinkProps {
  icon?: string;
  text: string;
  iconClassName?: string;
  alt?: string;
  selected?: boolean;
}

const MenuButton: React.FC<MenuButtonProps> = ({
  icon,
  text,
  className,
  iconClassName,
  alt,
  selected,
  ...props
}) => {
  const colorTheme = useSelector((state: RootState) => state.theme.colorTheme);
  const backgroundColor = selected ? colorTheme.selection : colorTheme.primary;

  return (
    <Link
      className={`btn-flex btn-primary ${className || ""}`}
      style={{ backgroundColor}}
      onMouseEnter={(e) =>
        (e.currentTarget.style.backgroundColor = backgroundColor + "bb")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.backgroundColor = backgroundColor)
      }
      {...props}
    >
      {icon ? (
        <img
          src={icon}
          alt={alt ?? text}
          className={`inline w-6 h-6 mr-4 ${iconClassName || ""}`}
        />
      ) : null}
      {text}
    </Link>
  );
};

export default MenuButton;
