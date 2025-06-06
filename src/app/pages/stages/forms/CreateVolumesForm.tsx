import { useState } from "react";
import { postForm } from "../../../lib/api";
import {
    inputStoryNameMessage,
    mediaLink,
} from "../../../lib/constants";
import Exception from "../../../lib/components/Exception";
import UploadPreview from "../../../lib/components/UploadPreview";
import VolumeMappingForm from "./VolumeMappingForm";
import FormContainer from "./FormContainer";
import FormInput from "../../../lib/components/FormInput";
import FileUploader from "../../../lib/components/FileUploader";

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
    const [error, setError] = useState("");
    const [createVolumesMessage, setCreateVolumesMessage] = useState("");

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
        setError("");
    }

    const handleSubmit = async () => {
        if (!mediaLink) {
            setError("can't find api link");
            return;
        }
        if (!storyName) {
            setError("story title is required");
            return;
        }

        const formData = new FormData();
        formData.append("story title", storyName);
        formData.append(
            "volume mapping",
            JSON.stringify(getVolumesMappingToApiField()),
        );
        volumeFiles.forEach((file) => formData.append("files", file));
        const response = await postForm(`${mediaLink}/manage/volumes`, formData);
        setCreateVolumesMessage(response?.error ? response.error : response);
        setStoryName("");
        setVolumeFiles([]);
        setVolumesMapping({});
    };

    return (
        <>
            <Exception error={error} />
            <div className="flex md:flex-row flex-col gap-4 items-center md:justify-center md:items-start">
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
                        disabled={volumeFiles.length == 0}
                    >
                        Submit Files!
                    </button>
                    {createVolumesMessage && (
                        <div className="flex justify-center">
                            {createVolumesMessage}
                        </div>
                    )}
                </FormContainer>
            </div>
        </>
    );
};

export default CreateVolumesForm;
