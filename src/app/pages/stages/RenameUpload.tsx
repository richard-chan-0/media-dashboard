import RenameVideosForm from "./forms/RenameVideosForm";
import RenameComicsForm from "./forms/RenameComicsForm/RenameComicsForm";
import { COMICS, VIDEOS } from "../../lib/constants";

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
            case VIDEOS:
                return <RenameVideosForm stageDispatcher={stageDispatcher} />;
            case COMICS:
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
