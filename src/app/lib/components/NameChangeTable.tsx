import React, { useState } from "react";
import theme from "../theme";
import { NameChanges } from "../types";
import { removePathFromFilePath, truncateString } from "../utilities";
import MetadataChangeModal from "./MetadataChangeModal/MetadataChangeModal";
import TableCell from "./TableCell";
import { EditPencil, TrashSolid } from "iconoir-react";
import { useDeleteFile } from "../../pages/hooks/useDeleteFile";
import NameChangeModal from "./NameChangeModal/NameChangeModal";
import { VIDEOS } from "../constants";
import { MetadataChange } from "../types";

type NameChangesTableProps = {
    nameChanges: NameChanges;
    mediaType?: string;
    onEdit: (filename: string, newChange: MetadataChange, isMetadataChange: boolean) => void;
};

const NameChangeTable = React.memo(({ nameChanges, mediaType, onEdit }: NameChangesTableProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentName, setCurrentName] = useState("");
    const [suggestedName, setSuggestedName] = useState("");
    const deleteFile = useDeleteFile();

    const handleNameEdit = (current: string, suggestion: string) => {
        setCurrentName(current);
        setSuggestedName(suggestion);
        setIsOpen(true);
    };

    const changes = nameChanges?.changes;
    console.log("Rendering NameChangeTable with changes:", changes);
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
                    {changes.map((choice) => (
                        <tr key={choice.output}>
                            <TableCell>
                                <span title={removePathFromFilePath(choice.input)}>{truncateString(removePathFromFilePath(choice.input), 30)}</span>
                            </TableCell>
                            <TableCell>
                                {truncateString(removePathFromFilePath(choice.output), 30)}
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-1 justify-center">
                                    <button onClick={() => handleNameEdit(choice.input, choice.output)}>
                                        <EditPencil className="hover:text-green-400" />
                                    </button>
                                    <button onClick={() => deleteFile(removePathFromFilePath(choice.input))}>
                                        <TrashSolid className={theme.deleteIconColor} />
                                    </button>
                                </div>
                            </TableCell>
                        </tr>
                    ))}
                </tbody>
            </table>
            {mediaType === VIDEOS ? (
                <MetadataChangeModal
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    currentName={currentName}
                    suggestedName={suggestedName}
                    onEdit={onEdit}
                />
            ) : (
                <NameChangeModal
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    initialName={suggestedName}
                />
            )}
        </div>
    );
});

NameChangeTable.displayName = "NameChangeTable";

export default NameChangeTable;
