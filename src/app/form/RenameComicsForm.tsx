import { useState } from "react";
import { postForm } from "../lib/api";
import { useDropzone } from "react-dropzone";
import { formDropdownMessage, inputStartVolumeMessage, inputStoryNameMessage } from "../lib/constants";
import theme from "../lib/theme";
import { processApiResponseToNameChange } from "../lib/api";
import Exception from "../lib/components/Exception";
import FileListUploadPreview from "../lib/components/NameChangeList";

type RenameVideosFormProps = {
    setNameChanges: CallableFunction
    setRenameMessage: CallableFunction
}

const RenameComicsForm = ({ setNameChanges, setRenameMessage }: RenameVideosFormProps) => {
    const apiLink = import.meta.env.VITE_API_LINK
    const [storyName, setStoryName] = useState("");
    const [startVolume, setStartVolume] = useState("");
    const [volumeFiles, setVolumeFiles] = useState<File[]>([]);
    const [error, setError] = useState("");

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles) => {
            setVolumeFiles(acceptedFiles)
            setError("");
            setNameChanges({ changes: [] })
            setRenameMessage("");
        },
    });

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
        formData.append("comic_name", storyName);
        formData.append("start_number", startVolume);
        volumeFiles.forEach((file) => formData.append("files", file));
        const response = await postForm(`${apiLink}/rename/comics`, formData)
        if (response?.error) {
            setError(response.error)
        } else {
            const processedResponse = processApiResponseToNameChange(response);
            setNameChanges(processedResponse);
        }
        setStoryName("");
        setVolumeFiles([]);
    };

    return (
        <div className={`p-4 max-w-full border border-blue-400 rounded-lg shadow-blue-200 shadow-md m-4 ${theme.appColor}`}>
            <input
                type="text"
                value={storyName}
                onChange={(e) => setStoryName(e.target.value)}
                placeholder={inputStoryNameMessage}
                className={`border p-2 w-full mb-4 rounded-t-lg ${theme.appSecondaryColor}`}
            />
            <input
                type="number"
                value={startVolume}
                onChange={(e) => setStartVolume(e.target.value)}
                placeholder={inputStartVolumeMessage}
                className={`border p-2 w-full mb-4 ${theme.appSecondaryColor}`}
            />
            <div {...getRootProps()} className={`border-dashed border-2 border-blue-200 ${theme.appSecondaryColor}  hover:bg-blue-200 active:bg-blue-300 p-2 text-center cursor-pointer`}>
                <input {...getInputProps()} />
                <p>{formDropdownMessage}</p>
            </div>
            <FileListUploadPreview files={volumeFiles} />
            <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-600 active:bg-blue-800 disabled:bg-gray-200 text-white p-2 mt-4 w-full rounded-b-lg" disabled={volumeFiles.length == 0}>
                Submit Files!
            </button>
            <Exception error={error} />
        </div>
    );
};

export default RenameComicsForm;
