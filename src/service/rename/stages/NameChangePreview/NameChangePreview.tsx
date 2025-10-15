import FormContainer from "../../../../lib/components/FormContainer";
import { NameChangeTable } from "../../shared";
import SubmitButton from "../../../../lib/components/SubmitButton";
import { mediaLink, no_api_error, VIDEOS, ffmpegLink } from "../../../../lib/constants";
import { useRename } from "../../../../lib/hooks/usePageContext";
import { useState } from "react";
import Spinner from "../../../../lib/components/Spinner";
import { MetadataEditChanges, MetadataEditChange, MetadataMergeChange, MetadataMergeChanges, RenameState } from "../../../../lib/types";
import { postMetadataMerge } from "../../../../lib/api/metadata";
import { useDeleteFile } from "../../../../lib/hooks/useDeleteFile";
import { createNameChangeApiRequest } from "../../../../lib/api/factory";
import { postRenameChangeRequest } from "../../../../lib/api/rename";
import { postMetadataWrite } from "../../../../lib/api/metadata";


const NameChangePreview = () => {
    const { state, dispatch, pageDispatch } = useRename();
    const [isSpinner, setIsSpinner] = useState(false);
    const [metadataEditChanges, setMetadataEditChanges] = useState<MetadataEditChanges>({});
    const [metadataMergeChanges, setMetadataMergeChanges] = useState<MetadataMergeChanges>({ changes: [] });

    const deleteFile = useDeleteFile();
    const handleMetadataEditChange = (filename: string, newChange: MetadataEditChange | undefined) => {
        if (newChange === undefined) {
            return;
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
        setMetadataMergeChanges((prevChanges) => ({
            changes: prevChanges ? [...prevChanges.changes, newChange] : [newChange]
        }));
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

    const isNameChanges = state.nameChanges.changes.length > 0;

    return (
        <FormContainer
            formTitle="Rename Files"
            containerStyle="flex flex-col gap-2"
        >
            {
                isNameChanges && (
                    <>
                        <NameChangeTable
                            nameChanges={state.nameChanges}
                            mediaType={state.mediaType}
                            onEdit={state.mediaType === VIDEOS ? handleMetadataEditChange : () => { }}
                            onMerge={state.mediaType === VIDEOS ? handleMetadataMergeChange : () => { }}
                        />
                        <div className="flex gap-4 w-full justify-end mt-2">
                            {
                                isSpinner ? (
                                    <Spinner />
                                ) : (
                                    <>
                                        <SubmitButton
                                            onClick={handleMergeSubmit}
                                            label="Submit Merges!"
                                            buttonStyle="w-fit"
                                        />
                                        <SubmitButton
                                            onClick={handleEditSubmit}
                                            label="Submit Edits!"
                                            buttonStyle="w-fit"
                                        />
                                    </>

                                )
                            }
                        </div>
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
