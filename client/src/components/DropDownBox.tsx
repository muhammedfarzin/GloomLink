import { cn } from "@/lib/utils";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

interface DropDownBoxProps extends React.DetailedHTMLProps<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
> {
  value?: string;
  placeholder?: string;
}

const DropDownBox: React.FC<DropDownBoxProps> = ({
  value,
  placeholder,
  children,
  className = "",
  ...props
}) => {
  const colorTheme = useSelector((state: RootState) => state.theme.colorTheme);

  return (
    <select
      id="gender"
      className={cn(
        "py-2 my-1 bg-primary text-foreground",
        className,
        colorTheme === "dark" ? "white" : "black",
      )}
      value={value || placeholder}
      style={{
        color: value || !placeholder ? "currentcolor" : "#9ca3af",
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
