import { useState, useMemo, useCallback } from "react";
import { useRename } from "../../../../lib/hooks/usePageContext";
import { mediaLink, no_api_error, ffmpegLink } from "../../../../lib/constants";
import {
    MetadataEditChanges,
    MetadataEditChange,
    RenameState,
} from "../../../../lib/types";
import { createNameChangeApiRequest } from "../../../../lib/api/factory";
import { postRenameChangeRequest } from "../../../../lib/api/rename";
import { postMetadataWrite } from "../../../../lib/api/metadata";

type BulkEditItem = {
    filename: string;
    outputFilename: string;
};

type UseMetadataEditWorkflowOptions = {
    /**
     * Function to get the list of items to iterate over for bulk edits
     * Returns array of { filename, outputFilename } objects
     */
    getBulkEditItems: () => BulkEditItem[];

    /**
     * Callback when edits are successfully submitted
     * Can be used to clear state or perform cleanup
     */
    onSubmitSuccess?: () => void;

    /**
     * Whether to include rename operation after metadata write
     * - true: Calls postRenameChangeRequest after metadata write (NameChangePreview workflow)
     * - false: Only writes metadata without renaming (MetadataUpdatePreview workflow)
     * @default true
     */
    includeRename?: boolean;
};

/**
 * Custom hook that encapsulates the metadata edit workflow logic
 * Handles state management, submit logic, and bulk editing
 */
export const useMetadataEditWorkflow = (
    options: UseMetadataEditWorkflowOptions,
) => {
    const { state, dispatch, pageDispatch } = useRename();
    const { getBulkEditItems, onSubmitSuccess, includeRename = true } = options;

    // State management
    const [isSpinner, setIsSpinner] = useState(false);
    const [metadataEditChanges, setMetadataEditChanges] =
        useState<MetadataEditChanges>({});
    const [bulkTemplate, setBulkTemplate] = useState<MetadataEditChange | null>(
        null,
    );
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentName, setCurrentName] = useState("");
    const [suggestedName, setSuggestedName] = useState("");
    const [wasAdded, setWasAdded] = useState<string[]>([]);

    /**
     * Resets all state to initial values
     */
    const resetState = useCallback(() => {
        setMetadataEditChanges({});
        setBulkTemplate(null);
        setWasAdded([]);
    }, []);

    /**
     * Handles adding or updating a metadata edit change for a specific file
     * Sets the first change as the bulk template
     */
    const handleMetadataEditChange = useCallback(
        (filename: string, newChange: MetadataEditChange | undefined) => {
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
                [filename]: newChange,
            }));
        },
        [metadataEditChanges, wasAdded],
    );

    /**
     * Posts edit changes to the API
     * Optionally includes rename operation based on includeRename flag
     */
    const postEditSubmit = useCallback(
        async (
            metadataEditChanges: MetadataEditChanges,
            state: RenameState,
        ) => {
            if (metadataEditChanges) {
                await postMetadataWrite(metadataEditChanges);
            }

            if (includeRename) {
                const nameChangeRequest = createNameChangeApiRequest(
                    state.nameChanges,
                );
                return await postRenameChangeRequest(nameChangeRequest);
            }
        },
        [includeRename],
    );

    /**
     * Submits edit changes to the API and processes file renaming
     * @param changesToSubmit - Optional edit changes to submit, defaults to state
     */
    const handleEditSubmit = useCallback(
        async (changesToSubmit?: MetadataEditChanges) => {
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
                onSubmitSuccess?.();
            }
            setIsSpinner(false);
        },
        [
            metadataEditChanges,
            state,
            dispatch,
            pageDispatch,
            postEditSubmit,
            onSubmitSuccess,
        ],
    );

    /**
     * Applies the bulk edit template to all items and submits the changes
     * Uses the first edit as a template for metadata fields
     */
    const handleBulkEdit = useCallback(async () => {
        if (!bulkTemplate) {
            return;
        }

        const newMetadataEditChanges: MetadataEditChanges = {
            ...metadataEditChanges,
        };
        const items = getBulkEditItems();

        items.forEach((item) => {
            if (!newMetadataEditChanges[item.filename]) {
                newMetadataEditChanges[item.filename] = {
                    defaultSubtitle: bulkTemplate.defaultSubtitle,
                    defaultAudio: bulkTemplate.defaultAudio,
                };
            }
        });

        setMetadataEditChanges(newMetadataEditChanges);

        await handleEditSubmit(newMetadataEditChanges);
    }, [bulkTemplate, metadataEditChanges, getBulkEditItems, handleEditSubmit]);

    /**
     * Handler for opening modal from table
     */
    const handleClick = useCallback((current: string, suggestion: string) => {
        setCurrentName(current);
        setSuggestedName(suggestion);
        setIsModalOpen(true);
    }, []);

    /**
     * Modal close handler
     */
    const handleModalClose = useCallback(() => {
        setIsModalOpen(false);
        setCurrentName("");
        setSuggestedName("");
        resetState();
    }, []);

    /**
     * Determines if bulk edit button should be enabled
     * Enabled when exactly one file has been edited
     */
    const isBulkEnabled = useMemo(() => {
        return (
            metadataEditChanges && Object.keys(metadataEditChanges).length === 1
        );
    }, [metadataEditChanges]);

    return {
        // State
        isSpinner,
        metadataEditChanges,
        bulkTemplate,
        isModalOpen,
        currentName,
        suggestedName,
        wasAdded,

        // Computed
        isBulkEnabled,

        // Handlers
        handleMetadataEditChange,
        handleEditSubmit,
        handleBulkEdit,
        handleClick,
        handleModalClose,
        resetState,
    };
};
