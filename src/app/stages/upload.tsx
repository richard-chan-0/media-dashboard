import RenameVideosForm from "../forms/RenameVideosForm";
import RenameComicsForm from "../forms/RenameComicsForm";
import FormContainer from "../forms/FormContainer";
import { NameChanges } from "../lib/types";

type RenameUploadStageProps = {
    previewFiles: string[];
    mediaType: string;
    setNameChanges: React.Dispatch<React.SetStateAction<NameChanges>>;
    setRenameMessage: React.Dispatch<React.SetStateAction<string>>;
    setError: React.Dispatch<React.SetStateAction<string>>;
    setStage: React.Dispatch<React.SetStateAction<number>>;
}

const getRenameForm = (
    mediaType: string,
    setNameChanges: React.Dispatch<React.SetStateAction<NameChanges>>,
    setRenameMessage: React.Dispatch<React.SetStateAction<string>>,
    setError: React.Dispatch<React.SetStateAction<string>>,
    previewFiles: string[],
    isBorderEnabled: boolean,
    setStage: React.Dispatch<React.SetStateAction<number>>
) => {
    switch (mediaType) {
        case "videos":
            return (
                <RenameVideosForm
                    setNameChanges={setNameChanges}
                    setRenameMessage={setRenameMessage}
                    setError={setError}
                    previewFiles={previewFiles}
                    isBorderEnabled={isBorderEnabled}
                    setStage={setStage}
                />
            )
        case "comics":
            return (
                <RenameComicsForm
                    setNameChanges={setNameChanges}
                    setRenameMessage={setRenameMessage}
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
    setRenameMessage,
    setError,
    setStage
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
                        setRenameMessage,
                        setError,
                        previewFiles,
                        true,
                        setStage
                    )
                }
            </div>
        </div>
    )
}

export default RenameUploadStage;