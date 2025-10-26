import { useCallback } from "react";
import { MetadataEditChange } from "../../../../lib/types";
import { useMetadataEditState } from "./useMetadataEditState";
import { useModalState } from "./useModalState";
import { useBulkEdit } from "./useBulkEdit";
import { useMetadataSubmit } from "./useMetadataSubmit";

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
 *
 * This hook is composed of smaller, focused hooks:
 * - useMetadataEditState: Core state management
 * - useModalState: Modal open/close state
 * - useBulkEdit: Bulk editing logic
 * - useMetadataSubmit: API submission and loading state
 */
export const useMetadataEditWorkflow = (
    options: UseMetadataEditWorkflowOptions,
) => {
    const { getBulkEditItems, onSubmitSuccess, includeRename = true } = options;

    // Core metadata edit state
    const {
        metadataEditChanges,
        setMetadataEditChanges,
        wasAdded,
        handleMetadataEditChange: baseHandleMetadataEditChange,
        resetState: resetMetadataState,
    } = useMetadataEditState();

    // Modal state
    const {
        isModalOpen,
        currentName,
        suggestedName,
        handleClick,
        handleModalClose: baseHandleModalClose,
    } = useModalState();

    // Submission logic
    const { isSpinner, handleEditSubmit } = useMetadataSubmit({
        metadataEditChanges,
        includeRename,
        onSubmitSuccess,
    });

    // Bulk edit logic
    const {
        bulkTemplate,
        setFirstAsTemplate,
        resetBulkTemplate,
        isBulkEnabled,
        handleBulkEdit,
    } = useBulkEdit({
        getBulkEditItems,
        metadataEditChanges,
        setMetadataEditChanges,
        handleSubmit: handleEditSubmit,
    });

    /**
     * Enhanced handler that also sets the first change as bulk template
     */
    const handleMetadataEditChange = useCallback(
        (filename: string, newChange: MetadataEditChange | undefined) => {
            if (newChange === undefined) {
                return;
            }

            // Set as template if this is the first change
            setFirstAsTemplate(newChange);

            // Update the metadata edit state
            baseHandleMetadataEditChange(filename, newChange);
        },
        [baseHandleMetadataEditChange, setFirstAsTemplate],
    );

    /**
     * Enhanced modal close handler that also resets state
     */
    const handleModalClose = useCallback(() => {
        baseHandleModalClose();
        resetMetadataState();
    }, [baseHandleModalClose, resetMetadataState]);

    /**
     * Resets all state to initial values
     */
    const resetState = useCallback(() => {
        resetMetadataState();
        resetBulkTemplate();
    }, [resetMetadataState, resetBulkTemplate]);

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
