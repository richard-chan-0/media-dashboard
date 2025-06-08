import { useEffect, useReducer } from "react";
import FormPage from "./FormPage";
import { mediaLink } from "../lib/constants";
import { get } from "../lib/api";
import { useRename } from "./hooks/usePageContext";
import { RenameProvider } from "./provider/RenameProvider";
import PreviewFiles from "./stages/forms/PreviewFiles";
import { RenameUploadStage, SetStreams, NameChangePreview } from "./stages"

type RenamePageProps = {
    mediaType: string;
};

type PreviewFile = {
    name: string;
    path: string;
};

const stageReducer = (stage: number, action: string) => {
    switch (action) {
        case "next":
            return stage + 1 > 2 ? 2 : stage + 1;
        case "prev":
            return stage - 1 < 0 ? 0 : stage - 1;
        case "reset":
            return 0;
        default:
            return stage;
    }
};

const RenamePage = ({ mediaType }: RenamePageProps) => {
    const { dispatch, pageState, pageDispatch } = useRename();
    const [stage, stageDispatcher] = useReducer(stageReducer, 0);

    const getStages = (stage: number) => {
        switch (stage) {
            case 0:
                return (
                    <>
                        <PreviewFiles />
                        <RenameUploadStage
                            mediaType={mediaType}
                            stageDispatcher={stageDispatcher}
                        />
                    </>
                );
            case 1:
                return <NameChangePreview stageDispatcher={stageDispatcher} />;
            case 2:
                return <SetStreams stageDispatcher={stageDispatcher} />;
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
    }, [dispatch]);

    useEffect(() => {
        dispatch({ type: "SET_NAME_CHANGES", payload: { changes: [] } });
        dispatch({ type: "SET_MEDIA_TYPE", payload: mediaType });
    }, [dispatch, mediaType]);

    return (
        <FormPage
            error={pageState.error}
            isColumn={false}
            pageStyle="justify-center items-start"
        >
            {getStages(stage)}
        </FormPage>
    );
};

const RenamePageWrapper = ({ mediaType }: RenamePageProps) => {
    return (
        <RenameProvider>
            <RenamePage mediaType={mediaType} />
        </RenameProvider>
    );
};

export default RenamePageWrapper;
