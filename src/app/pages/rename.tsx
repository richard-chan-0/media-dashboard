import { useEffect, useState } from "react";
import RenameVideosForm from "../form/RenameVideosForm";
import RenameComicsForm from "../form/RenameComicsForm";
import NameChangeTable from "../lib/components/NameChangeTable";
import { get, postJson, processNameChangeToApiRequest } from "../lib/api";
import FormPage from "./formPage";
import FormContainer from "../form/FormContainer";
import { mediaLink } from "../lib/constants";

type RenamePageProps = {
    mediaType: string
};

type PreviewFile = {
    name: string;
    path: string;
}

const getRenameForm = (
    mediaType: string,
    setNameChanges: CallableFunction,
    setRenameMessage: CallableFunction,
    setError: CallableFunction,
    previewFiles: string[]
) => {
    switch (mediaType) {
        case "videos":
            return (
                <RenameVideosForm
                    setNameChanges={setNameChanges}
                    setRenameMessage={setRenameMessage}
                    setError={setError}
                    previewFiles={previewFiles}
                />
            )
        case "comics":
            return (
                <RenameComicsForm
                    setNameChanges={setNameChanges}
                    setRenameMessage={setRenameMessage}
                    setError={setError}
                />
            )

        default:
            return <></>;
    }
}

const RenamePage = ({ mediaType }: RenamePageProps) => {
    const [nameChanges, setNameChanges] = useState({ changes: [] });
    const [renameMessage, setRenameMessage] = useState("");
    const [previewFiles, setPreviewFiles] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetch = async (apiLink: string) => {
            if (!apiLink) {
                return;
            }
            const response = await get(`${apiLink}/rename/read`)
            if (response?.error) {
                setError(response.error);
            } else {
                const previews = response.map((file: PreviewFile) => file?.name).sort();
                setPreviewFiles(previews);
            }
        };
        fetch(mediaLink);

    }, []);

    useEffect(() => {
        setNameChanges({ changes: [] });
        setRenameMessage("");
    }, [mediaType])

    const handleSubmit = async () => {
        if (mediaLink) {
            const nameChangeRequest = processNameChangeToApiRequest(nameChanges);
            const response = await postJson(`${mediaLink}/rename/process`, nameChangeRequest)
            setRenameMessage(response?.error ? response.error : response);
        }
        setNameChanges({ changes: [] });
    };

    return (
        <FormPage error={error} isColumn={false} pageStyle="justify-center items-start">
            <div>
                {
                    previewFiles.length > 0 && (
                        <FormContainer
                            size={3}
                            formTitle="Uploaded Files"
                            containerStyle="flex flex-col gap-2"
                        >
                            <p className="text-sm"><i>files currently uploaded</i></p>

                            <ul className="border border-white shadow-white shadow-md bg-black p-2 text-md font-light">
                                {previewFiles.map((fileName: string) => (
                                    <li key={fileName}>{fileName}</li>
                                ))}
                            </ul>

                        </FormContainer>
                    )
                }
            </div >
            <FormContainer
                formTitle={mediaType == "videos" ? "Rename Videos" : "Rename Comics"}
                size={6}
                containerStyle="flex flex-col gap-2 items-center"
            >
                {getRenameForm(mediaType, setNameChanges, setRenameMessage, setError, previewFiles)}
                <NameChangeTable nameChanges={nameChanges} />
                {nameChanges?.changes.length > 0 && (
                    <div className="flex justify-center">
                        <button className="bg-blue-500 hover:bg-blue-600 active:bg-blue-800 disabled:bg-gray-200 text-white p-2 m-4 rounded-lg" onClick={handleSubmit}>Rename Files</button>
                    </div>
                )}
                {renameMessage && (
                    <div className="flex justify-center">
                        {renameMessage}
                    </div>
                )}
            </FormContainer>

        </FormPage >
    );
}

export default RenamePage;