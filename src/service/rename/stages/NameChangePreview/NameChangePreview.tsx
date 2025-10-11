import FormContainer from "../../../../lib/components/FormContainer";
import { NameChangeTable } from "../../shared";
import { NameChangeApiRequest, postJson, processNameChangeToApiRequest } from "../../../../lib/api/api";
import SubmitButton from "../../../../lib/components/SubmitButton";
import { mediaLink, no_api_error, VIDEOS, ffmpegLink } from "../../../../lib/constants";
import { useRename } from "../../../../lib/hooks/usePageContext";
import { useState } from "react";
import Spinner from "../../../../lib/components/Spinner";
import { MetadataChanges, MetadataChange } from "../../../../lib/types";
import { postMetadataWrite } from "../../../../lib/api/metadata";


const NameChangePreview = () => {
    const { state, dispatch, pageDispatch } = useRename();
    const [isSpinner, setIsSpinner] = useState(false);
    const [metadataChanges, setMetadataChanges] = useState<MetadataChanges>();

    const handleMetadataChange = (filename: string, newChange: MetadataChange | undefined) => {
        if (newChange !== undefined) {
            setMetadataChanges((prevChanges) => ({
                ...prevChanges,
                [filename]: newChange
            }));
        }
    };

    const postRenameChangeRequest = async (nameChangeRequest: NameChangeApiRequest) => {
        return await postJson(
            `${mediaLink}/rename/process`,
            nameChangeRequest,
        );
    }

    const postMetadataRenameChangeRequest = async (nameChangeRequest: NameChangeApiRequest, metadataChanges: MetadataChanges) => {
        await postMetadataWrite(metadataChanges);
        await postRenameChangeRequest(nameChangeRequest);
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
            metadataChanges ?
                postMetadataRenameChangeRequest(nameChangeRequest, metadataChanges) :
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
                            onEdit={state.mediaType === VIDEOS ? handleMetadataChange : () => { }}
                        />
                        <div className="flex gap-4 w-full justify-end mt-2">
                            {
                                isSpinner ? (
                                    <Spinner />
                                ) : (
                                    <SubmitButton
                                        onClick={handleSubmit}
                                        label="Submit!"
                                        buttonStyle="w-fit"
                                    />
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
