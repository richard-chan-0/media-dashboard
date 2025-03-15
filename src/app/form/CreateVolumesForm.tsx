import { useState } from "react";
import { postForm } from "../lib/api";
import { useDropzone } from "react-dropzone";
import { formDropdownMessage, inputStoryNameMessage } from "../lib/constants";
import theme from "../lib/theme";
import Exception from "../lib/components/Exception";
import FileListUploadPreview from "../lib/components/NameChangeList";
import VolumeMappingForm from "./VolumeMappingForm";

export type VolumeMapping = {
    [key: string]: {
        startChapter: number;
        endChapter: number;
    };
};

const CreateVolumesForm = () => {
    const apiLink = import.meta.env.VITE_MEDIA_UTILITY_API_LINK
    const [storyName, setStoryName] = useState("");
    const [volumesMapping, setVolumesMapping] = useState<VolumeMapping>({});
    const [volumeFiles, setVolumeFiles] = useState<File[]>([]);
    const [error, setError] = useState("");
    const [createVolumesMessage, setCreateVolumesMessage] = useState("");


    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles) => {
            setVolumeFiles(acceptedFiles)
            setError("");
        },
    });

    const getVolumesMappingToApiField = () => {
        const mappings = Object.entries(volumesMapping).map((entry) => ({
            "volume": entry[0],
            "startChapter": entry[1]["startChapter"],
            "endChapter": entry[1]["endChapter"]
        }))
        return {
            "volumes": mappings
        }
    }

    const handleSubmit = async () => {
        if (!apiLink) {
            setError("can't find api link");
            return
        }
        if (!storyName) {
            setError("story title is required")
            return
        }

        const formData = new FormData();
        formData.append("story title", storyName);
        formData.append("volume mapping", JSON.stringify(getVolumesMappingToApiField()));
        volumeFiles.forEach((file) => formData.append("files", file));
        const response = await postForm(`${apiLink}/manage/volumes`, formData)
        setCreateVolumesMessage(response?.error ? response.error : response);
        setStoryName("");
        setVolumeFiles([]);
        setVolumesMapping({})
    };

    return (
        <div className={`p-4 gap-2 max-w-3xl border border-blue-400 rounded-lg shadow-blue-200 shadow-md m-4 ${theme.appColor} justify-center flex flex-col`}>
            <input
                type="text"
                value={storyName}
                onChange={(e) => setStoryName(e.target.value)}
                placeholder={inputStoryNameMessage}
                className={`border p-2 w-full rounded-t-lg ${theme.appSecondaryColor}`}
            />
            <VolumeMappingForm setVolumesMapping={setVolumesMapping} />
            {
                Object.keys(volumesMapping).length > 0 && <pre className="text-sm border p-4 bg-black text-green-400 border-blue-200 rounded-lg">{JSON.stringify(volumesMapping, null, 2)}</pre>
            }
            <div {...getRootProps()} className={`border-dashed border-2 border-blue-200 ${theme.appSecondaryColor}  hover:bg-blue-200 active:bg-blue-300 p-2 text-center cursor-pointer`}>
                <input {...getInputProps()} />
                <p>{formDropdownMessage}</p>
            </div>
            <FileListUploadPreview files={volumeFiles} />
            <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-600 active:bg-blue-800 disabled:bg-gray-200 text-white  w-full rounded-b-lg" disabled={volumeFiles.length == 0}>
                Submit Files!
            </button>
            <Exception error={error} />
            {createVolumesMessage && (
                <div className="flex justify-center">
                    {createVolumesMessage}
                </div>
            )}
        </div>
    );
};

export default CreateVolumesForm;
