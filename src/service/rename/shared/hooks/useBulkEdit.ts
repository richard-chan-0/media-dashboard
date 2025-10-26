import { useState, useMemo, useCallback } from "react";
import { MetadataEditChanges, MetadataEditChange } from "../../../../lib/types";

type BulkEditItem = {
    filename: string;
    outputFilename: string;
};

type UseBulkEditOptions = {
    /**
     * Function to get the list of items to iterate over for bulk edits
     * Returns array of { filename, outputFilename } objects
     */
    getBulkEditItems: () => BulkEditItem[];

    /**
     * Current metadata edit changes
     */
    metadataEditChanges: MetadataEditChanges;

    /**
     * Function to update metadata edit changes
     */
    setMetadataEditChanges: (changes: MetadataEditChanges) => void;

    /**
     * Function to handle submit after bulk edit is applied
     */
    handleSubmit: (changesToSubmit?: MetadataEditChanges) => Promise<void>;
};

/**
 * Hook for managing bulk edit functionality
 * Handles bulk template creation and applying template to all items
 *
 * @param options - Configuration options
 * @returns Object containing bulk edit state and handlers
 */
export const useBulkEdit = (options: UseBulkEditOptions) => {
    const { getBulkEditItems, metadataEditChanges, setMetadataEditChanges, handleSubmit } = options;

    const [bulkTemplate, setBulkTemplate] = useState<MetadataEditChange | null>(null);

    /**
     * Sets the first metadata edit as the bulk template
     * Should be called when the first edit is added
     *
     * @param change - The metadata change to use as template
     */
    const setFirstAsTemplate = useCallback((change: MetadataEditChange) => {
        if (Object.keys(metadataEditChanges).length === 0) {
            setBulkTemplate(change);
        }
    }, [metadataEditChanges]);

    /**
     * Resets the bulk template
     */
    const resetBulkTemplate = useCallback(() => {
        setBulkTemplate(null);
    }, []);

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

        await handleSubmit(newMetadataEditChanges);
    }, [bulkTemplate, metadataEditChanges, getBulkEditItems, setMetadataEditChanges, handleSubmit]);

    /**
     * Determines if bulk edit button should be enabled
     * Enabled when exactly one file has been edited
     */
    const isBulkEnabled = useMemo(() => {
        return metadataEditChanges && Object.keys(metadataEditChanges).length === 1;
    }, [metadataEditChanges]);

    return {
        bulkTemplate,
        setBulkTemplate,
        setFirstAsTemplate,
        resetBulkTemplate,
        isBulkEnabled,
        handleBulkEdit,
    };
};
