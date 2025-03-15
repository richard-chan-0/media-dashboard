import { postForm } from "../lib/api";
import { ffmpegLink } from "../lib/constants";
import { useState } from "react";
import theme from "../lib/theme";

type ResetDefaultsFormProps = {
    setError: CallableFunction
}

const ResetDefaultsForm = ({ setError }: ResetDefaultsFormProps) => {
    const [pathToFiles, setPathToFiles] = useState("");

    const handleSubmit = async () => {
        if (ffmpegLink) {
            const formData = new FormData();
            formData.append("path", pathToFiles);
            const response = await postForm(`${ffmpegLink}/default_reset/streams`, formData)
            if (response?.error) {
                setError(response?.error)
            } else {
                console.log(response);
            }
        }
    };

    return (
        <div className={`p-4 w-m border border-blue-400 rounded-2xl shadow-blue-200 shadow-md m-4 ${theme.appColor}`}>
            <input
                type="text"
                value={pathToFiles}
                onChange={(e) => setPathToFiles(e.target.value)}
                placeholder="Enter path to files"
                className={`border p-2 w-full mb-4 rounded-t-lg ${theme.appSecondaryColor}`}
            />
            <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-600 active:bg-blue-800 disabled:bg-gray-200 text-white p-2 mt-4 w-full rounded-b-lg" >
                Get Streams
            </button>
        </div>
    );
};

export default ResetDefaultsForm;