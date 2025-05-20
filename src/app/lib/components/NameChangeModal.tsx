import React from 'react';
import { XmarkSquareSolid } from "iconoir-react";

type NameChangeModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

const NameChangeModal = ({ isOpen, onClose }: NameChangeModalProps) => {
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
                <input type='text' className='border border-amber-600' />
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-black"
                    onClick={onClose}
                >
                    <XmarkSquareSolid />
                </button>
            </div>
        </div>
    );
};

export default NameChangeModal;
