type ProgressBarProps = {
    progressLabel: string,
    progressPercent: number,
}

const ProgressBar = ({ progressPercent, progressLabel }: ProgressBarProps) => {
    return (
        <div className={`flex font-thin w-full justify-between gap-2 items-center border border-blue-200 pl-3 pt-2 pr-3 pb-2 rounded-full`}>
            <span>{`${progressLabel} ${progressPercent}%`}</span>
            <div className="w-1/2 h-4 border-blue-500 border-t-2 border-b-2 border-r-2 rounded-full">
                <div
                    className="bg-blue-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                />
            </div>

        </div>
    )
}

export default ProgressBar;