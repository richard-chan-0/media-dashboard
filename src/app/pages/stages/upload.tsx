import RenameVideosForm from "./forms/RenameVideosForm";
import RenameComicsForm from "./forms/RenameComicsForm";

type RenameUploadStageProps = {
    mediaType: string;
    stageDispatcher: React.ActionDispatch<[action: string]>;
};

const RenameUploadStage = ({
    mediaType,
    stageDispatcher,
}: RenameUploadStageProps) => {
    const getRenameForm = () => {
        switch (mediaType) {
            case "videos":
                return <RenameVideosForm stageDispatcher={stageDispatcher} />;
            case "comics":
                return <RenameComicsForm stageDispatcher={stageDispatcher} />;

            default:
                return <></>;
        }
    };
    return (
        <div className="flex flex-col items-center gap-4">
            {getRenameForm()}
        </div>
    );
};

export default RenameUploadStage;
