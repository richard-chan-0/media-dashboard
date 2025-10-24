import theme from "../theme";

type SubmitButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    label: string;
    type?: HTMLButtonElement["type"];
    onClick?: () => void;
    buttonStyle?: string;
};

const SubmitButton = ({
    label,
    type,
    onClick,
    buttonStyle,
    ...rest
}: SubmitButtonProps) => {
    return (
        <button
            type={type || "button"}
            onClick={onClick}
            {...rest}
            className={`${theme.buttonColor} ${theme.buttonFormat} ${buttonStyle}`}
        >
            {label}
        </button>
    );
};

export default SubmitButton;
