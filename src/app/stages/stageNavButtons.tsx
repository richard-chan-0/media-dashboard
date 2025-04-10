import StageButton from "../lib/components/StageButton";

type StageNavButtonsProps = {
    leftLabel?: string;
    rightLabel?: string;
    isLeftEnabled?: boolean;
    isRightEnabled?: boolean;
    stage: number;
    setStage: React.Dispatch<React.SetStateAction<number>>;
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
}

const StageNavButtons = ({
    leftLabel = "",
    rightLabel = "",
    isLeftEnabled = false,
    isRightEnabled = false,
    stage,
    setStage
}: StageNavButtonsProps) => {
    const stageButtonStyle = "w-1/6 border border-gray-600 hover:bg-gray-600";
    return (
        <div className={`flex items-center mb-3 ${getJustify(isLeftEnabled, isRightEnabled)}`}>
            {isLeftEnabled && (
                <StageButton
                    onClick={() => setStage(stage - 1)}
                    label={leftLabel}
                    type="button"
                    direction="left"
                    buttonStyle={stageButtonStyle}
                />
            )}
            {isRightEnabled && (
                <StageButton
                    onClick={() => setStage(stage + 1)}
                    label={rightLabel}
                    type="button"
                    direction="right"
                    buttonStyle={stageButtonStyle}
                />
            )}
        </div>
    )
}

export default StageNavButtons;