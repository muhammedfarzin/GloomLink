import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import { RootState } from "@/redux/store";

interface IconButtonProps {
  icon: string;
  alt?: string;
  className?: string;
  iconClassName?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  alt,
  className = "",
  iconClassName,
  onClick,
  disabled = false,
}) => {
  const colorTheme = useSelector((state: RootState) => state.theme.colorTheme);

  return (
    <Button
      variant="ghost"
      className={className + " aspect-square p-1"}
      onClick={onClick}
      disabled={disabled}
      style={{
        filter: `invert(${colorTheme.text === "#ffffff" ? 0 : 1})`,
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.backgroundColor = "#9ca3af66")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.backgroundColor = "transparent")
      }
    >
      <img src={icon} alt={alt} className={iconClassName} />
    </Button>
  );
};

export default IconButton;
