import React, { useState } from "react";
import { postForm } from "../../../lib/api";
import { useDropzone } from "react-dropzone";
import {
    formDropdownMessage,
    inputStartVolumeMessage,
    inputStoryNameMessage,
    mediaLink,
    no_api_error,
} from "../../../lib/constants";
import theme from "../../../lib/theme";
import { processApiResponseToNameChange } from "../../../lib/api";
import FileListUploadPreview from "../../../lib/components/NameChangeList";
import FormContainer from "./FormContainer";
import FormInput from "../../../lib/components/FormInput";
import ProgressBar from "../../../lib/components/ProgressBar";
import { useRename } from "../../hooks/useRename";

type RenameVideosFormProps = {
    stageDispatcher: React.ActionDispatch<[action: string]>;
};

const RenameComicsForm = ({ stageDispatcher }: RenameVideosFormProps) => {
    const [storyName, setStoryName] = useState("");
    const [startVolume, setStartVolume] = useState("");
    const [volumeFiles, setVolumeFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadPercent, setUploadPercent] = useState(0);
    const { dispatch } = useRename();

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles) => {
            setVolumeFiles(acceptedFiles);
            dispatch({ type: "CLEAR_ERROR" });
            dispatch({ type: "CLEAR_NAME_CHANGES" });
        },
    });

    const handleSubmit = async () => {
        if (!mediaLink) {
            dispatch({ type: "SET_ERROR", payload: no_api_error });
            return;
        }
        if (!storyName) {
            dispatch({ type: "SET_ERROR", payload: "story title is required" });
            return;
        }

        const formData = new FormData();
        formData.append("comic_name", storyName);
        formData.append("start_number", startVolume);
        volumeFiles.forEach((file) => formData.append("files", file));
        setIsUploading(true);
        const response = await postForm(
            `${mediaLink}/rename/comics`,
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
        setStoryName("");
        setVolumeFiles([]);
        setIsUploading(false);
        setUploadPercent(0);
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

            <div
                {...getRootProps()}
                className={`border-dashed border-2 border-blue-200 ${theme.appSecondaryColor}  hover:bg-blue-200 active:bg-blue-300 p-2 text-center cursor-pointer`}
            >
                <input {...getInputProps()} />
                <p>{formDropdownMessage}</p>
            </div>
            {volumeFiles.length > 0 && (
                <FileListUploadPreview files={volumeFiles} />
            )}
            <button
                onClick={handleSubmit}
                className="bg-blue-500 hover:bg-blue-600 active:bg-blue-800 disabled:bg-gray-200 text-white p-2 w-full rounded-b-lg"
                disabled={volumeFiles.length == 0}
            >
                Submit Files!
            </button>
            <ProgressBar
                isInProgress={isUploading}
                progressPercent={uploadPercent}
                progressLabel="Uploading..."
            />
        </FormContainer>
    );
};

export default RenameComicsForm;
