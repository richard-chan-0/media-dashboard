import React from "react";
import theme from "../../theme";

export interface IconToggle {
    before: React.FC<React.SVGProps<SVGSVGElement>>;
    after: React.FC<React.SVGProps<SVGSVGElement>>;
}

interface SlidingToggleButtonProps {
    isToggle: boolean;
    onToggle: (isToggle: boolean) => void;
    icons?: IconToggle;
}

const SlidingToggleButton: React.FC<SlidingToggleButtonProps> = ({ isToggle = false, onToggle, icons }) => {
    const getToggleElement = () => {
        if (!icons) {
            return <span
                className={`absolute justify-center h-6 w-6 bg-white rounded-full bottom-1 left-1 transition-transform duration-300 ${isToggle ? "translate-x-8" : ""} ${theme.textAppColor}`}
            />;
        }
        return (
            <span
                className={`absolute h-full w-1/2 flex justify-center items-center transition-transform duration-300 ${isToggle ? "" : "translate-x-full"} text-white`}
            >
                {isToggle ? <icons.before /> : <icons.after />}
            </span>
        );
    }
    return (
        <label className="relative inline-block w-16 h-8">
            <input
                type="checkbox"
                checked={isToggle}
                onChange={() => onToggle && onToggle(!isToggle)}
                className="opacity-0 w-0 h-0"
            />
            <span
                className={`absolute cursor-pointer hover:border hover:border-white/80 top-0 left-0 right-0 bottom-0 ${isToggle ? "bg-blue-500/80 hover:bg-blue-400/80" : "bg-purple-500/80 hover:bg-purple-400/80"} rounded-full transition duration-200 `}
            >
                {getToggleElement()}
            </span>
        </label>
    );
};

export default SlidingToggleButton;