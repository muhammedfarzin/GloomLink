import { useSelector } from "react-redux";
import { Link, type LinkProps } from "react-router-dom";
import { RootState } from "../redux/store";

interface MenuButtonProps extends LinkProps {
  icon: string;
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

  return (
    <Link
      className={`btn-flex btn-primary ${className || ''}`}
      {...props}
      style={{ backgroundColor: selected ? colorTheme.selection : undefined }}
    >
      <img
        src={icon}
        alt={alt ?? text}
        className={`inline w-6 mx-4 my-1 ${iconClassName || ''}`}
      />
      {text}
    </Link>
  );
};

export default MenuButton;
