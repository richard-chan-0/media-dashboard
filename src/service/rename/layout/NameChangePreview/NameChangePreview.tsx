import FormContainer from "../../../../lib/components/FormContainer";
import { NameChangeTable } from "../../shared";
import SubmitButton from "../../../../lib/components/SubmitButton";
import { mediaLink, no_api_error, VIDEOS, ffmpegLink, TASK_MERGE, TASK_EDIT } from "../../../../lib/constants";
import { useRename } from "../../../../lib/hooks/usePageContext";
import { useEffect, useState, useMemo } from "react";
import Spinner from "../../../../lib/components/Spinner";
import { MetadataMergeChange, MetadataMergeChanges } from "../../../../lib/types";
import { postMetadataMerge } from "../../../../lib/api/metadata";
import { useDeleteFile } from "../../../../lib/hooks/useDeleteFile";
import { removePathFromFilePath } from "../../../../lib/utilities";
import MetadataEditChangeModal from "../../videos/MetadataEditChangeModal/MetadataEditChangeModal";
import MetadataMergeChangeModal from "../../videos/MetadataMergeChangeModal/MetadataMergeChangeModal";
import NameChangeModal from "../../shared/NameChangeModal/NameChangeModal";
import { useMetadataEditWorkflow } from "../../shared/hooks/useMetadataEditWorkflow";

interface NameChangePreviewProps {
    changeType: typeof TASK_MERGE | typeof TASK_EDIT
};

