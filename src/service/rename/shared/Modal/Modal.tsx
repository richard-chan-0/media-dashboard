import theme from "../../../../lib/theme";

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
};

const Modal = ({ isOpen, onClose, children }: ModalProps) => {

    if (!isOpen) return <></>;

    return (
        <section
            className={`fixed inset-0 ${theme.appColorLightOpacity}  flex items-center justify-center z-50`}
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative flex flex-col gap-4"
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </section>
    );
};

export default Modal;
