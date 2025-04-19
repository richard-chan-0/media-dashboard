import RenameVideosForm from "../forms/RenameVideosForm";
import RenameComicsForm from "../forms/RenameComicsForm";
import FormContainer from "../forms/FormContainer";
import { NameChanges } from "../lib/types";

type RenameUploadStageProps = {
    previewFiles: string[];
    mediaType: string;
    setNameChanges: React.Dispatch<React.SetStateAction<NameChanges>>;
    setError: React.Dispatch<React.SetStateAction<string>>;
    stageDispatcher: React.ActionDispatch<[action: string]>;
}

const getRenameForm = (
    mediaType: string,
    setNameChanges: React.Dispatch<React.SetStateAction<NameChanges>>,
    setError: React.Dispatch<React.SetStateAction<string>>,
    previewFiles: string[],
    isBorderEnabled: boolean,
    stageDispatcher: React.ActionDispatch<[action: string]>
) => {
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


const RenameUploadStage = ({
    previewFiles,
    mediaType,
    setNameChanges,
    setError,
    stageDispatcher
}: RenameUploadStageProps) => {

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="flex gap-4 flex-col md:flex-row">
                {
                    previewFiles.length > 0 && (
                        <FormContainer
                            size={3}
                            formTitle="Uploaded Files"
                            containerStyle="flex flex-col gap-2"
                        >
                            <p className="text-sm"><i>files currently uploaded</i></p>

                            <ul className="border border-white shadow-white shadow-md bg-black p-2 text-md font-light">
                                {previewFiles.map((fileName: string) => (
                                    <li key={fileName}>{fileName}</li>
                                ))}
                            </ul>

                        </FormContainer>
                    )
                }
                {
                    getRenameForm(
                        mediaType,
                        setNameChanges,
                        setError,
                        previewFiles,
                        true,
                        stageDispatcher
                    )
                }
            </div>
        </div>
    )
}

export default RenameUploadStage;