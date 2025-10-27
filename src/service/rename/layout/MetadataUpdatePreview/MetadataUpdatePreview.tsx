import FormContainer from "../../../../lib/components/FormContainer";
import SubmitButton from "../../../../lib/components/SubmitButton";
import { VIDEOS, ffmpegLink, no_api_error } from "../../../../lib/constants";
import { useRename } from "../../../../lib/hooks/usePageContext";
import { useEffect, useState } from "react";
import Spinner from "../../../../lib/components/Spinner";
import MetadataEditChangeModal from "../../videos/MetadataEditChangeModal/MetadataEditChangeModal";
import MetadataFileTable from "../../videos/MetadataFileTable";
import { useMetadataEditWorkflow } from "../../shared/hooks/useMetadataEditWorkflow";
import { FileStreamsMap } from "../../../../lib/types";
import { get } from "../../../../lib/api/api";
import { removePathFromFilePath } from "../../../../lib/utilities";

const MetadataUpdatePreview = () => {
    const { state, pageState, pageDispatch } = useRename();

    const [fileStreamsMap, setFileStreamsMap] = useState<FileStreamsMap>({});
    const [isLoadingStreams, setIsLoadingStreams] = useState(false);

    const {
        isSpinner,
        isModalOpen,
        currentName,
        suggestedName,
        wasAdded,
        isBulkEnabled,
        handleMetadataEditChange,
        handleEditSubmit,
        handleBulkEdit,
        handleClick: baseHandleClick,
        handleModalClose,
        resetState,
    } = useMetadataEditWorkflow({
        getBulkEditItems: () =>
            state.nameChanges.changes.map((filename) => ({
                filename: filename.input,
                outputFilename: filename.output,
            })),
        includeRename: false
    });

    /**
     * Fetches stream information for all files from the API
     * The API returns a map of filename -> streams
     */
    const fetchAllStreams = async () => {
        if (!ffmpegLink) {
            pageDispatch({ type: "SET_ERROR", payload: no_api_error });
            return;
        }
        setIsLoadingStreams(true);
        const response = await get(`${ffmpegLink}/read`);
        setIsLoadingStreams(false);
        if (response?.error) {
            pageDispatch({ type: "SET_ERROR", payload: response.error });
        } else {
            setFileStreamsMap(response);
            pageDispatch({ type: "CLEAR_ERROR" });
        }
    };

    useEffect(() => {
        resetState();
        if (pageState.previewFiles && pageState.previewFiles.length > 0 && state.mediaType === VIDEOS) {
            fetchAllStreams();
        }
    }, [pageState.previewFiles, resetState]);

    const handleClick = (filename: string) => {
        baseHandleClick(filename, filename);
    };

    const footerButtons = () => {
        if (state.nameChanges.changes.length === 0) {
            return <></>;
        }
        return (
            <>
                <SubmitButton
                    label="Submit Bulk Edits!"
                    onClick={handleBulkEdit}
                    disabled={!isBulkEnabled}
                />
                <SubmitButton
                    onClick={() => handleEditSubmit()}
                    label="Submit Edits!"
                    buttonStyle="w-1/4"
                    disabled={isBulkEnabled}
                />
            </>
        )
    }

    const hasFiles = pageState.previewFiles && pageState.previewFiles.length > 0;

    return (
        <FormContainer
            formTitle="Update Metadata"
            containerStyle="flex flex-col gap-2"
        >
            {
                hasFiles && (
                    <>
                        <MetadataFileTable
                            files={state.nameChanges.changes.map(change => change.input)}
                            wasAdded={wasAdded}
                            onClick={handleClick}
                        />
                        <footer className="flex gap-4 w-full justify-end mt-2">
                            {
                                isSpinner ?
                                    <Spinner />
                                    : footerButtons()
                            }
                        </footer>
                    </>
                )
            }
            {
                !hasFiles && (
                    <div className="flex justify-center">
                        <p className="text-lg text-gray-500">
                            No files available.
                        </p>
                    </div>
                )
            }
            {state.mediaType === VIDEOS && (
                <MetadataEditChangeModal
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    currentName={currentName}
                    suggestedName={suggestedName}
                    onEdit={handleMetadataEditChange}
                    streams={fileStreamsMap[removePathFromFilePath(currentName)] || null}
                    isLoadingStreams={isLoadingStreams}
                />
            )}
        </FormContainer>
    );
};

export default MetadataUpdatePreview;
