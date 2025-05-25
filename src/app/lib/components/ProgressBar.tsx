import { XmarkCircleSolid } from "iconoir-react";

type ProgressBarProps = {
    isInProgress: boolean;
    progressLabel: string;
    progressPercent: number;
    abortController?: AbortController | null;
};

const ProgressBar = ({
    progressPercent,
    progressLabel,
    isInProgress,
    abortController,
}: ProgressBarProps) => {
    if (!isInProgress) {
        return <></>;
    }

    return progressPercent === 100 ? (
        <p>continuing processing...</p>
    ) : (
        <div
            className={`flex font-thin w-full justify-between gap-2 items-center border border-blue-200 pl-3 pt-2 pr-3 pb-2 rounded-full`}
        >
            <span>{`${progressLabel} ${progressPercent}%`}</span>
            <div className="w-1/2 h-4 border-blue-500 border-t-2 border-b-2 border-r-2 rounded-full">
                <div
                    className="bg-blue-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                />
            </div>
            {abortController && (
                <button
                    className="text-red-600 hover:text-red-500"
                    onClick={() => {
                        console.log("aborting upload");
                        abortController.abort();
                    }}
                >
                    <XmarkCircleSolid />
                </button>
            )}
        </div>
    );
};

export default ProgressBar;
