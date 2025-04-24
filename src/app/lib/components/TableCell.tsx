import { ReactNode } from "react";

type TableCellProps = {
    children: ReactNode
    isHeader?: boolean
}

const TableCell = ({ children, isHeader = false }: TableCellProps) => {
    return (
        <>
            <td className={`border p-2 ${isHeader ? "bg-blue-200" : ""} border-white`}>
                {children}
            </td>
        </>
    );
};

export default TableCell;