import theme from "../../../lib/theme";
import { removePathFromFilePath, truncateString } from "../../../lib/utilities";
import { TableCell } from "../shared";
import { EditPencil } from "iconoir-react";

type MetadataFileTableProps = {
    files: string[];
    wasAdded: string[];
    onClick: (filename: string) => void;
};

/**
 * Simple table component that displays files with only edit buttons
 * Used for metadata-only updates without delete or merge functionality
 */
const MetadataFileTable = ({
    files,
    wasAdded,
    onClick,
}: MetadataFileTableProps) => {
    if (!files || files.length === 0) {
        return <></>;
    }
    return (
        <div className="text-white flex justify-center text-center">
            <table className="w-full">
                <thead className={`${theme.textAppColor}`}>
                    <tr>
                        <TableCell isHeader={true}>Filename</TableCell>
                        <TableCell isHeader={true}>Actions</TableCell>
                    </tr>
                </thead>
                <tbody>
                    {files.map((filename) => {
                        const label = removePathFromFilePath(filename);
                        const isAdded = wasAdded.includes(filename);
                        const iconStyle = isAdded ? "text-blue-400" : "hover:text-green-400";

                        return (
                            <tr key={filename}>
                                <TableCell>
                                    <span title={label}>{truncateString(label, 50)}</span>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1 justify-center">
                                        <button
                                            aria-label="edit button"
                                            title="Edit"
                                            onClick={() => onClick(filename)}
                                        >
                                            <EditPencil className={`${iconStyle}`} />
                                        </button>
                                    </div>
                                </TableCell>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

MetadataFileTable.displayName = "MetadataFileTable";

export default MetadataFileTable;
