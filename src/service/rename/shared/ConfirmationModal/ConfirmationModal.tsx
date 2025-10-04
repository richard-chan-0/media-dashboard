import Modal from "../Modal/Modal";

type ConfirmationModalProps = {
    isOpen: boolean;
    onClose: () => void;
    action: () => void;
};

const ConfirmationModal = ({ isOpen, onClose, action }: ConfirmationModalProps) => {

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div>
                Are you sure?
                <button onClick={action}>Yes</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </Modal>
    );
};

export default ConfirmationModal;
