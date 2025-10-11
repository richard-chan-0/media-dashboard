import { useDropzone } from "react-dropzone";
import { formDropzoneMessage } from "../constants";
import theme from "../theme";

export type FileUploaderProps = {
    onDrop: (files: File[]) => void;
}

/*
    * FileUploader component allows users to upload files by dragging and dropping them
    * or by clicking to select files. It uses the react-dropzone library for handling file drops.
    */
const FileUploader = ({ onDrop }: FileUploaderProps) => {
    const { getRootProps, getInputProps } = useDropzone({
        onDrop: onDrop,
    });

    return (
        <div
            {...getRootProps()}
            className={`border-dashed border-2 border-blue-200 ${theme.roundedBorder} ${theme.appSecondaryColor}  hover:bg-blue-200 active:bg-blue-300 p-2 text-center cursor-pointer w-full`}
        >
            <input {...getInputProps()} />
            <p>{formDropzoneMessage}</p>
        </div>)
}

export default FileUploader;

