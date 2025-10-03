import { useReducer, useRef, useState } from "react";
import { postForm } from "../../lib/api";
import {
    inputStoryNameMessage,
    mediaLink,
    no_api_error,
} from "../../lib/constants";
import UploadPreview from "../../lib/components/UploadPreview";
import VolumeMappingForm from "./VolumeMappingForm";
import FormContainer from "../../lib/components/FormContainer";
import FormInput from "../../lib/components/FormInput";
import FileUploader from "../../lib/components/FileUploader";
import { uploadReducer } from "../state/uploadReducer";
import { ProgressBar } from "../../lib/components";
import { useManage } from "../hooks/usePageContext";

export type VolumeMapping = {
    [key: string]: {
        startChapter: number;
        endChapter: number;
    };
};

const CreateVolumesForm = () => {
    const [storyName, setStoryName] = useState("");
    const [volumesMapping, setVolumesMapping] = useState<VolumeMapping>({});
    const [volumeFiles, setVolumeFiles] = useState<File[]>([]);
    const [createVolumesMessage, setCreateVolumesMessage] = useState("");
    const { pageDispatch } = useManage();
    const abortControllerRef = useRef<AbortController | null>(null);
    const [upload, uploadDispatcher] = useReducer(uploadReducer, { isUploading: false, uploadPercent: 0 });

    const getVolumesMappingToApiField = () => {
        const mappings = Object.entries(volumesMapping).map((entry) => ({
            volume: entry[0],
            startChapter: entry[1]["startChapter"],
            endChapter: entry[1]["endChapter"],
        }));
        return {
            volumes: mappings,
        };
    };

    const handleDelete = (file_name: string) => {
        const newFiles = volumeFiles.filter((file: File) => file.name !== file_name);
        setVolumeFiles(newFiles);
    }

    const handleDrop = (acceptedFiles: File[]) => {
        setVolumeFiles(acceptedFiles);
        pageDispatch({ type: "CLEAR_ERROR" });
    }

    const handleSubmit = async () => {
        if (!mediaLink) {
            pageDispatch({ type: "SET_ERROR", payload: no_api_error });
            return;
        }

        const formData = new FormData();
        formData.append("story title", storyName);
        formData.append(
            "volume mapping",
            JSON.stringify(getVolumesMappingToApiField()),
        );
        volumeFiles.forEach((file) => formData.append("files", file));
        abortControllerRef.current = new AbortController();
        uploadDispatcher({ type: "START_UPLOAD" });
        const response = await postForm(
            `${mediaLink}/manage/volumes`,
            formData,
            uploadDispatcher,
            abortControllerRef.current.signal
        );
        if (response?.error) {
            pageDispatch({ type: "SET_ERROR", payload: response.error });
        } else {
            setCreateVolumesMessage(response?.error ? response.error : response);
            setStoryName("");
            setVolumeFiles([]);
            setVolumesMapping({});
        }
        uploadDispatcher({ type: "RESET_UPLOAD" });
        abortControllerRef.current = null;
    };

    return (
        <div className="flex gap-4">
            <FormContainer
                size={4}
                containerStyle="flex flex-col gap-2"
                formTitle="Create Volume Mapping"
            >
                <VolumeMappingForm setVolumesMapping={setVolumesMapping} />
                {Object.keys(volumesMapping).length > 0 && (
                    <pre className="text-sm border p-4 bg-black text-green-400 border-blue-200 rounded-lg opacity-90">
                        {JSON.stringify(volumesMapping, null, 2)}
                    </pre>
                )}
            </FormContainer>
            <FormContainer
                size={2}
                formTitle="Create Volumes"
                containerStyle="flex flex-col gap-2"
            >
                <FormInput
                    type="text"
                    inputValue={storyName}
                    setInputValue={setStoryName}
                    placeholder={inputStoryNameMessage}
                />
                <FileUploader onDrop={handleDrop} />
                <UploadPreview files={volumeFiles.map(file => file.name)} deleteFile={handleDelete} />
                <button
                    onClick={handleSubmit}
                    className="bg-blue-500 hover:bg-blue-600 active:bg-blue-800 disabled:bg-gray-200 text-white  w-full rounded-b-lg"
                    disabled={
                        volumeFiles.length == 0
                        || upload.isUploading
                        || !storyName.trim()
                        || Object.keys(volumesMapping).length === 0
                    }
                    data-testid="submit-button"
                >
                    Submit Files!
                </button>
                <ProgressBar
                    isInProgress={upload.isUploading}
                    progressPercent={upload.uploadPercent}
                    progressLabel={"Uploading..."}
                    abortController={abortControllerRef.current}
                />
                {createVolumesMessage && (
                    <div className="flex justify-center">
                        {createVolumesMessage}
                    </div>
                )}
            </FormContainer>
        </div>
    );
};

export default CreateVolumesForm;
