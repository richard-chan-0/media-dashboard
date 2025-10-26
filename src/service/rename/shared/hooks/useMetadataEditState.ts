import { useState, useCallback } from "react";
import { MetadataEditChanges, MetadataEditChange } from "../../../../lib/types";

/**
 * Hook for managing metadata edit state
 * Handles the core state for tracking metadata changes and which files have been edited
 *
 * @returns Object containing metadata edit state and handlers
 */
export const useMetadataEditState = () => {
    const [metadataEditChanges, setMetadataEditChanges] = useState<MetadataEditChanges>({});
    const [wasAdded, setWasAdded] = useState<string[]>([]);

    /**
     * Resets metadata edit state to initial values
     */
    const resetState = useCallback(() => {
        setMetadataEditChanges({});
        setWasAdded([]);
    }, []);

    /**
     * Handles adding or updating a metadata edit change for a specific file
     * Tracks which files have been edited in the wasAdded array
     *
     * @param filename - The name of the file being edited
     * @param newChange - The metadata changes to apply
     */
    const handleMetadataEditChange = useCallback(
        (filename: string, newChange: MetadataEditChange | undefined) => {
            if (newChange === undefined) {
                return;
            }

            if (!wasAdded.includes(filename)) {
                setWasAdded((prev) => [...prev, filename]);
            }

            setMetadataEditChanges((prevChanges) => ({
                ...prevChanges,
                [filename]: newChange,
            }));
        },
        [wasAdded],
    );

    return {
        metadataEditChanges,
        setMetadataEditChanges,
        wasAdded,
        handleMetadataEditChange,
        resetState,
    };
};
