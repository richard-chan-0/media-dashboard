import theme from "../theme";
import { getWidthSize } from "../utilities";

type SubmitButtonProps = {
    label: string,
    size?: number
    type?: HTMLButtonElement["type"],
    onClick?: () => void
};

const SubmitButton = ({ label, size, type, onClick }: SubmitButtonProps) => {
    const width = getWidthSize(size);
    return (
        <button
            type={type || "button"}
            onClick={onClick}
            className={`${theme.buttonColor} text-white p-2 ${width} rounded-lg`} >
            {label}
        </button>
    )
}

export default SubmitButton;