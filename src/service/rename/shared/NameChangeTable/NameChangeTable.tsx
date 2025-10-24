import theme from "../../../../lib/theme";
import { NameChanges } from "../../../../lib/types";
import { removePathFromFilePath, truncateString } from "../../../../lib/utilities";
import { TableCell } from "..";
import { EditPencil, Scissor } from "iconoir-react";
import { useDeleteFile } from "../../../../lib/hooks/useDeleteFile";
import TrashButton from "../../../../lib/components/TrashButton/TrashButton";
import { TASK_EDIT, TASK_MERGE } from "../../../../lib/constants";

type NameChangesTableProps = {
    nameChanges: NameChanges;
    wasAdded: string[];
    onClick: (current: string, suggestion: string) => void;
    changeType: typeof TASK_EDIT | typeof TASK_MERGE;
};

const NameChangeTable = ({
    nameChanges,
    wasAdded,
    onClick,
    changeType
}: NameChangesTableProps) => {
    const deleteFile = useDeleteFile();

    const changes = nameChanges?.changes;
    if (!changes || changes.length === 0) {
        return <></>;
    }

    return (
        <div className="text-white flex justify-center text-center">
            <table className="w-full">
                <thead className={`${theme.textAppColor}`}>
                    <tr>
                        <TableCell isHeader={true}>Before</TableCell>
                        <TableCell isHeader={true}>After</TableCell>
                        <TableCell isHeader={true}>Actions</TableCell>
                    </tr>
                </thead>
                <tbody>
                    {changes.map((choice) => {
                        const filename = changeType === TASK_EDIT ? choice.input : removePathFromFilePath(choice.input);
                        const isAdded = wasAdded.includes(filename);
                        const iconStyle = isAdded ? "text-blue-400" : "hover:text-green-400";

                        return (
                            <tr key={choice.output}>
                                <TableCell>
                                    <span title={removePathFromFilePath(choice.input)}>{truncateString(removePathFromFilePath(choice.input), 30)}</span>
                                </TableCell>
                                <TableCell>
                                    {truncateString(removePathFromFilePath(choice.output), 30)}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1 justify-center">
                                        <button
                                            aria-label={changeType === TASK_EDIT ? "edit button" : "merge button"}
                                            title={changeType === TASK_EDIT ? "Edit" : "Merge"}
                                            onClick={() => onClick(choice.input, choice.output)}
                                        >
                                            {changeType === TASK_EDIT ? (
                                                <EditPencil className={`${iconStyle}`} />
                                            ) : (
                                                <Scissor className={`${iconStyle}`} />
                                            )}
                                        </button>
                                        <TrashButton onClick={() => deleteFile(removePathFromFilePath(choice.input))} />
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

NameChangeTable.displayName = "NameChangeTable";

export default NameChangeTable;
