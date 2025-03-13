import { NameChanges } from "../lib/types";
import { removePathFromFilePath } from "../lib/utilities";
import TableCell from "../lib/TableCell";

type NameChangesTableProps = {
    nameChanges: NameChanges
}

const NameChangeTable = ({ nameChanges }: NameChangesTableProps) => {
    const changes = nameChanges?.changes;
    if (!changes || changes.length == 0) {
        return <></>;
    }

    return (
        <div className="text-white flex justify-center text-center">
            <table>
                <tr>
                    <TableCell isHeader={true}>
                        Before
                    </TableCell>
                    <TableCell isHeader={true}>
                        After
                    </TableCell>
                </tr>
                {
                    changes.map((choice) => {
                        return (
                            <tr key={choice.output}>
                                <TableCell>
                                    {removePathFromFilePath(choice.input)}
                                </TableCell>
                                <TableCell>
                                    {removePathFromFilePath(choice.output)}
                                </TableCell>
                            </tr>
                        )
                    })
                }
            </table>
        </div>
    )
};

export default NameChangeTable;