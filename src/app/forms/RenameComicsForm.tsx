import { useState } from "react";
import { postForm } from "../lib/api";
import { useDropzone } from "react-dropzone";
import { formDropdownMessage, inputStartVolumeMessage, inputStoryNameMessage, mediaLink } from "../lib/constants";
import theme from "../lib/theme";
import { processApiResponseToNameChange } from "../lib/api";
import FileListUploadPreview from "../lib/components/NameChangeList";
import FormContainer from "./FormContainer";
import FormInput from "../lib/components/FormInput";

type RenameVideosFormProps = {
    setNameChanges: CallableFunction
    setError: CallableFunction
}

const RenameComicsForm = ({ setNameChanges, setError }: RenameVideosFormProps) => {
    const [storyName, setStoryName] = useState("");
    const [startVolume, setStartVolume] = useState("");
    const [volumeFiles, setVolumeFiles] = useState<File[]>([]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles) => {
            setVolumeFiles(acceptedFiles)
            setError("");
            setNameChanges({ changes: [] })
        },
    });

    const handleSubmit = async () => {
        if (!mediaLink) {
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
        const response = await postForm(`${mediaLink}/rename/comics`, formData)
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
        <FormContainer size={3} containerStyle="flex flex-col gap-2">
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
            <div {...getRootProps()} className={`border-dashed border-2 border-blue-200 ${theme.appSecondaryColor}  hover:bg-blue-200 active:bg-blue-300 p-2 text-center cursor-pointer`}>
                <input {...getInputProps()} />
                <p>{formDropdownMessage}</p>
            </div>
            {
                volumeFiles.length > 0 &&
                <FileListUploadPreview files={volumeFiles} />
            }
            <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-600 active:bg-blue-800 disabled:bg-gray-200 text-white p-2 w-full rounded-b-lg" disabled={volumeFiles.length == 0}>
                Submit Files!
            </button>
        </FormContainer>

    );
};

export default RenameComicsForm;