const NameChangePreview = ({ changeType }: NameChangePreviewProps) => {
    const { state, dispatch, pageDispatch } = useRename();

    // Use the metadata edit workflow hook
    const {
        isSpinner: isEditSpinner,
        isModalOpen: isEditModalOpen,
        currentName: editCurrentName,
        suggestedName: editSuggestedName,
        wasAdded: editWasAdded,
        isBulkEnabled: isEditBulkEnabled,
        handleMetadataEditChange,
        handleEditSubmit,
        handleBulkEdit: handleBulkEditWorkflow,
        handleClick: handleEditClick,
        handleModalClose: handleEditModalClose,
        resetState: resetEditState,
    } = useMetadataEditWorkflow({
        getBulkEditItems: () =>
            state.nameChanges.changes.map((change) => ({
                filename: change.input,
                outputFilename: change.output,
            })),
        includeRename: true, // Update metadata AND rename files
    });

    // Merge-specific state (not covered by the hook)
    const [isMergeSpinner, setIsMergeSpinner] = useState(false);
    const [metadataMergeChanges, setMetadataMergeChanges] = useState<MetadataMergeChanges>({ changes: [] });
    const [mergeBulkTemplate, setMergeBulkTemplate] = useState<MetadataMergeChange | null>(null);
    const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);
    const [mergeCurrentName, setMergeCurrentName] = useState("");
    const [mergeWasAdded, setMergeWasAdded] = useState<string[]>([]);

    const deleteFile = useDeleteFile();

    // Determine which state to use based on changeType
    const isSpinner = changeType === TASK_EDIT ? isEditSpinner : isMergeSpinner;
    const wasAdded = changeType === TASK_EDIT ? editWasAdded : mergeWasAdded;

    useEffect(() => {
        resetEditState();
        setMetadataMergeChanges({ changes: [] });
        setMergeBulkTemplate(null);
        setMergeWasAdded([]);
    }, [state, changeType, resetEditState]);

    /**
     * Handles adding or updating a metadata merge change for a specific file
     * Replaces existing merge change if one exists for the same file
     */
    const handleMetadataMergeChange = (newChange: MetadataMergeChange | undefined) => {
        if (!newChange) {
            return;
        }

        if (metadataMergeChanges.changes.length === 0) {
            setMergeBulkTemplate(newChange);
        }

        if (!mergeWasAdded.includes(newChange.filename)) {
            setMergeWasAdded((prev) => [...prev, newChange.filename]);
        }

        const existingChangeIndex = metadataMergeChanges.changes.findIndex(
            change => change.filename === newChange.filename
        );

        const filteredChanges = existingChangeIndex !== -1
            ? metadataMergeChanges.changes.filter((_, idx) => idx !== existingChangeIndex)
            : metadataMergeChanges.changes;

        const newChanges = {
            changes: [...filteredChanges, newChange]
        };
        setMetadataMergeChanges(newChanges);
    };

    /**
     * Submits merge changes to the API and removes merged files from the list
     * @param changesToSubmit - Optional merge changes to submit, defaults to state
     */
    const handleMergeSubmit = async (changesToSubmit?: MetadataMergeChanges) => {
        pageDispatch({ type: "CLEAR_ERROR" });
        if (!mediaLink || !ffmpegLink) {
            pageDispatch({ type: "SET_ERROR", payload: no_api_error });
            return;
        }
        setIsMergeSpinner(true);

        // Use provided changes or fall back to state
        const mergeChanges = changesToSubmit || metadataMergeChanges;

        await postMetadataMerge(mergeChanges);

        for (const change of mergeChanges.changes) {
            await deleteFile(change.filename);
        };
        const updatedChanges = state.nameChanges.changes.filter(change => {
            return !mergeChanges.changes.find(mergeChange => mergeChange.filename === removePathFromFilePath(change.input));
        });
        const updatedNameChanges = { changes: updatedChanges };
        dispatch({ type: "SET_NAME_CHANGES", payload: updatedNameChanges });
        setIsMergeSpinner(false);
    };


    /**
     * Applies the bulk merge template to all files and submits the changes
     * Uses the first merge as a template for audio/subtitle tracks
     */
    const handleBulkMerge = async () => {
        if (!mergeBulkTemplate) {
            return;
        }

        const template = mergeBulkTemplate;
        const newMergeChanges: MetadataMergeChange[] = [...metadataMergeChanges.changes];

        state.nameChanges.changes.forEach((change) => {
            const filename = removePathFromFilePath(change.input);
            const existingChange = newMergeChanges.find(c => c.filename === filename);

            if (!existingChange) {
                newMergeChanges.push({
                    filename: filename,
                    output_filename: `temp-${filename}`,
                    audio_tracks: template.audio_tracks,
                    subtitle_tracks: template.subtitle_tracks
                });
            }
        });

        const newMetadataMergeChanges = { changes: newMergeChanges };

        setMetadataMergeChanges(newMetadataMergeChanges);

        await handleMergeSubmit(newMetadataMergeChanges);
    };

    const handleBulk = () => {
        if (changeType === TASK_EDIT) {
            handleBulkEditWorkflow();
        } else {
            handleBulkMerge();
        }
    }

    /**
     * Wrapper for handleClick that routes to edit or merge modal based on changeType
     */
    const handleClick = (current: string, suggestion: string) => {
        if (changeType === TASK_EDIT) {
            handleEditClick(current, suggestion);
        } else {
            setMergeCurrentName(current);
            setIsMergeModalOpen(true);
        }
    };

    /**
     * Determines if bulk button should be enabled based on changeType
     */
    const isBulkEnabled = useMemo(() => {
        if (changeType === TASK_EDIT) {
            return isEditBulkEnabled;
        } else {
            return metadataMergeChanges.changes?.length === 1;
        }
    }, [changeType, isEditBulkEnabled, metadataMergeChanges]);

    const footerButtons = () => {
        const onClickHandler = () => changeType === TASK_MERGE ? handleMergeSubmit() : handleEditSubmit();
        const buttonLabel = changeType === TASK_MERGE ? "Submit Merges!" : "Submit Edits!";
        const bulkLabel = changeType === TASK_MERGE ? "Submit Bulk Merges!" : "Submit Bulk Edits!";
        return (
            <>
                <SubmitButton
                    label={bulkLabel}
                    onClick={handleBulk}
                    disabled={!isBulkEnabled}
                />
                <SubmitButton
                    onClick={onClickHandler}
                    label={buttonLabel}
                    buttonStyle="w-1/4"
                    disabled={isBulkEnabled}
                />
            </>
        )
    }

    const isNameChanges = state.nameChanges.changes.length > 0;

    return (
        <FormContainer
            formTitle="Onboard Files"
            containerStyle="flex flex-col gap-2"
        >
            {
                isNameChanges && (
                    <>
                        <NameChangeTable
                            nameChanges={state.nameChanges}
                            wasAdded={wasAdded}
                            onClick={handleClick}
                            changeType={changeType}
                        />
                        <footer className="flex gap-4 w-full justify-end mt-2">
                            {
                                isSpinner ?
                                    <Spinner />
                                    : footerButtons()
                            }
                        </footer>

                        {/* Modal - show based on changeType */}
                        {changeType === TASK_EDIT ? (
                            state.mediaType === VIDEOS ? (
                                <MetadataEditChangeModal
                                    isOpen={isEditModalOpen}
                                    onClose={handleEditModalClose}
                                    currentName={editCurrentName}
                                    suggestedName={editSuggestedName}
                                    onEdit={handleMetadataEditChange}
                                />
                            ) : (
                                <NameChangeModal
                                    isOpen={isEditModalOpen}
                                    onClose={handleEditModalClose}
                                    initialName={editSuggestedName}
                                />
                            )
                        ) : (
                            <MetadataMergeChangeModal
                                isOpen={isMergeModalOpen}
                                onClose={() => setIsMergeModalOpen(false)}
                                currentName={mergeCurrentName}
                                onMerge={handleMetadataMergeChange}
                            />
                        )}
                    </>
                )
            }
            {
                !isNameChanges && (
                    <div className="flex justify-center">
                        <p className="text-lg text-gray-500">
                            No files to rename.
                        </p>
                    </div>
                )
            }
        </FormContainer>
    );
};

export default NameChangePreview;
