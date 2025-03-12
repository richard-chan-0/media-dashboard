import { useState } from "react";
import { postForm } from "../../lib/api";
import { useDropzone } from "react-dropzone";
import { formDropdownMessage, inputSeasonMessage } from "../../lib/constants";

const RenameVideosForm = () => {
    const apiLink = import.meta.env.VITE_API_LINK
    const [seasonNumber, setSeasonNumber] = useState("");
    const [episodeFiles, setEpisodeFiles] = useState<File[]>([]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles) => setEpisodeFiles(acceptedFiles),
    });

    const handleSubmit = async () => {
        if (apiLink) {
            const formData = new FormData();
            formData.append("season_number", seasonNumber);
            episodeFiles.forEach((file) => formData.append("files", file));
            await postForm(`${apiLink}/rename/videos`, formData);
        }
    };

    return (
        <div className="p-4 max-w-lg mx-auto border border-blue-400 rounded-lg shadow-md">
            <input
                type="number"
                value={seasonNumber}
                onChange={(e) => setSeasonNumber(e.target.value)}
                placeholder={inputSeasonMessage}
                className="border p-2 w-full mb-4 rounded-md"
            />
            <div {...getRootProps()} className="border-dashed border-2 rounded-md border-blue-200 bg-blue-300 hover:bg-blue-400 active:bg-blue-500 p-6 text-center cursor-pointer">
                <input {...getInputProps()} />
                <p>{formDropdownMessage}</p>
            </div>
            <ul className="mt-2">
                {episodeFiles.map((file) => (
                    <li key={file.name}>{file.name}</li>
                ))}
            </ul>
            <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-600 active:bg-blue-800 disabled:bg-gray-200 text-white p-2 mt-4 w-full" disabled={episodeFiles.length == 0}>
                Submit Files!
            </button>
        </div>
    );
};

export default RenameVideosForm;
