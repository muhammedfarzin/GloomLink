import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";

interface TableDataProps extends React.TdHTMLAttributes<HTMLTableCellElement> {}

const TableData: React.FC<TableDataProps> = ({
  children,
  className = "",
  ...props
}) => {
  const colorTheme = useSelector((state: RootState) => state.theme.colorTheme);

  return (
    <td
      className="border-4"
      style={{ borderColor: colorTheme.border }}
      {...props}
    >
      <div
        className={"border w-full h-full rounded-lg px-2 py-1 " + className}
        style={{ backgroundColor: colorTheme.background + "55", borderColor: colorTheme.text + '22' }}
      >
        {children}
      </div>
    </td>
  );
};

export default TableData;
