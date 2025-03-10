import { useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";

const FileUploadForm = () => {
    const [text, setText] = useState("");
    const [files, setFiles] = useState<File[]>([]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles) => setFiles(acceptedFiles),
    });

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append("text", text);
        files.forEach((file) => formData.append("file", file));

        try {
            const response = await axios.post("http://localhost:5000/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            console.log(response.data);
        } catch (error) {
            console.error("Error uploading:", error);
        }
    };

    return (
        <div className="p-4 max-w-lg mx-auto border rounded-lg shadow-md">
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text"
                className="border p-2 w-full mb-4"
            />
            <div {...getRootProps()} className="border-dashed border-2 p-6 text-center cursor-pointer">
                <input {...getInputProps()} />
                <p>Drag & drop files here, or click to select files</p>
            </div>
            <ul className="mt-2">
                {files.map((file) => (
                    <li key={file.name}>{file.name}</li>
                ))}
            </ul>
            <button onClick={handleSubmit} className="bg-blue-500 text-white p-2 mt-4 w-full">
                Submit
            </button>
        </div>
    );
};

export default FileUploadForm;
