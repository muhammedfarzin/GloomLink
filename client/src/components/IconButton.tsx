import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import { RootState } from "@/redux/store";
import { cn } from "@/lib/utils";

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
      className={cn("aspect-square p-1 hover:bg-[#9ca3af66]", className)}
      onClick={onClick}
      disabled={disabled}
      style={{
        filter: `invert(${colorTheme === "dark" ? 0 : 1})`,
      }}
    >
      <img src={icon} alt={alt} className={iconClassName} />
    </Button>
  );
};

export default IconButton;
