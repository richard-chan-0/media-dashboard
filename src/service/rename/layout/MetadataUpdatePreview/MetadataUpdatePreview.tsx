import FormContainer from "../../../../lib/components/FormContainer";
import SubmitButton from "../../../../lib/components/SubmitButton";
import { VIDEOS } from "../../../../lib/constants";
import { useRename } from "../../../../lib/hooks/usePageContext";
import { useEffect } from "react";
import Spinner from "../../../../lib/components/Spinner";
import MetadataEditChangeModal from "../../videos/MetadataEditChangeModal/MetadataEditChangeModal";
import MetadataFileTable from "./MetadataFileTable";
import { useMetadataEditWorkflow } from "../../shared/hooks/useMetadataEditWorkflow";

const MetadataUpdatePreview = () => {
    const { state, pageState } = useRename();

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
            pageState.previewFiles.map((filename) => ({
                filename,
                outputFilename: filename,
            }))
    });

    useEffect(() => {
        resetState();
    }, [pageState.previewFiles, resetState]);

    // Wrapper to handle single parameter for this component
    const handleClick = (filename: string) => {
        baseHandleClick(filename, filename);
    };

    const footerButtons = () => {
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
                            files={pageState.previewFiles}
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

                        {/* Modal */}
                        {state.mediaType === VIDEOS && (
                            <MetadataEditChangeModal
                                isOpen={isModalOpen}
                                onClose={handleModalClose}
                                currentName={currentName}
                                suggestedName={suggestedName}
                                onEdit={handleMetadataEditChange}
                            />
                        )}
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
        </FormContainer>
    );
};

export default MetadataUpdatePreview;
