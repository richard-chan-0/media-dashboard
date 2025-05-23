import { useState } from "react";
import { postForm } from "../../../lib/api";
import { useDropzone } from "react-dropzone";
import {
    formDropdownMessage,
    inputSeasonMessage,
    inputStartEpisodeMessage,
    mediaLink,
    no_api_error,
} from "../../../lib/constants";
import theme from "../../../lib/theme";
import { processApiResponseToNameChange } from "../../../lib/api";
import UploadPreview from "../../../lib/components/UploadPreview";
import FormContainer from "./FormContainer";
import FormInput from "../../../lib/components/FormInput";
import ProgressBar from "../../../lib/components/ProgressBar";
import { useRename } from "../../hooks/useRename";

type RenameVideosFormProps = {
    stageDispatcher: React.ActionDispatch<[action: string]>;
};

const RenameVideosForm = ({ stageDispatcher }: RenameVideosFormProps) => {
    const [seasonNumber, setSeasonNumber] = useState("");
    const [startNumber, setStartNumber] = useState("");
    const [episodeFiles, setEpisodeFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadPercent, setUploadPercent] = useState(0);

    const handleDelete = (file_name: string) => {
        const newFiles = episodeFiles.filter((file: File) => file.name !== file_name);
        setEpisodeFiles(newFiles);
    }

    const { state, dispatch } = useRename();

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles) => {
            setEpisodeFiles(acceptedFiles);
            dispatch({ type: "CLEAR_ERROR" });
            dispatch({ type: "CLEAR_NAME_CHANGES" });
        },
    });

    const isSkip = state.previewFiles.length > 0 && episodeFiles.length === 0;
    const handleSkip = () => {
        if (state.previewFiles.length > 0 && episodeFiles.length === 0) {
            // TODO: call like the get version of rename/videos to get changes for already uploaded files
            stageDispatcher("next");
            return;
        }
    }
    const handleSubmit = async () => {
        if (!mediaLink) {
            dispatch({ type: "SET_ERROR", payload: no_api_error });
            return;
        }

        const formData = new FormData();
        formData.append("season_number", seasonNumber);
        formData.append("start_number", startNumber);
        episodeFiles.forEach((file) => formData.append("files", file));
        setIsUploading(true);
        const response = await postForm(
            `${mediaLink}/rename/videos`,
            formData,
            setUploadPercent,
        );
        if (response?.error) {
            dispatch({ type: "SET_ERROR", payload: response.error });
        } else {
            const processedResponse = processApiResponseToNameChange(response);
            dispatch({ type: "SET_NAME_CHANGES", payload: processedResponse });
            stageDispatcher("next");
        }
        setIsUploading(false);
        setUploadPercent(0);
        setSeasonNumber("");
        setEpisodeFiles([]);
    };

    return (
        <FormContainer
            formTitle="Upload Videos"
            size={3}
            containerStyle="flex flex-col gap-2 items-center"
            isBorderEnabled={true}
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

            <div
                {...getRootProps()}
                className={`border-dashed border-2 border-blue-200 ${theme.appSecondaryColor}  hover:bg-blue-200 active:bg-blue-300 p-2 text-center cursor-pointer w-full`}
            >
                <input {...getInputProps()} />
                <p>{formDropdownMessage}</p>
            </div>
            {episodeFiles.length > 0 && (
                <UploadPreview files={episodeFiles.map(file => file.name)} deleteFile={handleDelete} />
            )}
            <button
                onClick={isSkip ? handleSkip : handleSubmit}
                className="bg-blue-500 hover:bg-blue-600 active:bg-blue-800 disabled:bg-gray-200 text-white p-2 w-full rounded-b-lg"
                disabled={
                    isUploading ||
                    (state.previewFiles.length == 0 && episodeFiles.length == 0)
                }
            >
                {isSkip ? "Skip" : "Upload"}
            </button>
            <ProgressBar
                isInProgress={isUploading}
                progressPercent={uploadPercent}
                progressLabel={"Uploading..."}
            />
        </FormContainer>
    );
};

export default RenameVideosForm;
