interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  backgroundColor?: string;
}

const Button: React.FC<ButtonProps> = ({
  className = "",
  backgroundColor,
  ...props
}) => {
  return (
    <button
      className={
        "rounded-md px-2 py-1 disabled:opacity-50 disabled:cursor-not-allowed bg-primary " +
        className
      }
      {...props}
    />
  );
};

export default Button;
