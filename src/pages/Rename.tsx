import { useEffect, useState } from "react";
import FormPage from "../lib/components/FormPage";
import { mediaLink, TASK_RENAME, VIDEOS, TASK_MERGE } from "../lib/constants";
import { get } from "../lib/api/api";
import { useRename } from "../lib/hooks/usePageContext";
import { RenameProvider } from "../service/rename/RenameProvider";
import PreviewFiles from "../lib/components/PreviewFiles";
import { NameChangePreview } from "../service/rename/stages"
import RenamePanel from "../service/rename/shared/RenamePanel/RenamePanel";


type PreviewFile = {
    name: string;
    path: string;
};

const RenamePage = () => {
    const [mediaType, setMediaType] = useState<string>(VIDEOS);
    const { state, dispatch, pageState, pageDispatch } = useRename();
    const [changeType, setChangeType] = useState<"rename" | "merge">("rename");

    const getTaskLayout = () => {
        switch (changeType) {
            case "merge":
                return <PreviewFiles />
            case "rename":
                return <NameChangePreview />;
            default:
                return <></>;
        }
    };

    useEffect(() => {
        const fetch = async (apiLink: string) => {
            if (!apiLink) {
                return;
            }
            const response = await get(`${apiLink}/rename/read`);
            if (response?.error) {
                pageDispatch({ type: "SET_ERROR", payload: response.error });
            } else {
                const previews = response
                    .map((file: PreviewFile) => file?.name)
                    .sort();
                pageDispatch({ type: "SET_PREVIEWS", payload: previews });
            }
        };
        fetch(mediaLink);
    }, [state]);

    useEffect(() => {
        dispatch({ type: "SET_NAME_CHANGES", payload: { changes: [] } });
        dispatch({ type: "SET_MEDIA_TYPE", payload: mediaType });
    }, [dispatch, mediaType]);

    return (
        <FormPage
            error={pageState.error}
            isColumn={false}
            pageStyle="justify-center items-start h-full w-full"
        >
            <div className="flex w-full h-full">
                <RenamePanel
                    renameMedia={mediaType}
                    setRenameMedia={setMediaType}
                    task={changeType === TASK_RENAME ? TASK_RENAME : TASK_MERGE}
                    setTask={(v) => setChangeType(v === TASK_RENAME ? TASK_RENAME : TASK_MERGE)}
                />
                <section className="flex mt-4 justify-center flex-1">
                    {getTaskLayout()}
                </section>
            </div>
        </FormPage>
    );
};

const RenamePageWrapper = () => {
    return (
        <RenameProvider>
            <RenamePage />
        </RenameProvider>
    );
};

export default RenamePageWrapper;
