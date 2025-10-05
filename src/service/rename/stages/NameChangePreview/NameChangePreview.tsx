import FormContainer from "../../../../lib/components/FormContainer";
import { NameChangeTable } from "../../shared";
import { NameChangeApiRequest, postJson, processNameChangeToApiRequest } from "../../../../lib/api/api";
import SubmitButton from "../../../../lib/components/SubmitButton";
import StageNavButtons from "../StageNavButtons";
import { COMICS, mediaLink, no_api_error, VIDEOS, ffmpegLink } from "../../../../lib/constants";
import { useRename } from "../../../../lib/hooks/usePageContext";
import { useState } from "react";
import Spinner from "../../../../lib/components/Spinner";
import { MetadataChanges, MetadataChange } from "../../../../lib/types";
import { removePathFromFilePath } from "../../../../lib/utilities";
import { useDeleteFile } from "../../../../lib/hooks/useDeleteFile";
import { postMetadataMerge, postMetadataWrite } from "../../../../lib/api/Metadata";

interface NameChangePreviewProps {
    stageDispatcher: React.ActionDispatch<[action: string]>;
};



const NameChangePreview = ({ stageDispatcher }: NameChangePreviewProps) => {
    const { state, dispatch, pageDispatch } = useRename();
    const [isSpinner, setIsSpinner] = useState(false);
    const [metadataChanges, setMetadataChanges] = useState<MetadataChanges>();
    const [isMetadataChange, setIsMetadataChange] = useState(false);
    const [isMetadataMerge, setIsMetadataMerge] = useState(false);
    const deleteFile = useDeleteFile();

    const handleMetadataChange = (filename: string, newChange: MetadataChange, isChange: boolean) => {
        setMetadataChanges((prevChanges) => ({
            ...prevChanges,
            [filename]: newChange
        }));
        setIsMetadataChange(isMetadataChange || isChange);
    };

    const postRenameChangeRequest = async (nameChangeRequest: NameChangeApiRequest) => {
        return await postJson(
            `${mediaLink}/rename/process`,
            nameChangeRequest,
        );
    }

    const handleMetadataMerge = async (metadataChangeRequest: MetadataChanges) => {
        const mergeRequest = await postMetadataMerge(metadataChangeRequest);
        Object.keys(mergeRequest).forEach(async (filename) => {
            await deleteFile(removePathFromFilePath(filename));
        });
    }


    const postMetadataRenameChangeRequest = async (nameChangeRequest: NameChangeApiRequest, metadataChanges: MetadataChanges) => {
        await postMetadataWrite(metadataChanges);
        if (isMetadataMerge) {
            await handleMetadataMerge(metadataChanges);
        } else {
            await postRenameChangeRequest(nameChangeRequest);
        }
    }

    const handleSubmit = async () => {
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
            isMetadataChange && metadataChanges ?
                postMetadataRenameChangeRequest(nameChangeRequest, metadataChanges) :
                postRenameChangeRequest(nameChangeRequest)
        );
        if (response?.error) {
            pageDispatch({ type: "SET_ERROR", payload: response.error });
        } else {
            dispatch({ type: "CLEAR_NAME_CHANGES" });
            stageDispatcher("reset");
        }
        setIsSpinner(false);
    };

    const isNameChanges = state.nameChanges.changes.length > 0;
    const navProps = state.mediaType == COMICS ? {
        leftLabel: "Back",
        isLeftEnabled: true,
        leftButtonAction: () => stageDispatcher("prev"),
    } : {
        leftLabel: "Back",
        rightLabel: isNameChanges ? "Skip" : "Next",
        isLeftEnabled: true,
        leftButtonAction: () => stageDispatcher("prev"),
    }

    return (
        <FormContainer
            formTitle="Rename Files"
            containerStyle="flex flex-col gap-2"
            size={5}
        >
            <StageNavButtons
                {...navProps}
            />
            {
                isNameChanges && (
                    <>
                        <NameChangeTable
                            nameChanges={state.nameChanges}
                            mediaType={state.mediaType}
                            onEdit={state.mediaType === VIDEOS ? handleMetadataChange : () => { }}
                        />
                        <div className="flex justify-between gap-4 w-full">
                            {
                                isSpinner ? (
                                    <Spinner />
                                ) : (
                                    <>
                                        <SubmitButton
                                            label={`Merge`}
                                            onClick={() => setIsMetadataMerge(prev => !prev)}
                                            buttonStyle={`w-1/8  ${isMetadataMerge ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
                                        />
                                        <SubmitButton
                                            onClick={handleSubmit}
                                            label="Submit!"
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
