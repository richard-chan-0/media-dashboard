import { useState } from "react";
import { postForm } from "../../../lib/api";
import { useDropzone } from "react-dropzone";
import {
    formDropdownMessage,
    inputStoryNameMessage,
} from "../../../lib/constants";
import theme from "../../../lib/theme";
import Exception from "../../../lib/components/Exception";
import FileListUploadPreview from "../../../lib/components/NameChangeList";
import VolumeMappingForm from "./VolumeMappingForm";
import FormContainer from "./FormContainer";
import FormInput from "../../../lib/components/FormInput";

export type VolumeMapping = {
    [key: string]: {
        startChapter: number;
        endChapter: number;
    };
};

const CreateVolumesForm = () => {
    // TODO: import api constant
    const apiLink = import.meta.env.VITE_MEDIA_UTILITY_API_LINK;
    const [storyName, setStoryName] = useState("");
    const [volumesMapping, setVolumesMapping] = useState<VolumeMapping>({});
    const [volumeFiles, setVolumeFiles] = useState<File[]>([]);
    const [error, setError] = useState("");
    const [createVolumesMessage, setCreateVolumesMessage] = useState("");

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles) => {
            setVolumeFiles(acceptedFiles);
            setError("");
        },
    });

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

    const handleSubmit = async () => {
        if (!apiLink) {
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
        const response = await postForm(`${apiLink}/manage/volumes`, formData);
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
                    <div
                        {...getRootProps()}
                        className={`border-dashed border-2 border-blue-200 ${theme.appSecondaryColor}  hover:bg-blue-200 active:bg-blue-300 text-center cursor-pointer`}
                    >
                        <input {...getInputProps()} />
                        <p>{formDropdownMessage}</p>
                    </div>
                    <FileListUploadPreview files={volumeFiles} />
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
