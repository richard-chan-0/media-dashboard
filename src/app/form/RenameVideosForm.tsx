import { useState } from "react";
import { postForm } from "../lib/api";
import { useDropzone } from "react-dropzone";
import { formDropdownMessage, inputSeasonMessage } from "../lib/constants";
import theme from "../lib/theme";
import { processApiResponseToNameChange } from "../lib/api";
import FileListUploadPreview from "../lib/components/NameChangeList";
import FormContainer from "./FormContainer";
import FormInput from "../lib/components/FormInput";

type RenameVideosFormProps = {
    setNameChanges: CallableFunction
    setRenameMessage: CallableFunction
    setError: CallableFunction
}

const RenameVideosForm = ({ setNameChanges, setRenameMessage, setError }: RenameVideosFormProps) => {
    const apiLink = import.meta.env.VITE_API_LINK
    const [seasonNumber, setSeasonNumber] = useState("");
    const [episodeFiles, setEpisodeFiles] = useState<File[]>([]);

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
        <FormContainer formTitle="Rename Videos" size={3} containerStyle="flex flex-col gap-2">
            <FormInput
                type="number"
                inputValue={seasonNumber}
                setInputValue={setSeasonNumber}
                placeholder={inputSeasonMessage}
            />
            <div {...getRootProps()} className={`border-dashed border-2 border-blue-200 ${theme.appSecondaryColor}  hover:bg-blue-200 active:bg-blue-300 p-2 text-center cursor-pointer`}>
                <input {...getInputProps()} />
                <p>{formDropdownMessage}</p>
            </div>
            {episodeFiles.length > 0 &&
                <FileListUploadPreview files={episodeFiles} />
            }
            <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-600 active:bg-blue-800 disabled:bg-gray-200 text-white p-2 w-full rounded-b-lg" disabled={episodeFiles.length == 0}>
                Submit Files!
            </button>
        </FormContainer>
    );
};

export default RenameVideosForm;
