interface TableProps
  extends React.DetailedHTMLProps<
    React.TableHTMLAttributes<HTMLTableElement>,
    HTMLTableElement
  > {
  headings?: string[];
}

const Table: React.FC<TableProps> = ({ headings, children, ...props }) => {
  return (
    <div className="rounded-xl p-1 bg-border">
      <table className="w-full" {...props}>
        <thead>
          <tr>
            {headings?.map((heading, index) => (
              <th className="border-4 border-border" key={index}>
                <div className="w-full h-full rounded-lg px-2 py-1 bg-background">
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
