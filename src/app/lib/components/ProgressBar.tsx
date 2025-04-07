type ProgressBarProps = {
    progressLabel: string,
    progressPercent: number,
}

const ProgressBar = ({ progressPercent, progressLabel }: ProgressBarProps) => {
    return (
        <div className="mt-4">
            {progressLabel}
            <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                    className="bg-blue-500 h-4 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                />
            </div>
            <p className="mt-2 text-sm text-gray-700">{progressPercent}%</p>
        </div>
    )
}

export default ProgressBar;