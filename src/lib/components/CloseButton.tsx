import { XmarkSquareSolid } from "iconoir-react";


type CloseButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    onClose: () => void;
}

const CloseButton = ({ onClose, ...rest }: CloseButtonProps) => {
    return (
        <button
            className="text-gray-500 hover:text-black"
            onClick={onClose}
            {...rest}
        >
            <XmarkSquareSolid />
        </button>
    )
}

export default CloseButton;