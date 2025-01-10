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
  className,
  iconClassName,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={className ?? "hover:bg-[#6b728033] rounded-lg p-1"}
    >
      <img
        src={icon}
        alt={alt}
        className={iconClassName ?? "w-7 h-7 object-contain"}
      />
    </button>
  );
};

export default IconButton;
