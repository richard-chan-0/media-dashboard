import FormContainer from "../../../../lib/components/FormContainer";
import { NameChangeTable } from "../../shared";
import SubmitButton from "../../../../lib/components/SubmitButton";
import { mediaLink, no_api_error, VIDEOS, ffmpegLink, TASK_MERGE, TASK_EDIT } from "../../../../lib/constants";
import { useRename } from "../../../../lib/hooks/usePageContext";
import { useEffect, useState, useMemo } from "react";
import Spinner from "../../../../lib/components/Spinner";
import { MetadataEditChanges, MetadataEditChange, MetadataMergeChange, MetadataMergeChanges, RenameState } from "../../../../lib/types";
import { postMetadataMerge } from "../../../../lib/api/metadata";
import { useDeleteFile } from "../../../../lib/hooks/useDeleteFile";
import { createNameChangeApiRequest } from "../../../../lib/api/factory";
import { postRenameChangeRequest } from "../../../../lib/api/rename";
import { postMetadataWrite } from "../../../../lib/api/metadata";
import { removePathFromFilePath } from "../../../../lib/utilities";
import MetadataEditChangeModal from "../../videos/MetadataEditChangeModal/MetadataEditChangeModal";
import MetadataMergeChangeModal from "../../videos/MetadataMergeChangeModal/MetadataMergeChangeModal";
import NameChangeModal from "../../shared/NameChangeModal/NameChangeModal";

interface NameChangePreviewProps {
    changeType: typeof TASK_MERGE | typeof TASK_EDIT
};

const NameChangePreview = ({ changeType }: NameChangePreviewProps) => {
    const { state, dispatch, pageDispatch } = useRename();
    const [isSpinner, setIsSpinner] = useState(false);
    const [metadataEditChanges, setMetadataEditChanges] = useState<MetadataEditChanges>({});
    const [metadataMergeChanges, setMetadataMergeChanges] = useState<MetadataMergeChanges>({ changes: [] });
    const [bulkTemplate, setBulkTemplate] = useState<MetadataEditChange | MetadataMergeChange | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentName, setCurrentName] = useState("");
    const [suggestedName, setSuggestedName] = useState("");

    const [wasAdded, setWasAdded] = useState<string[]>([]);

    const deleteFile = useDeleteFile();

    useEffect(() => {
        setMetadataEditChanges({});
        setMetadataMergeChanges({ changes: [] });
        setBulkTemplate(null);
        setWasAdded([]);
    }, [state, changeType]);

    /**
     * Handles adding or updating a metadata edit change for a specific file
     * Sets the first change as the bulk template
     */
    const handleMetadataEditChange = (filename: string, newChange: MetadataEditChange | undefined) => {
        if (newChange === undefined) {
            return;
        }

        if (Object.keys(metadataEditChanges).length === 0) {
            setBulkTemplate(newChange);
        }

        if (!wasAdded.includes(filename)) {
            setWasAdded((prev) => [...prev, filename]);
        }

        setMetadataEditChanges((prevChanges) => ({
            ...prevChanges,
            [filename]: newChange
        }));
    };

    /**
     * Handles adding or updating a metadata merge change for a specific file
     * Replaces existing merge change if one exists for the same file
     */
    const handleMetadataMergeChange = (newChange: MetadataMergeChange | undefined) => {
        if (!newChange) {
            return;
        }

        if (metadataMergeChanges.changes.length === 0) {
            setBulkTemplate(newChange);
        }

        if (!wasAdded.includes(newChange.filename)) {
            setWasAdded((prev) => [...prev, newChange.filename]);
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
        setIsSpinner(true);

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
        setIsSpinner(false);
    };

    const postEditSubmit = async (
        metadataEditChanges: MetadataEditChanges,
        state: RenameState,
    ) => {
        const nameChangeRequest = createNameChangeApiRequest(state.nameChanges);
        if (metadataEditChanges) {
            await postMetadataWrite(metadataEditChanges);
        }

        return await postRenameChangeRequest(nameChangeRequest);
    };

    /**
     * Submits edit changes to the API and processes file renaming
     * @param changesToSubmit - Optional edit changes to submit, defaults to state
     */
    const handleEditSubmit = async (changesToSubmit?: MetadataEditChanges) => {
        pageDispatch({ type: "CLEAR_ERROR" });
        if (!mediaLink || !ffmpegLink) {
            pageDispatch({ type: "SET_ERROR", payload: no_api_error });
            return;
        }
        setIsSpinner(true);

        const editChanges = changesToSubmit || metadataEditChanges;

        const response = await postEditSubmit(editChanges, state);
        if (response?.error) {
            pageDispatch({ type: "SET_ERROR", payload: response.error });
        } else {
            dispatch({ type: "CLEAR_NAME_CHANGES" });
        }
        setIsSpinner(false);
    };

    /**
     * Applies the bulk edit template to all files and submits the changes
     * Uses the first edit as a template for metadata fields
     */
    const handleBulkEdit = async () => {
        if (!bulkTemplate || !('newFilename' in bulkTemplate)) {
            return;
        }

        const template = bulkTemplate as MetadataEditChange;
        const newMetadataEditChanges: MetadataEditChanges = { ...metadataEditChanges };

        state.nameChanges.changes.forEach((change) => {
            const filename = change.input;
            if (!newMetadataEditChanges[filename]) {
                newMetadataEditChanges[filename] = {
                    newFilename: change.output,
                    title: "",
                    defaultSubtitle: template.defaultSubtitle,
                    defaultAudio: template.defaultAudio
                };
            }
        });

        setMetadataEditChanges(newMetadataEditChanges);

        await handleEditSubmit(newMetadataEditChanges);
    };

    /**
     * Applies the bulk merge template to all files and submits the changes
     * Uses the first merge as a template for audio/subtitle tracks
     */
    const handleBulkMerge = async () => {
        if (!bulkTemplate || !('audio_tracks' in bulkTemplate)) {
            return;
        }

        const template = bulkTemplate as MetadataMergeChange;
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
            handleBulkEdit();
        } else {
            handleBulkMerge();
        }
    }

    // Handler for opening modal from table (works for both edit and merge)
    const handleClick = (current: string, suggestion: string) => {
        setCurrentName(current);
        setSuggestedName(suggestion);
        setIsModalOpen(true);
    };

    // Modal close handler
    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const isBulkEnabled = useMemo(() => {
        const hasOneEdit = metadataEditChanges && Object.keys(metadataEditChanges).length === 1;
        const hasOneMerge = metadataMergeChanges.changes?.length === 1;
        return hasOneEdit || hasOneMerge;
    }, [metadataEditChanges, metadataMergeChanges]);

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
                                    isOpen={isModalOpen}
                                    onClose={handleModalClose}
                                    currentName={currentName}
                                    suggestedName={suggestedName}
                                    onEdit={handleMetadataEditChange}
                                />
                            ) : (
                                <NameChangeModal
                                    isOpen={isModalOpen}
                                    onClose={handleModalClose}
                                    initialName={suggestedName}
                                />
                            )
                        ) : (
                            <MetadataMergeChangeModal
                                isOpen={isModalOpen}
                                onClose={handleModalClose}
                                currentName={currentName}
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
