import Modal from "../../../service/rename/shared/Modal/Modal";
import SubmitButton from "../SubmitButton";

type ConfirmationModalProps = {
    isOpen: boolean;
    onClose: () => void;
    action: () => void;
};

const ConfirmationModal = ({ isOpen, onClose, action }: ConfirmationModalProps) => {

    if (!isOpen) return null;
    const modalButtonStyle = "w-1/6";
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="flex flex-col text-black gap-2">
                Are you sure?
                <footer className="flex justify-between">
                    <SubmitButton
                        label="Yes"
                        onClick={action}
                        buttonStyle={modalButtonStyle}
                    />
                    <SubmitButton
                        label="Cancel"
                        onClick={onClose}
                        buttonStyle={modalButtonStyle}
                    />
                </footer>
            </div>
        </Modal>
    );
};

export default ConfirmationModal;
