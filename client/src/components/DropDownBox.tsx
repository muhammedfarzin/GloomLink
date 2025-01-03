interface DropDownBoxProps
  extends React.DetailedHTMLProps<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  > {
  value?: string;
  placeholder?: string;
  placeholderClassName?: string;
}

const DropDownBox: React.FC<DropDownBoxProps> = ({
  value,
  placeholder,
  children,
  className = "",
  placeholderClassName,
  ...props
}) => {
  return (
    <select
      id="gender"
      className={`bg-[#353535] py-2 my-1 ${
        value ? "text-white" : placeholderClassName ?? "text-[#9ca3af]"
      } ${className}`}
      value={value}
      {...props}
    >
      <option disabled selected={!value} hidden>
        {placeholder}
      </option>

      {children}
    </select>
  );
};

export default DropDownBox;
