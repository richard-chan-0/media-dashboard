import { useState } from "react";
import RenameVideosForm from "../form/RenameVideosForm";
import NameChangeTable from "../components/NameChangeTable";
import { postJson, processNameChangeToApiRequest } from "../lib/api";

type RenamePageProps = {
    mediaType: string
};

const getRenameForm = (mediaType: string, setNameChanges: CallableFunction) => {
    switch (mediaType) {
        case "videos":
            return <RenameVideosForm setNameChanges={setNameChanges} />

        default:
            return <></>;
    }
}

const RenamePage = ({ mediaType }: RenamePageProps) => {
    const [nameChanges, setNameChanges] = useState({ changes: [] });

    const handleSubmit = async () => {
        const apiLink = import.meta.env.VITE_API_LINK
        if (apiLink) {
            const nameChangeRequest = processNameChangeToApiRequest(nameChanges);
            await postJson(`${apiLink}/rename/process`, nameChangeRequest)
        }
    };

    return (
        <div>
            {getRenameForm(mediaType, setNameChanges)}
            <NameChangeTable nameChanges={nameChanges} />
            {nameChanges?.changes.length > 0 && (
                <div className="flex justify-center">
                    <button className="bg-blue-500 hover:bg-blue-600 active:bg-blue-800 disabled:bg-gray-200 text-white p-2 m-4 rounded-lg" onClick={handleSubmit}>Rename Files</button>
                </div>
            )}
        </div>
    );
}

export default RenamePage;