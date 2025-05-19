import React from 'react';

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
};

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-black"
                    onClick={onClose}
                >
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
