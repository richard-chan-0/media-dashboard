import { useReducer, useRef, useState } from "react";
import { postForm } from "../../../lib/api";
import {
    inputSeasonMessage,
    inputStartEpisodeMessage,
    mediaLink,
    no_api_error,
} from "../../../lib/constants";
import { processApiResponseToNameChange } from "../../../lib/api";
import UploadPreview from "../../../lib/components/UploadPreview";
import FormContainer from "./FormContainer";
import FormInput from "../../../lib/components/FormInput";
import ProgressBar from "../../../lib/components/ProgressBar";
import { useRename } from "../../hooks/useRename";
import { uploadReducer } from "../../state/uploadReducer";
import FileUploader from "../../../lib/components/FileUploader";

type RenameVideosFormProps = {
    stageDispatcher: React.ActionDispatch<[action: string]>;
};

const RenameVideosForm = ({ stageDispatcher }: RenameVideosFormProps) => {
    const [seasonNumber, setSeasonNumber] = useState("");
    const [startNumber, setStartNumber] = useState("");
    const [episodeFiles, setEpisodeFiles] = useState<File[]>([]);
    const [upload, uploadDispatcher] = useReducer(uploadReducer, { isUploading: false, uploadPercent: 0 });
    const abortControllerRef = useRef<AbortController | null>(null);
    const { state, dispatch } = useRename();

    const handleDelete = (file_name: string) => {
        const newFiles = episodeFiles.filter((file: File) => file.name !== file_name);
        setEpisodeFiles(newFiles);
    }
    const handleDrop = (acceptedFiles: File[]) => {
        setEpisodeFiles(acceptedFiles);
        dispatch({ type: "CLEAR_ERROR" });
        dispatch({ type: "CLEAR_NAME_CHANGES" });
    };

    const isRetry = state.previewFiles.length > 0 && episodeFiles.length === 0;
    const handleSubmit = async () => {
        if (!mediaLink) {
            dispatch({ type: "SET_ERROR", payload: no_api_error });
            return;
        }

        const formData = new FormData();
        formData.append("season_number", seasonNumber);
        formData.append("start_number", startNumber);
        episodeFiles.forEach((file) => formData.append("files", file));
        uploadDispatcher({ type: "START_UPLOAD" });
        abortControllerRef.current = new AbortController();
        const response = await postForm(
            `${mediaLink}/rename/videos`,
            formData,
            uploadDispatcher,
            abortControllerRef.current.signal
        );
        if (response?.error) {
            dispatch({ type: "SET_ERROR", payload: response.error });
        } else {
            const processedResponse = processApiResponseToNameChange(response);
            dispatch({ type: "SET_NAME_CHANGES", payload: processedResponse });
            stageDispatcher("next");
            setSeasonNumber("");
            setStartNumber("");
            setEpisodeFiles([]);
        }
        uploadDispatcher({ type: "RESET_UPLOAD" });
        abortControllerRef.current = null;
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
            <FileUploader onDrop={handleDrop} />
            {episodeFiles.length > 0 && (
                <UploadPreview files={episodeFiles.map(file => file.name)} deleteFile={handleDelete} />
            )}
            <button
                onClick={handleSubmit}
                className="bg-blue-500 hover:bg-blue-600 active:bg-blue-800 disabled:bg-gray-200 text-white p-2 w-full rounded-b-lg"
                disabled={
                    upload.isUploading ||
                    (state.previewFiles.length == 0 && episodeFiles.length == 0)
                }
            >
                {isRetry ? "Retrigger" : "Upload"}
            </button>
            <ProgressBar
                isInProgress={upload.isUploading}
                progressPercent={upload.uploadPercent}
                progressLabel={"Uploading..."}
                abortController={abortControllerRef.current}
            />
        </FormContainer>
    );
};

export default RenameVideosForm;
