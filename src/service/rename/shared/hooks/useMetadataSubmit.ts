import { useState, useCallback } from "react";
import { useRename } from "../../../../lib/hooks/usePageContext";
import { mediaLink, no_api_error, ffmpegLink } from "../../../../lib/constants";
import { MetadataEditChanges, RenameState } from "../../../../lib/types";
import { createNameChangeApiRequest } from "../../../../lib/api/factory";
import { postRenameChangeRequest } from "../../../../lib/api/rename";
import { postMetadataWrite } from "../../../../lib/api/metadata";

type UseMetadataSubmitOptions = {
    /**
     * Current metadata edit changes
     */
    metadataEditChanges: MetadataEditChanges;

    /**
     * Whether to include rename operation after metadata write
     * - true: Calls postRenameChangeRequest after metadata write (NameChangePreview workflow)
     * - false: Only writes metadata without renaming (MetadataUpdatePreview workflow)
     * @default true
     */
    includeRename?: boolean;

    /**
     * Callback when edits are successfully submitted
     * Can be used to clear state or perform cleanup
     */
    onSubmitSuccess?: () => void;
};

/**
 * Hook for managing metadata submission
 * Handles API calls, loading state, and error handling for metadata writes
 *
 * @param options - Configuration options
 * @returns Object containing submission state and handlers
 */
export const useMetadataSubmit = (options: UseMetadataSubmitOptions) => {
    const { metadataEditChanges, includeRename = true, onSubmitSuccess } = options;
    const { state, dispatch, pageDispatch } = useRename();
    const [isSpinner, setIsSpinner] = useState(false);

    /**
     * Posts edit changes to the API
     * Optionally includes rename operation based on includeRename flag
     *
     * @param editChanges - Metadata changes to write
     * @param renameState - Current rename state (for name changes)
     */
    const postEditSubmit = useCallback(async (
        editChanges: MetadataEditChanges,
        renameState: RenameState,
    ) => {
        if (editChanges) {
            await postMetadataWrite(editChanges);
        }

        // Only perform rename if includeRename flag is true
        if (includeRename) {
            const nameChangeRequest = createNameChangeApiRequest(renameState.nameChanges);
            return await postRenameChangeRequest(nameChangeRequest);
        }
    }, [includeRename]);

    /**
     * Submits edit changes to the API and processes file renaming
     *
     * @param changesToSubmit - Optional edit changes to submit, defaults to current state
     */
    const handleEditSubmit = useCallback(async (changesToSubmit?: MetadataEditChanges) => {
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
    }, [metadataEditChanges, state, dispatch, pageDispatch, postEditSubmit, onSubmitSuccess]);

    return {
        isSpinner,
        handleEditSubmit,
    };
};
