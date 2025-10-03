import { ArrowLeft } from "iconoir-react";
import { ArrowRight } from "iconoir-react";
import theme from "../theme";

type StageButtonProps = {
    label: string;
    type?: HTMLButtonElement["type"];
    onClick?: () => void;
    direction?: "left" | "right";
    buttonStyle?: string;
};

const StageButton = ({
    label,
    type,
    onClick,
    direction,
    buttonStyle,
}: StageButtonProps) => {
    return (
        <button
            type={type || "button"}
            onClick={onClick}
            className={`flex items-center text-sm ${theme.buttonFormat} ${buttonStyle}`}
        >
            {direction == "left" && (
                <>
                    <ArrowLeft className="inline-block mr-1" />
                    {label}
                </>
            )}
            {direction == "right" && (
                <>
                    {label}
                    <ArrowRight className="inline-block ml-1" />
                </>
            )}
        </button>
    );
};

export default StageButton;
