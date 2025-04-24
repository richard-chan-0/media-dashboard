import theme from "../theme";

type SubmitButtonProps = {
    label: string,
    type?: HTMLButtonElement["type"],
    onClick?: () => void
    buttonStyle?: string
};

const SubmitButton = ({ label, type, onClick, buttonStyle }: SubmitButtonProps) => {
    return (
        <button
            type={type || "button"}
            onClick={onClick}
            className={`${theme.buttonColor} ${theme.buttonFormat} ${buttonStyle}`} >
            {label}
        </button>
    );
};

export default SubmitButton;