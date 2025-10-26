import { useState, useCallback } from "react";

/**
 * Hook for managing modal state
 * Handles opening/closing modals and tracking current/suggested names
 *
 * @returns Object containing modal state and handlers
 */
export const useModalState = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentName, setCurrentName] = useState("");
    const [suggestedName, setSuggestedName] = useState("");

    /**
     * Handler for opening modal with file names
     *
     * @param current - Current filename
     * @param suggestion - Suggested filename
     */
    const handleClick = useCallback((current: string, suggestion: string) => {
        setCurrentName(current);
        setSuggestedName(suggestion);
        setIsModalOpen(true);
    }, []);

    /**
     * Modal close handler
     * Resets modal state when closing
     */
    const handleModalClose = useCallback(() => {
        setIsModalOpen(false);
        setCurrentName("");
        setSuggestedName("");
    }, []);

    return {
        isModalOpen,
        currentName,
        suggestedName,
        handleClick,
        handleModalClose,
    };
};
