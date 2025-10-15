import { useReducer, useRef, useState } from "react";
import { postForm } from "../../../../lib/api/api";
import {
    inputStartVolumeMessage,
    inputStoryNameMessage,
    mediaLink,
    no_api_error,
} from "../../../../lib/constants";
import { createNameChanges } from "../../../../lib/api/factory";
import { ProgressBar, FormInput, UploadPreview } from "../../../../lib/components";
import { useRename } from "../../../../lib/hooks/usePageContext";
import { uploadReducer } from "../../../../lib/reducers/uploadReducer";
import FileUploader from "../../../../lib/components/FileUploader";

const RenameComicsForm = () => {
    const [storyName, setStoryName] = useState("");
    const [startVolume, setStartVolume] = useState("");
    const [volumeFiles, setVolumeFiles] = useState<File[]>([]);
    const [upload, uploadDispatcher] = useReducer(uploadReducer, { isUploading: false, uploadPercent: 0 });
    const { dispatch, pageState, pageDispatch } = useRename();
    const abortControllerRef = useRef<AbortController | null>(null);

    const handleDrop = (acceptedFiles: File[]) => {
        setVolumeFiles(acceptedFiles);
        pageDispatch({ type: "CLEAR_ERROR" });
        dispatch({ type: "CLEAR_NAME_CHANGES" });
    };

    const handleDelete = (file_name: string) => {
        const newFiles = volumeFiles.filter((file: File) => file.name !== file_name);
        setVolumeFiles(newFiles);
    }

    const handleSubmit = async () => {
        if (!mediaLink) {
            pageDispatch({ type: "SET_ERROR", payload: no_api_error });
            return;
        }
        if (!storyName) {
            pageDispatch({ type: "SET_ERROR", payload: "story title is required" });
            return;
        }
        const formData = new FormData();
        formData.append("comic_name", storyName);
        formData.append("start_number", startVolume);
        volumeFiles.forEach((file) => formData.append("files", file));
        uploadDispatcher({ type: "START_UPLOAD" });
        abortControllerRef.current = new AbortController();
        const response = await postForm(
            `${mediaLink}/rename/comics`,
            formData,
            uploadDispatcher,
            abortControllerRef.current.signal
        );
        if (response?.error) {
            pageDispatch({ type: "SET_ERROR", payload: response.error });
        } else {
            const processedResponse = createNameChanges(response);
            dispatch({ type: "SET_NAME_CHANGES", payload: processedResponse });
            // stageDispatcher("next");
        }
        setStoryName("");
        setVolumeFiles([]);
        uploadDispatcher({ type: "RESET_UPLOAD" });
    };

    return (
        <div className="flex flex-col gap-4 w-full">

            <FormInput
                type="text"
                inputValue={storyName}
                setInputValue={setStoryName}
                placeholder={inputStoryNameMessage}
            />
            <FormInput
                type="number"
                inputValue={startVolume}
                setInputValue={setStartVolume}
                placeholder={inputStartVolumeMessage}
            />

            <FileUploader onDrop={handleDrop} />
            {volumeFiles.length > 0 && (
                <UploadPreview files={volumeFiles.map(file => file.name)} deleteFile={handleDelete} />
            )}
            <button
                onClick={handleSubmit}
                className="bg-blue-500 hover:bg-blue-600 active:bg-blue-800 disabled:bg-gray-200 text-white p-2 w-full rounded-lg"
                disabled={upload.isUploading ||
                    (pageState.previewFiles.length == 0 && volumeFiles.length == 0)}
            >
                Submit Files!
            </button>
            <ProgressBar
                isInProgress={upload.isUploading}
                progressPercent={upload.uploadPercent}
                progressLabel="Uploading..."
                abortController={abortControllerRef.current}
            />
        </div>
    );
};

export default RenameComicsForm;
