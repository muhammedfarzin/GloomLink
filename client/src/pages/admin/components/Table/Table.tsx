import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";

interface TableProps
  extends React.DetailedHTMLProps<
    React.TableHTMLAttributes<HTMLTableElement>,
    HTMLTableElement
  > {
  headings?: string[];
}

const Table: React.FC<TableProps> = ({ headings, children, ...props }) => {
  const colorTheme = useSelector((state: RootState) => state.theme.colorTheme);

  return (
    <div className="rounded-xl p-1" style={{ backgroundColor: colorTheme.border }}>
      <table className="w-full" {...props}>
        <thead>
          <tr>
            {headings?.map((heading, index) => (
              <th
                className="border-4"
                key={index}
                style={{ borderColor: colorTheme.border }}
              >
                <div
                  className="w-full h-full rounded-lg px-2 py-1"
                  style={{ backgroundColor: colorTheme.background }}
                >
                  {heading}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>{children}</tbody>
      </table>
    </div>
  );
};

export default Table;
