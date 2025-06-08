import React, { useReducer, useRef, useState } from "react";
import { postForm } from "../../../../lib/api";
import {
    inputStartVolumeMessage,
    inputStoryNameMessage,
    mediaLink,
    no_api_error,
} from "../../../../lib/constants";
import { processApiResponseToNameChange } from "../../../../lib/api";
import UploadPreview from "../../../../lib/components/UploadPreview";
import FormContainer from "../FormContainer";
import FormInput from "../../../../lib/components/FormInput";
import ProgressBar from "../../../../lib/components/ProgressBar";
import { useRename } from "../../../hooks/usePageContext";
import { uploadReducer } from "../../../state/uploadReducer";
import FileUploader from "../../../../lib/components/FileUploader";

type RenameComicsFormProps = {
    stageDispatcher: React.ActionDispatch<[action: string]>;
};

const RenameComicsForm = ({ stageDispatcher }: RenameComicsFormProps) => {
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
            const processedResponse = processApiResponseToNameChange(response);
            dispatch({ type: "SET_NAME_CHANGES", payload: processedResponse });
            stageDispatcher("reset");
        }
        setStoryName("");
        setVolumeFiles([]);
        uploadDispatcher({ type: "RESET_UPLOAD" });
    };

    return (
        <FormContainer
            formTitle="Upload Comics"
            size={3}
            containerStyle="flex flex-col gap-2"
        >
            <div className="flex justify-between gap-4">
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
            </div>
            <FileUploader onDrop={handleDrop} />
            {volumeFiles.length > 0 && (
                <UploadPreview files={volumeFiles.map(file => file.name)} deleteFile={handleDelete} />
            )}
            <button
                onClick={handleSubmit}
                className="bg-blue-500 hover:bg-blue-600 active:bg-blue-800 disabled:bg-gray-200 text-white p-2 w-full rounded-b-lg"
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
        </FormContainer>
    );
};

export default RenameComicsForm;
