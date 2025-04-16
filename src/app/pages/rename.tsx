import { useEffect, useState } from "react";
import FormPage from "./formPage";
import { mediaLink } from "../lib/constants";
import RenameUploadStage from "../stages/upload";
import { NameChanges } from "../lib/types";
import NameChangePreview from "../stages/nameChange";
import { get } from "../lib/api";
import SetStreams from "../stages/setStreams";

type RenamePageProps = {
    mediaType: string
};

type PreviewFile = {
    name: string;
    path: string;
}


const RenamePage = ({ mediaType }: RenamePageProps) => {
    const [nameChanges, setNameChanges] = useState<NameChanges>({ changes: [] });
    const [renameMessage, setRenameMessage] = useState("");
    const [previewFiles, setPreviewFiles] = useState([]);
    const [error, setError] = useState("");
    const [stage, setStage] = useState(0);


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


    return (
        <FormPage error={error} isColumn={false} pageStyle="justify-center items-start">
            {
                stage == 0 && (
                    <RenameUploadStage
                        previewFiles={previewFiles}
                        mediaType={mediaType}
                        setNameChanges={setNameChanges}
                        setRenameMessage={setRenameMessage}
                        setError={setError}
                        setStage={setStage}
                    />
                )
            }
            {
                stage == 1 && (
                    <NameChangePreview
                        nameChanges={nameChanges}
                        setNameChanges={setNameChanges}
                        setRenameMessage={setRenameMessage}
                        stage={stage}
                        setStage={setStage}
                    />
                )
            }
            {
                stage == 2 && (
                    <SetStreams setError={setError} setStage={setStage} stage={stage} />
                )
            }

            {renameMessage && (
                <div className="flex justify-center">
                    {renameMessage}
                </div>
            )}

        </FormPage >
    );
}

export default RenamePage;