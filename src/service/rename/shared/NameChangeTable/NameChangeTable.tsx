import React, { useState } from "react";
import theme from "../../../../lib/theme";
import { NameChanges } from "../../../../lib/types";
import { removePathFromFilePath, truncateString } from "../../../../lib/utilities";
import MetadataChangeModal from "../../videos/MetadataChangeModal/MetadataChangeModal";
import { TableCell } from "..";
import { EditPencil, TrashSolid } from "iconoir-react";
import { useDeleteFile } from "../../../../lib/hooks/useDeleteFile";
import NameChangeModal from "../NameChangeModal/NameChangeModal";
import { VIDEOS } from "../../../../lib/constants";
import { MetadataChange } from "../../../../lib/types";

type NameChangesTableProps = {
    nameChanges: NameChanges;
    mediaType?: string;
    onEdit: (filename: string, newChange: MetadataChange | undefined) => void;
};

const NameChangeTable = ({ nameChanges, mediaType, onEdit }: NameChangesTableProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentName, setCurrentName] = useState("");
    const [suggestedName, setSuggestedName] = useState("");
    const [wasEditedList, setWasEditedList] = useState<string[]>([]);
    const deleteFile = useDeleteFile();

    const handleEdit = (current: string, suggestion: string) => {
        setCurrentName(current);
        setSuggestedName(suggestion);
        setIsOpen(true);
    };

    const changes = nameChanges?.changes;
    if (!changes || changes.length === 0) {
        return <></>;
    }

    const onTableEdit = (filename: string, newChange: MetadataChange | undefined) => {
        if (newChange !== undefined && wasEditedList.includes(filename) === false) {
            setWasEditedList((prev) => [...prev, filename]);
        }
        onEdit(filename, newChange);
    }

    const onModalClose = () => {
        setIsOpen(false);
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
                        const editPencilStyle = wasEditedList.includes(choice.input) ? "text-blue-400" : "hover:text-green-400";
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
                                            aria-label="edit button"
                                            title="Edit"
                                            onClick={() => handleEdit(choice.input, choice.output)}
                                        >
                                            <EditPencil
                                                className={`hover:text-green-400 ${editPencilStyle}`}
                                            />
                                        </button>
                                        <button
                                            aria-label="delete button"
                                            title="Delete"
                                            onClick={() => deleteFile(removePathFromFilePath(choice.input))}
                                        >
                                            <TrashSolid className={theme.deleteIconColor} />
                                        </button>
                                    </div>
                                </TableCell>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            {mediaType === VIDEOS ? (
                <MetadataChangeModal
                    isOpen={isOpen}
                    onClose={onModalClose}
                    currentName={currentName}
                    suggestedName={suggestedName}
                    onEdit={onTableEdit}
                />
            ) : (
                <NameChangeModal
                    isOpen={isOpen}
                    onClose={onModalClose}
                    initialName={suggestedName}
                />
            )}
        </div>
    );
};

NameChangeTable.displayName = "NameChangeTable";

export default NameChangeTable;
