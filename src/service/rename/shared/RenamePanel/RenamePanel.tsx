import React, { useEffect } from "react";
import SlidingToggleButton from "../../../../lib/components/SlidingToggleButton/SlidingToggleButton";
import { COMICS, VIDEOS, TASK_MERGE, TASK_RENAME } from "../../../../lib/constants";
import { BookStack, DesignPencil, Keyframes, VideoCamera } from "iconoir-react";
import { RenameUploadStage } from "../../stages";


interface RenamePanelProps extends React.HTMLAttributes<HTMLDivElement> {
    task: typeof TASK_RENAME | typeof TASK_MERGE;
    renameMedia: string;
    setTask: (v: typeof TASK_RENAME | typeof TASK_MERGE) => void;
    setRenameMedia: React.Dispatch<React.SetStateAction<string>>;
}

const RenamePanel = ({ setRenameMedia, renameMedia, task, setTask, ...props }: RenamePanelProps) => {
    const [isVideo, setIsVideo] = React.useState(renameMedia === VIDEOS);

    useEffect(() => {
        setRenameMedia(isVideo ? VIDEOS : COMICS);
    }, [isVideo, setRenameMedia]);

    const videoTask = () => {
        const handleToggle = (isToggled: boolean) => {
            const task = isToggled ? TASK_RENAME : TASK_MERGE;
            return setTask(task);
        }
        return (
            <div className="flex gap-2 w-full justify-between">
                <div className="text-lg font-medium mb-2 w-1/2">Task</div>
                <SlidingToggleButton
                    isToggle={task === TASK_RENAME}
                    onToggle={handleToggle}
                    icons={{ before: DesignPencil, after: Keyframes }}
                />
            </div>
        )
    };

    return (
        <section
            {...props}
            className={`flex flex-col gap-2 p-4 items-start w-1/4`}>
            <div className="flex w-full justify-between">
                <div className="text-lg font-medium mb-2 w-1/2">Media Type</div>
                <SlidingToggleButton
                    isToggle={isVideo}
                    onToggle={setIsVideo}
                    icons={{ before: VideoCamera, after: BookStack }}
                />
            </div >
            {isVideo && videoTask()}
            <RenameUploadStage
                mediaType={renameMedia}
            />
        </section >
    );
}

export default RenamePanel;