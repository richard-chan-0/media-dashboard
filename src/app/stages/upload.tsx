import RenameVideosForm from "../forms/RenameVideosForm";
import RenameComicsForm from "../forms/RenameComicsForm";
import { NameChanges } from "../lib/types";

type RenameUploadStageProps = {
    previewFiles: string[];
    mediaType: string;
    setNameChanges: React.Dispatch<React.SetStateAction<NameChanges>>;
    setError: React.Dispatch<React.SetStateAction<string>>;
    stageDispatcher: React.ActionDispatch<[action: string]>;
}

const RenameUploadStage = ({
    previewFiles,
    mediaType,
    setNameChanges,
    setError,
    stageDispatcher
}: RenameUploadStageProps) => {

    const getRenameForm = () => {
        const isBorderEnabled = true;
        switch (mediaType) {
            case "videos":
                return (
                    <RenameVideosForm
                        setNameChanges={setNameChanges}
                        setError={setError}
                        previewFiles={previewFiles}
                        isBorderEnabled={isBorderEnabled}
                        stageDispatcher={stageDispatcher}
                    />
                )
            case "comics":
                return (
                    <RenameComicsForm
                        setNameChanges={setNameChanges}
                        setError={setError}
                    />
                )

            default:
                return <></>;
        }
    }
    return (
        <div className="flex flex-col items-center gap-4">
            {
                getRenameForm()
            }
        </div>
    )
}

export default RenameUploadStage;