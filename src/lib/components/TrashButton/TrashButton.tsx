import { TrashSolid } from "iconoir-react";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import React from "react";

interface TrashButtonProps {
    onClick: () => void
}

const TrashButton = ({ onClick }: TrashButtonProps) => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const handleOnClick = () => {
        setIsModalOpen(true);
    };

    return (
        <>
            <button
                aria-label="delete button"
                title="Delete"
                onClick={handleOnClick}
            >
                <TrashSolid className={"hover:text-red-500 disabled:text-gray-200"} />
            </button>
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                action={onClick}
            />
        </>

    )
};

export default TrashButton;