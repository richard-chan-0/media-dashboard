import { useState } from "react";
import theme from "../theme";
import { NameChanges } from "../types";
import { removePathFromFilePath, truncateString } from "../utilities";
import NameChangeModal from "./NameChangeModal/NameChangeModal";
import TableCell from "./TableCell";
import { EditPencil, TrashSolid } from "iconoir-react";
import { useDeleteFile } from "../../pages/hooks/useDeleteFile";

type NameChangesTableProps = {
    nameChanges: NameChanges;
};

const NameChangeTable = ({ nameChanges }: NameChangesTableProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState("");
    const deleteFile = useDeleteFile();

    const handleNameEdit = (name: string) => {
        setName(name);
        setIsOpen(true);
    }

    const changes = nameChanges?.changes;
    if (!changes || changes.length == 0) {
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
                        return (
                            <tr key={choice.output}>
                                <TableCell >
                                    {truncateString(removePathFromFilePath(choice.input), 30)}
                                </TableCell>
                                <TableCell >
                                    {truncateString(removePathFromFilePath(choice.output), 30)}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1 justify-center">
                                        <button onClick={() => handleNameEdit(choice.output)}>
                                            <EditPencil className="hover:text-green-400" />
                                        </button>
                                        <button onClick={() => deleteFile(removePathFromFilePath(choice.input))}>
                                            <TrashSolid className={theme.deleteIconColor} />
                                        </button>
                                    </div>
                                </TableCell>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <NameChangeModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                initialName={name}
            />
        </div>
    );
};

export default NameChangeTable;
