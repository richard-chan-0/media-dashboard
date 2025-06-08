import { XmarkSquareSolid } from "iconoir-react";
import theme from "../../theme";
import { useEffect, useState } from "react";
import { useRename } from "../../../pages/hooks/useRename";
import { removePathFromFilePath, splitPathFromFilePath } from "../../utilities";
import Modal from "../Modal/Modal";
import CloseButton from "../CloseButton";

type NameChangeModalProps = {
    isOpen: boolean;
    onClose: () => void;
    initialName: string;
};

const NameChangeModal = ({ isOpen, onClose, initialName }: NameChangeModalProps) => {
    const [name, setName] = useState(initialName)
    const { state, dispatch } = useRename();
    useEffect(() => {
        if (isOpen) {
            setName(initialName);
        }
    }, [initialName, isOpen]);

    const handleSubmit = () => {
        const updatedChanges = state.nameChanges.changes.map((change) => {
            if (change.output === initialName) {
                const { path } = splitPathFromFilePath(change.output);
                return {
                    ...change,
                    output: `${path}/${name}`,
                }
            }
            else {
                return change;
            }
        });
        const updatedNameChanges = {
            changes: updatedChanges,
        }
        dispatch({ type: "SET_NAME_CHANGES", payload: updatedNameChanges });
        onClose();
    }
    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <label className="block text-gray-700 font-medium ml-1" htmlFor="name">
                Name: {removePathFromFilePath(initialName)}
            </label>
            <input
                id="name"
                type="text"
                value={removePathFromFilePath(name)}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
            <button
                onClick={handleSubmit}
                className={`${theme.buttonColor} ${theme.buttonFormat} w-1/5 self-center`}
            >
                Update
            </button>
            <CloseButton onClick={onClose} />
        </Modal>
    );
};

export default NameChangeModal;
