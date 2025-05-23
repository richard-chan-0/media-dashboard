import { useState } from "react";
import theme from "../theme";
import { NameChanges } from "../types";
import { removePathFromFilePath } from "../utilities";
import NameChangeModal from "./NameChangeModal";
import TableCell from "./TableCell";
import { EditPencil } from "iconoir-react";

type NameChangesTableProps = {
    nameChanges: NameChanges;
};

const NameChangeTable = ({ nameChanges }: NameChangesTableProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState("");

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
                    </tr>
                </thead>
                <tbody>
                    {changes.map((choice) => {
                        return (
                            <tr key={choice.output}>
                                <TableCell>
                                    {removePathFromFilePath(choice.input)}
                                </TableCell>
                                <TableCell className="flex justify-between items-center ">
                                    {removePathFromFilePath(choice.output)}
                                    <button onClick={() => handleNameEdit(choice.output)}>
                                        <EditPencil className="hover:text-green-400" />
                                    </button>
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
