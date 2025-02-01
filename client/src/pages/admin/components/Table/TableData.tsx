interface TableDataProps extends React.TdHTMLAttributes<HTMLTableCellElement> {}

const TableData: React.FC<TableDataProps> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <td
      className="border-4 border-border"
      {...props}
    >
      <div
        className={"border w-full h-full rounded-lg px-2 py-1 bg-background/35 border-foreground/15 " + className}
      >
        {children}
      </div>
    </td>
  );
};

export default TableData;
