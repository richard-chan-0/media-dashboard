import { ReactNode, TdHTMLAttributes } from "react";

type TableCellProps = {
    children: ReactNode;
    isHeader?: boolean;
} & TdHTMLAttributes<HTMLTableCellElement>;

const TableCell = ({ children, isHeader = false, className = "", ...rest }: TableCellProps) => {
    return (
        <td
            className={`border p-2 ${isHeader ? "bg-blue-200" : ""} border-white ${className}`}
            {...rest}
        >
            {children}
        </td>
    );
};

export default TableCell;
