import React, { useEffect } from "react";
import SlidingToggleButton from "../../../../lib/components/SlidingToggleButton/SlidingToggleButton";
import { COMICS, VIDEOS, TASK_METADATA, TASK_RENAME, TASK_EDIT, TASK_MERGE } from "../../../../lib/constants";
import { BookStack, DesignPencil, Keyframes, VideoCamera, Combine, EditPencil } from "iconoir-react";
import { RenameUploadStage } from "../../stages";


interface RenamePanelProps extends React.HTMLAttributes<HTMLDivElement> {
    task: typeof TASK_RENAME | typeof TASK_METADATA;
    renameMedia: string;
    setTask: (v: typeof TASK_RENAME | typeof TASK_METADATA) => void;
    setRenameMedia: React.Dispatch<React.SetStateAction<string>>;
    editType: typeof TASK_EDIT | typeof TASK_MERGE;
    setEditType: (v: typeof TASK_EDIT | typeof TASK_MERGE) => void;
}

const RenamePanel = ({ setRenameMedia, renameMedia, task, setTask, editType, setEditType, ...props }: RenamePanelProps) => {
    const [isVideo, setIsVideo] = React.useState(renameMedia === VIDEOS);

    useEffect(() => {
        setRenameMedia(isVideo ? VIDEOS : COMICS);
    }, [isVideo, setRenameMedia]);

    const videoTask = () => {
        const handleToggle = (isToggled: boolean) => {
            const task = isToggled ? TASK_RENAME : TASK_METADATA;
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

    const editTypeToggle = () => {
        const handleToggle = (isToggled: boolean) => {
            const type = isToggled ? TASK_EDIT : TASK_MERGE;
            return setEditType(type);
        }
        return (
            <div className="flex gap-2 w-full justify-between">
                <div className="text-lg font-medium mb-2 w-1/2">Edit Type</div>
                <SlidingToggleButton
                    isToggle={editType === TASK_EDIT}
                    onToggle={handleToggle}
                    icons={{ before: EditPencil, after: Combine }}
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
            {isVideo && task === TASK_RENAME && editTypeToggle()}
            <RenameUploadStage
                mediaType={renameMedia}
            />
        </section >
    );
}

export default RenamePanel;