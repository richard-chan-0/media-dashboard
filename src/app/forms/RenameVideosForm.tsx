import { useState } from "react";
import { postForm } from "../lib/api";
import { useDropzone } from "react-dropzone";
<<<<<<< HEAD
import { formDropdownMessage, inputSeasonMessage, inputStartEpisodeMessage, mediaLink } from "../lib/constants";
=======
import {
    formDropdownMessage,
    inputSeasonMessage,
    inputStartEpisodeMessage,
    mediaLink
} from "../lib/constants";
>>>>>>> aca5210 (update api constants)
import theme from "../lib/theme";
import { processApiResponseToNameChange } from "../lib/api";
import FileListUploadPreview from "../lib/components/NameChangeList";
import FormContainer from "./FormContainer";
import FormInput from "../lib/components/FormInput";
import ProgressBar from "../lib/components/ProgressBar";
import { NameChanges } from "../lib/types";

type RenameVideosFormProps = {
    setNameChanges: React.Dispatch<React.SetStateAction<NameChanges>>
    setRenameMessage: React.Dispatch<React.SetStateAction<string>>
    setError: React.Dispatch<React.SetStateAction<string>>
    previewFiles: string[]
    isBorderEnabled?: boolean
    setStage: React.Dispatch<React.SetStateAction<number>>
}

const RenameVideosForm = ({
    setNameChanges,
    setRenameMessage,
    setError,
    previewFiles,
    isBorderEnabled,
    setStage
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
            setRenameMessage("");
        },
    });

    const handleSubmit = async () => {
        if (!mediaLink) {
<<<<<<< HEAD
            setError("can't find api link");
            return
        }

=======
            setError("no media link");
        }
>>>>>>> aca5210 (update api constants)
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
            setStage(1);
        }
        setIsUploading(false);
        setUploadPercent(0)
        setSeasonNumber("");
        setEpisodeFiles([]);
<<<<<<< HEAD
=======

>>>>>>> aca5210 (update api constants)
    };

    return (
        <FormContainer size={3} containerStyle="flex flex-col gap-2" isBorderEnabled={isBorderEnabled}>
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
            <div {...getRootProps()} className={`border-dashed border-2 border-blue-200 ${theme.appSecondaryColor}  hover:bg-blue-200 active:bg-blue-300 p-2 text-center cursor-pointer`}>
                <input {...getInputProps()} />
                <p>{formDropdownMessage}</p>
            </div>
            {episodeFiles.length > 0 &&
                <FileListUploadPreview files={episodeFiles} />
            }
            <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-600 active:bg-blue-800 disabled:bg-gray-200 text-white p-2 w-full rounded-b-lg" disabled={isUploading || (!previewFiles || episodeFiles.length == 0)}>
                Submit Files!
            </button>
            {uploadPercent != 100 && isUploading && (
                <ProgressBar progressPercent={uploadPercent} progressLabel="Uploading..." />
            )}
            {uploadPercent == 100 && isUploading && (
                <p> API processing ... </p>
            )}
        </FormContainer>
    );
};

export default RenameVideosForm;


