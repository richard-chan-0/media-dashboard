import FormContainer from "../../../../lib/components/FormContainer";
import { NameChangeTable } from "../../shared";
import { NameChangeApiRequest, postJson, processNameChangeToApiRequest } from "../../../../lib/api/api";
import SubmitButton from "../../../../lib/components/SubmitButton";
import { mediaLink, no_api_error, VIDEOS, ffmpegLink } from "../../../../lib/constants";
import { useRename } from "../../../../lib/hooks/usePageContext";
import { useState } from "react";
import Spinner from "../../../../lib/components/Spinner";
import { MetadataEditChanges, MetadataEditChange, MetadataMergeChange, MetadataMergeChanges } from "../../../../lib/types";
import { postMetadataWrite } from "../../../../lib/api/metadata";
import { useDeleteFile } from "../../../../lib/hooks/useDeleteFile";


const NameChangePreview = () => {
    const { state, dispatch, pageDispatch } = useRename();
    const [isSpinner, setIsSpinner] = useState(false);
    const [metadataEditChanges, setMetadataEditChanges] = useState<MetadataEditChanges>();
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

    const postRenameChangeRequest = async (nameChangeRequest: NameChangeApiRequest) => {
        return await postJson(
            `${mediaLink}/rename/process`,
            nameChangeRequest,
        );
    }

    const postMetadataRenameChangeRequest = async (nameChangeRequest: NameChangeApiRequest, metadataChanges: MetadataEditChanges) => {
        await postMetadataWrite(metadataChanges);
        await postRenameChangeRequest(nameChangeRequest);
    }

    const postMetadataMergeChangeRequest = async (mergeChanges: MetadataMergeChanges) => {
        console.log("Posting metadata merge change request with:", mergeChanges);
        await postJson(
            `${ffmpegLink}/mkv/merge`,
            mergeChanges,
        );
        for (const change of mergeChanges.changes) {
            await deleteFile(change.filename);
        };
    }

    const handleMergeSubmit = async () => {
        pageDispatch({ type: "CLEAR_ERROR" });
        if (!mediaLink || !ffmpegLink) {
            pageDispatch({ type: "SET_ERROR", payload: no_api_error });
            return;
        }
        setIsSpinner(true);
        const response = await postMetadataMergeChangeRequest(metadataMergeChanges);
        if (response?.error) {
            pageDispatch({ type: "SET_ERROR", payload: response.error });
        } else {
            // dispatch({ type: "CLEAR_NAME_CHANGES" });
            console.log("Merge successful:", response);
        }
        setIsSpinner(false);
    };

    const handleEditSubmit = async () => {
        pageDispatch({ type: "CLEAR_ERROR" });
        if (!mediaLink || !ffmpegLink) {
            pageDispatch({ type: "SET_ERROR", payload: no_api_error });
            return;
        }
        const nameChangeRequest = processNameChangeToApiRequest(
            state.nameChanges,
        );
        setIsSpinner(true);
        const response = await (
            metadataEditChanges ?
                postMetadataRenameChangeRequest(nameChangeRequest, metadataEditChanges) :
                postRenameChangeRequest(nameChangeRequest)
        );
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
