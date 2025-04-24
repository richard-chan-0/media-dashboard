import StageButton from "../../lib/components/StageButton";

type StageNavButtonsProps = {
    leftLabel?: string;
    rightLabel?: string;
    isLeftEnabled?: boolean;
    isRightEnabled?: boolean;
    stageDispatcher: React.ActionDispatch<[action: string]>;
}

const getJustify = (isLeftEnabled: boolean, isRightEnabled: boolean) => {
    if (isLeftEnabled && isRightEnabled) {
        return "justify-between";
    }
    if (isLeftEnabled) {
        return "justify-start";
    }
    if (isRightEnabled) {
        return "justify-end";
    }
    return "";
};

const StageNavButtons = ({
    leftLabel = "",
    rightLabel = "",
    isLeftEnabled = false,
    isRightEnabled = false,
    stageDispatcher
}: StageNavButtonsProps) => {
    const stageButtonStyle = "w-1/6 border border-gray-600 hover:bg-gray-600";
    return (
        <div className={`flex items-center mb-3 ${getJustify(isLeftEnabled, isRightEnabled)}`}>
            {isLeftEnabled && (
                <StageButton
                    onClick={() => stageDispatcher("prev")}
                    label={leftLabel}
                    type="button"
                    direction="left"
                    buttonStyle={stageButtonStyle}
                />
            )}
            {isRightEnabled && (
                <StageButton
                    onClick={() => stageDispatcher("next")}
                    label={rightLabel}
                    type="button"
                    direction="right"
                    buttonStyle={stageButtonStyle}
                />
            )}
        </div>
    );
};

export default StageNavButtons;