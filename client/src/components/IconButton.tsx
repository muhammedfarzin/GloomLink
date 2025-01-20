import { Button } from "./ui/button";

interface IconButtonProps {
  icon: string;
  alt?: string;
  className?: string;
  iconClassName?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  alt,
  className = "",
  iconClassName,
  onClick,
}) => {
  return (
    <Button
      variant="ghost"
      className={className + " aspect-square p-1"}
      onClick={onClick}
    >
      <img src={icon} alt={alt} className={iconClassName} />
    </Button>
  );
};

export default IconButton;
