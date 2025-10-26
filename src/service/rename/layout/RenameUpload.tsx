import RenameVideosForm from "../videos/RenameVideosForm";
import RenameComicsForm from "../comics/RenameComicsForm/RenameComicsForm";
import { COMICS, VIDEOS } from "../../../lib/constants";

type RenameUploadStageProps = {
    mediaType: string;
};

const RenameUploadStage = ({
    mediaType,
}: RenameUploadStageProps) => {
    const getRenameForm = () => {
        switch (mediaType) {
            case VIDEOS:
                return <RenameVideosForm />;
            case COMICS:
                return <RenameComicsForm />;

            default:
                return <></>;
        }
    };
    return (
        <div className="flex flex-col items-center gap-4 w-full">
            {getRenameForm()}
        </div>
    );
};

export default RenameUploadStage;
