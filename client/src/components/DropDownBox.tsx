import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

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
  const colorTheme = useSelector((state: RootState) => state.theme.colorTheme);

  return (
    <select
      id="gender"
      className={`py-2 my-1 ${placeholderClassName} ${className} ${
        colorTheme.text === "#ffffff" ? "white" : "black"
      }`}
      value={value || placeholder}
      style={{
        backgroundColor: colorTheme.primary,
        color: value || !placeholder ? colorTheme.text : "#9ca3af",
      }}
      {...props}
    >
      {placeholder ? (
        <option disabled hidden>
          {placeholder}
        </option>
      ) : null}

      {children}
    </select>
  );
};

export default DropDownBox;
