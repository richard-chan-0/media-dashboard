import { useEffect, useState } from "react";
import FormPage from "../lib/components/FormPage";
import { mediaLink, TASK_RENAME, VIDEOS, TASK_METADATA, TASK_EDIT, TASK_MERGE } from "../lib/constants";
import { get } from "../lib/api/api";
import { useRename } from "../lib/hooks/usePageContext";
import { RenameProvider } from "../service/rename/RenameProvider";
import NameChangePreview from "../service/rename/layout/NameChangePreview/NameChangePreview"
import RenamePanel from "../service/rename/shared/RenamePanel/RenamePanel";
import MetadataUpdatePreview from "../service/rename/layout/MetadataUpdatePreview/MetadataUpdatePreview";


type PreviewFile = {
    name: string;
    path: string;
};

const RenamePage = () => {
    const [mediaType, setMediaType] = useState<string>(VIDEOS);
    const { state, dispatch, pageState, pageDispatch } = useRename();
    const [changeType, setChangeType] = useState<typeof TASK_RENAME | typeof TASK_METADATA>(TASK_RENAME);
    const [editType, setEditType] = useState<typeof TASK_EDIT | typeof TASK_MERGE>(TASK_EDIT);

    const getTaskLayout = () => {
        switch (changeType) {
            case TASK_METADATA:
                return <MetadataUpdatePreview />
            case TASK_RENAME:
                return <NameChangePreview changeType={editType} />;
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
    }, [state, pageDispatch]);

    useEffect(() => {
        dispatch({ type: "SET_NAME_CHANGES", payload: { changes: [] } });
        dispatch({ type: "SET_MEDIA_TYPE", payload: mediaType });
    }, [dispatch, mediaType]);

    const handleSetTask = (v: typeof TASK_RENAME | typeof TASK_METADATA) => setChangeType(v);

    const handleEditType = (v: typeof TASK_EDIT | typeof TASK_MERGE) => setEditType(v);

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
                    task={changeType}
                    setTask={handleSetTask}
                    editType={editType}
                    setEditType={handleEditType}
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
