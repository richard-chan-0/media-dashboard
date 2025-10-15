import { useState } from "react";
import theme from "../../../../lib/theme";
import { MetadataMergeChange, NameChanges } from "../../../../lib/types";
import { removePathFromFilePath, truncateString } from "../../../../lib/utilities";
import MetadataEditChangeModal from "../../videos/MetadataEditChangeModal/MetadataEditChangeModal";
import { TableCell } from "..";
import { EditPencil, Scissor } from "iconoir-react";
import { useDeleteFile } from "../../../../lib/hooks/useDeleteFile";
import NameChangeModal from "../NameChangeModal/NameChangeModal";
import { VIDEOS } from "../../../../lib/constants";
import { MetadataEditChange } from "../../../../lib/types";
import MetadataMergeChangeModal from "../../videos/MetadataMergeChangeModal/MetadataMergeChangeModal";
import TrashButton from "../../../../lib/components/TrashButton/TrashButton";

type NameChangesTableProps = {
    nameChanges: NameChanges;
    mediaType?: string;
    onEdit: (filename: string, newChange: MetadataEditChange | undefined) => void;
    onMerge: (newChange: MetadataMergeChange | undefined) => void;
};

const NameChangeTable = ({ nameChanges, mediaType, onEdit, onMerge }: NameChangesTableProps) => {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isMergeOpen, setIsMergeOpen] = useState(false);
    const [currentName, setCurrentName] = useState("");
    const [suggestedName, setSuggestedName] = useState("");
    const [wasEditAdded, setWasEditAddedList] = useState<string[]>([]);
    const [wasMergeAdded, setWasMergeAddedList] = useState<string[]>([]);

    const deleteFile = useDeleteFile();

    const handleEdit = (current: string, suggestion: string) => {
        setCurrentName(current);
        setSuggestedName(suggestion);
        setIsEditOpen(true);
    };

    const handleMerge = (current: string) => {
        setCurrentName(current);
        setIsMergeOpen(true);
    }

    const changes = nameChanges?.changes;
    if (!changes || changes.length === 0) {
        return <></>;
    }

    const onTableEdit = (filename: string, newChange: MetadataEditChange | undefined) => {
        if (newChange !== undefined && wasEditAdded.includes(filename) === false) {
            setWasEditAddedList((prev) => [...prev, filename]);
        }
        onEdit(filename, newChange);
    }
    const onTableMerge = (newChange: MetadataMergeChange | undefined) => {
        if (newChange !== undefined && wasMergeAdded.includes(newChange.filename) === false) {
            setWasMergeAddedList((prev) => [...prev, newChange.filename]);
        }
        onMerge(newChange);
    }

    const onEditModalClose = () => {
        setIsEditOpen(false);
    }
    const onMergeModalClose = () => {
        setIsMergeOpen(false);
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

                        const editPencilStyle = wasEditAdded.includes(choice.input) ? "text-blue-400" : "hover:text-green-400";

                        const mergeScissorStyle = wasMergeAdded.includes(removePathFromFilePath(choice.input)) ? "text-blue-400" : "hover:text-indigo-400";
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
                                            aria-label="merge button"
                                            title="Merge"
                                            onClick={() => handleMerge(choice.input)}
                                        >
                                            <Scissor
                                                className={`${mergeScissorStyle}`}
                                            />
                                        </button>
                                        <button
                                            aria-label="edit button"
                                            title="Edit"
                                            onClick={() => handleEdit(choice.input, choice.output)}
                                        >
                                            <EditPencil
                                                className={`${editPencilStyle}`}
                                            />
                                        </button>
                                        <TrashButton onClick={() => deleteFile(removePathFromFilePath(choice.input))} />
                                    </div>
                                </TableCell>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            {mediaType === VIDEOS ? (
                <MetadataEditChangeModal
                    isOpen={isEditOpen}
                    onClose={onEditModalClose}
                    currentName={currentName}
                    suggestedName={suggestedName}
                    onEdit={onTableEdit}
                />
            ) : (
                <NameChangeModal
                    isOpen={isEditOpen}
                    onClose={onEditModalClose}
                    initialName={suggestedName}
                />
            )}
            <MetadataMergeChangeModal
                isOpen={isMergeOpen}
                onClose={onMergeModalClose}
                currentName={currentName}
                onMerge={onTableMerge}
            />
        </div>
    );
};

NameChangeTable.displayName = "NameChangeTable";

export default NameChangeTable;
