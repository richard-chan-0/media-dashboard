import FormContainer from "../../../../lib/components/FormContainer";
import NameChangeTable from "../../../../lib/components/NameChangeTable";
import { postJson, processNameChangeToApiRequest } from "../../../../lib/api";
import SubmitButton from "../../../../lib/components/SubmitButton";
import StageNavButtons from "../StageNavButtons";
import { COMICS, mediaLink, no_api_error, VIDEOS } from "../../../../lib/constants";
import { useRename } from "../../../hooks/usePageContext";
import { useState } from "react";
import Spinner from "../../../../lib/components/Spinner";
import MetadataChangeModal from "../../../../lib/components/MetadataChangeModal/MetadataChangeModal";
import { MetadataChanges, MetadataChange } from "../../../../lib/types";

type NameChangePreviewProps = {
    stageDispatcher: React.ActionDispatch<[action: string]>;
};

const NameChangePreview = ({ stageDispatcher }: NameChangePreviewProps) => {
    const { state, dispatch, pageDispatch } = useRename();
    const [isSpinner, setIsSpinner] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [metadataChanges, setMetadataChanges] = useState<MetadataChanges>();

    const handleMetadataChange = (filename: string, newChange: MetadataChange) => {
        setMetadataChanges((prevChanges) => ({
            ...prevChanges,
            [filename]: newChange
        }));
    };

    const handleSubmit = async () => {
        pageDispatch({ type: "CLEAR_ERROR" });
        if (!mediaLink) {
            pageDispatch({ type: "SET_ERROR", payload: no_api_error });
            return;
        }
        const nameChangeRequest = processNameChangeToApiRequest(
            state.nameChanges,
        );
        setIsSpinner(true);
        const response = await postJson(
            `${mediaLink}/rename/process`,
            nameChangeRequest,
        );
        if (response?.error) {
            pageDispatch({ type: "SET_ERROR", payload: response.error });
        } else {
            dispatch({ type: "CLEAR_NAME_CHANGES" });
            if (state.mediaType === VIDEOS) {
                stageDispatcher("next");
            } else {
                stageDispatcher("reset");
            }
        }
        setIsSpinner(false);
    };

    const handlePrototypeSubmit = () => {
        console.log("Metadata Changes:", metadataChanges);
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
                        <div className="flex justify-center gap-4">
                            {
                                isSpinner ? (
                                    <Spinner />
                                ) : (
                                    <>
                                        {state.mediaType === VIDEOS ? <SubmitButton
                                            onClick={handlePrototypeSubmit}
                                            label="Prototype Submit"
                                            type="button"
                                            buttonStyle="w-fit"
                                        /> : <SubmitButton
                                            onClick={handleSubmit}
                                            label="Rename!"
                                            type="button"
                                            buttonStyle="w-fit"
                                        />
                                        }
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
