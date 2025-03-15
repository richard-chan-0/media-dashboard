import { useState } from "react";
import { postForm } from "../lib/api";
import { useDropzone } from "react-dropzone";
import { formDropdownMessage, inputSeasonMessage } from "../lib/constants";
import theme from "../lib/theme";
import { processApiResponseToNameChange } from "../lib/api";
import Exception from "../lib/Exception";
import FileListUploadPreview from "../lib/NameChangeList";

type RenameVideosFormProps = {
    setNameChanges: CallableFunction
    setRenameMessage: CallableFunction
}

const RenameVideosForm = ({ setNameChanges, setRenameMessage }: RenameVideosFormProps) => {
    const apiLink = import.meta.env.VITE_API_LINK
    const [seasonNumber, setSeasonNumber] = useState("");
    const [episodeFiles, setEpisodeFiles] = useState<File[]>([]);
    const [error, setError] = useState("");

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles) => {
            setEpisodeFiles(acceptedFiles);
            setError("");
            setNameChanges({ changes: [] })
            setRenameMessage("");
        },
    });

    const handleSubmit = async () => {
        if (apiLink) {
            const formData = new FormData();
            formData.append("season_number", seasonNumber);
            episodeFiles.forEach((file) => formData.append("files", file));
            const response = await postForm(`${apiLink}/rename/videos`, formData)
            if (response?.error) {
                setError(response.error)
            } else {
                const processedResponse = processApiResponseToNameChange(response);
                setNameChanges(processedResponse);
            }
            setSeasonNumber("");
            setEpisodeFiles([]);
        }
    };

    return (
        <div className={`p-4 max-w-full border border-blue-400 rounded-lg shadow-blue-200 shadow-md m-4 ${theme.appColor}`}>
            <input
                type="number"
                value={seasonNumber}
                onChange={(e) => setSeasonNumber(e.target.value)}
                placeholder={inputSeasonMessage}
                className={`border p-2 w-full mb-4 rounded-t-lg ${theme.appSecondaryColor}`}
            />
            <div {...getRootProps()} className={`border-dashed border-2 border-blue-200 ${theme.appSecondaryColor}  hover:bg-blue-200 active:bg-blue-300 p-2 text-center cursor-pointer`}>
                <input {...getInputProps()} />
                <p>{formDropdownMessage}</p>
            </div>
            <FileListUploadPreview files={episodeFiles} />
            <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-600 active:bg-blue-800 disabled:bg-gray-200 text-white p-2 mt-4 w-full rounded-b-lg" disabled={episodeFiles.length == 0}>
                Submit Files!
            </button>
            <Exception error={error} />
        </div>
    );
};

export default RenameVideosForm;
