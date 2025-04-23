import { useEffect, useReducer, useState } from "react";
import FormPage from "./formPage";
import { mediaLink } from "../lib/constants";
import RenameUploadStage from "../stages/upload";
import { NameChanges } from "../lib/types";
import NameChangePreview from "../stages/nameChange";
import { get } from "../lib/api";
import SetStreams from "../stages/setStreams";
import PreviewFiles from "../forms/PreviewFiles";

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
    // TODO: create reducer for name changes, preview files, and error
    const [nameChanges, setNameChanges] = useState<NameChanges>({ changes: [] });
    // TODO: decouple preview files from upload stage
    const [previewFiles, setPreviewFiles] = useState([]);
    const [error, setError] = useState("");
    const [stage, stageDispatcher] = useReducer(stageReducer, 0);

    const getStages = (stage: number) => {
        switch (stage) {
            case 0:
                return (
                    <>
                        <PreviewFiles />
                        <RenameUploadStage
                            previewFiles={previewFiles}
                            mediaType={mediaType}
                            setNameChanges={setNameChanges}
                            setError={setError}
                            stageDispatcher={stageDispatcher}
                        />
                    </>
                )
            case 1:
                return <NameChangePreview
                    nameChanges={nameChanges}
                    setNameChanges={setNameChanges}
                    stageDispatcher={stageDispatcher}
                    setError={setError}
                />
            case 2:
                return <SetStreams setError={setError} stageDispatcher={stageDispatcher} />
            default:
                return <></>
        }
    }

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
                getStages(stage)
            }
        </FormPage >
    );
}

export default RenamePage;