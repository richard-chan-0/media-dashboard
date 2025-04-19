import { useState } from "react";
import { postForm } from "../lib/api";
import { useDropzone } from "react-dropzone";
import { formDropdownMessage, inputSeasonMessage, inputStartEpisodeMessage, mediaLink } from "../lib/constants";
import theme from "../lib/theme";
import { processApiResponseToNameChange } from "../lib/api";
import FileListUploadPreview from "../lib/components/NameChangeList";
import FormContainer from "./FormContainer";
import FormInput from "../lib/components/FormInput";
import ProgressBar from "../lib/components/ProgressBar";
import { NameChanges } from "../lib/types";

type RenameVideosFormProps = {
    setNameChanges: React.Dispatch<React.SetStateAction<NameChanges>>
    setError: React.Dispatch<React.SetStateAction<string>>
    previewFiles: string[]
    isBorderEnabled?: boolean
    stageDispatcher: React.ActionDispatch<[action: string]>
}

const RenameVideosForm = ({
    setNameChanges,
    setError,
    previewFiles,
    isBorderEnabled,
    stageDispatcher
}: RenameVideosFormProps
) => {
    const [seasonNumber, setSeasonNumber] = useState("");
    const [startNumber, setStartNumber] = useState("");
    const [episodeFiles, setEpisodeFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadPercent, setUploadPercent] = useState(0);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles) => {
            setEpisodeFiles(acceptedFiles);
            setError("");
            setNameChanges({ changes: [] })
        },
    });

    const handleSubmit = async () => {
        if (!mediaLink) {
            setError("can't find api link");
            return
        }

        const formData = new FormData();
        formData.append("season_number", seasonNumber);
        formData.append("start_number", startNumber);
        episodeFiles.forEach((file) => formData.append("files", file));
        setIsUploading(true);
        const response = await postForm(`${mediaLink}/rename/videos`, formData, setUploadPercent)
        if (response?.error) {
            setError(response.error)
        } else {
            const processedResponse = processApiResponseToNameChange(response);
            setNameChanges(processedResponse);
            stageDispatcher("next");
        }
        setIsUploading(false);
        setUploadPercent(0)
        setSeasonNumber("");
        setEpisodeFiles([]);
    };

    return (
        <FormContainer
            formTitle="Upload Files"
            size={3}
            containerStyle="flex flex-col gap-2 items-center"
            isBorderEnabled={isBorderEnabled}
        >
            <div className="flex w-full gap-4 justify-between">
                <FormInput
                    type="number"
                    inputValue={seasonNumber}
                    setInputValue={setSeasonNumber}
                    placeholder={inputSeasonMessage}
                />
                <FormInput
                    type="number"
                    inputValue={startNumber}
                    setInputValue={setStartNumber}
                    placeholder={inputStartEpisodeMessage}
                />
            </div>

            <div {...getRootProps()} className={`border-dashed border-2 border-blue-200 ${theme.appSecondaryColor}  hover:bg-blue-200 active:bg-blue-300 p-2 text-center cursor-pointer w-full`}>
                <input {...getInputProps()} />
                <p>{formDropdownMessage}</p>
            </div>
            {episodeFiles.length > 0 &&
                <FileListUploadPreview files={episodeFiles} />
            }
            <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-600 active:bg-blue-800 disabled:bg-gray-200 text-white p-2 w-full rounded-b-lg" disabled={isUploading || (previewFiles.length == 0 && episodeFiles.length == 0)}>
                Upload!
            </button>
            <ProgressBar isInProgress={isUploading} progressPercent={uploadPercent} progressLabel="Uploading..." />
        </FormContainer>
    );
};

export default RenameVideosForm;


