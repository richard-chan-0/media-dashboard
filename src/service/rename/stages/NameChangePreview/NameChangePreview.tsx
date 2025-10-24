import FormContainer from "../../../../lib/components/FormContainer";
import { NameChangeTable } from "../../shared";
import SubmitButton from "../../../../lib/components/SubmitButton";
import { mediaLink, no_api_error, VIDEOS, ffmpegLink, TASK_MERGE, TASK_EDIT } from "../../../../lib/constants";
import { useRename } from "../../../../lib/hooks/usePageContext";
import { useEffect, useState } from "react";
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

    const handleMetadataEditChange = (filename: string, newChange: MetadataEditChange | undefined) => {
        if (newChange === undefined) {
            return;
        }

        if (Object.keys(metadataEditChanges).length == 0) {
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

    const handleMetadataMergeChange = async (newChange: MetadataMergeChange | undefined) => {
        if (!newChange) {
            return;
        }

        if (metadataMergeChanges.changes.length == 0) {
            setBulkTemplate(newChange);
        }

        if (!wasAdded.includes(newChange.filename)) {
            setWasAdded((prev) => [...prev, newChange.filename]);
        }

        const existingChange = metadataMergeChanges.changes.findIndex(change => change.filename === newChange.filename);
        if (existingChange !== -1) {
            metadataMergeChanges.changes.splice(existingChange, 1);
        }
        const newChanges = {
            changes: [...metadataMergeChanges.changes, newChange]
        }
        setMetadataMergeChanges(newChanges);
    };

    const handleMergeSubmit = async () => {
        pageDispatch({ type: "CLEAR_ERROR" });
        if (!mediaLink || !ffmpegLink) {
            pageDispatch({ type: "SET_ERROR", payload: no_api_error });
            return;
        }
        setIsSpinner(true);
        await postMetadataMerge(metadataMergeChanges);

        for (const change of metadataMergeChanges.changes) {
            await deleteFile(change.filename);
        };
        const updatedChanges = state.nameChanges.changes.filter(change => {
            return !metadataMergeChanges.changes.find(mergeChange => mergeChange.filename === removePathFromFilePath(change.input));
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

    const handleEditSubmit = async () => {
        pageDispatch({ type: "CLEAR_ERROR" });
        if (!mediaLink || !ffmpegLink) {
            pageDispatch({ type: "SET_ERROR", payload: no_api_error });
            return;
        }
        setIsSpinner(true);
        const response = await postEditSubmit(metadataEditChanges, state);
        if (response?.error) {
            pageDispatch({ type: "SET_ERROR", payload: response.error });
        } else {
            dispatch({ type: "CLEAR_NAME_CHANGES" });
        }
        setIsSpinner(false);
    };

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

        // Wait for state to update, then submit
        await new Promise(resolve => setTimeout(resolve, 0));
        await handleEditSubmit();
    };

    const handleBulkMerge = async () => {
        if (!bulkTemplate || !('audio_tracks' in bulkTemplate)) {
            return;
        }

        const template = bulkTemplate as MetadataMergeChange;
        const newMergeChanges: MetadataMergeChange[] = [...metadataMergeChanges.changes];

        // Apply template to all files that haven't been merged yet
        state.nameChanges.changes.forEach((change) => {
            const filename = removePathFromFilePath(change.input);
            const existingChange = newMergeChanges.find(c => c.filename === filename);

            if (!existingChange) {
                newMergeChanges.push({
                    filename: filename,
                    output_filename: `merge-${filename}`,
                    audio_tracks: template.audio_tracks,
                    subtitle_tracks: template.subtitle_tracks
                });
            }
        });

        setMetadataMergeChanges({ changes: newMergeChanges });

        // Wait for state to update, then submit
        await new Promise(resolve => setTimeout(resolve, 0));
        await handleMergeSubmit();
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

    const footerButtons = () => {
        const onClickHandler = changeType == TASK_MERGE ? handleMergeSubmit : handleEditSubmit;
        const buttonLabel = changeType == TASK_MERGE ? "Submit Merges!" : "Sumbit Edits!";
        const bulkLabel = changeType == TASK_MERGE ? "Submit Bulk Merges!" : "Submit Bulk Edits!";
        const isBulkEnabled = (metadataEditChanges && Object.keys(metadataEditChanges).length == 1) || (metadataMergeChanges.changes && metadataMergeChanges.changes.length == 1)
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
