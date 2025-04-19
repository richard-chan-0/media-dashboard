import { useEffect, useReducer, useState } from "react";
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

const stageReducer = (stage: number, action: string) => {
    switch (action) {
        case "next":
            return stage + 1 > 2 ? 2 : stage + 1;
        case "prev":
            return stage - 1 < 0 ? 0 : stage - 1;
        case "reset":
            return 0;
        default:
            return stage
    }
}


const RenamePage = ({ mediaType }: RenamePageProps) => {
    const [nameChanges, setNameChanges] = useState<NameChanges>({ changes: [] });
    // TODO: decouple preview files from upload stage
    const [previewFiles, setPreviewFiles] = useState([]);
    const [error, setError] = useState("");
    const [stage, stageDispatcher] = useReducer(stageReducer, 0);


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
    }, [mediaType])


    return (
        <FormPage error={error} isColumn={false} pageStyle="justify-center items-start">
            {
                stage == 0 && (
                    <RenameUploadStage
                        previewFiles={previewFiles}
                        mediaType={mediaType}
                        setNameChanges={setNameChanges}
                        setError={setError}
                        stageDispatcher={stageDispatcher}
                    />
                )
            }
            {
                stage == 1 && (
                    <NameChangePreview
                        nameChanges={nameChanges}
                        setNameChanges={setNameChanges}
                        stage={stage}
                        stageDispatcher={stageDispatcher}
                        setError={setError}
                    />
                )
            }
            {
                stage == 2 && (
                    <SetStreams setError={setError} stageDispatcher={stageDispatcher} stage={stage} />
                )
            }
        </FormPage >
    );
}

export default RenamePage;