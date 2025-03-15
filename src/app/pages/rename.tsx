import { useEffect, useState } from "react";
import RenameVideosForm from "../form/RenameVideosForm";
import RenameComicsForm from "../form/RenameComicsForm";
import NameChangeTable from "../lib/components/NameChangeTable";
import { postJson, processNameChangeToApiRequest } from "../lib/api";

type RenamePageProps = {
    mediaType: string
};

const getRenameForm = (mediaType: string, setNameChanges: CallableFunction, setRenameMessage: CallableFunction) => {
    switch (mediaType) {
        case "videos":
            return <RenameVideosForm setNameChanges={setNameChanges} setRenameMessage={setRenameMessage} />
        case "comics":
            return <RenameComicsForm setNameChanges={setNameChanges} setRenameMessage={setRenameMessage} />

        default:
            return <></>;
    }
}

const RenamePage = ({ mediaType }: RenamePageProps) => {
    const [nameChanges, setNameChanges] = useState({ changes: [] });
    const [renameMessage, setRenameMessage] = useState("");

    useEffect(() => {
        setNameChanges({ changes: [] });
        setRenameMessage("");
    }, [mediaType])

    const handleSubmit = async () => {
        const apiLink = import.meta.env.VITE_API_LINK
        if (apiLink) {
            const nameChangeRequest = processNameChangeToApiRequest(nameChanges);
            const response = await postJson(`${apiLink}/rename/process`, nameChangeRequest)
            setRenameMessage(response?.error ? response.error : response);
        }
        setNameChanges({ changes: [] });
    };

    return (
        <div>
            {getRenameForm(mediaType, setNameChanges, setRenameMessage)}
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
        </div>
    );
}

export default RenamePage;