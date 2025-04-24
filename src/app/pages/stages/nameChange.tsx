import FormContainer from "./forms/FormContainer";
import NameChangeTable from "../../lib/components/NameChangeTable";
import { postJson, processNameChangeToApiRequest } from "../../lib/api";
import SubmitButton from "../../lib/components/SubmitButton";
import StageNavButtons from "./stageNavButtons";
import { mediaLink, no_api_error } from "../../lib/constants";
import { useRename } from "../../pages/hooks/useRename";

type NameChangePreviewProps = {
    stageDispatcher: React.ActionDispatch<[action: string]>;
};

const NameChangePreview = ({ stageDispatcher }: NameChangePreviewProps) => {
    const { state, dispatch } = useRename();
    if (state.nameChanges?.changes.length === 0) {
        return <></>;
    }

    const handleSubmit = async () => {
        dispatch({ type: "CLEAR_ERROR" });
        if (!mediaLink) {
            dispatch({ type: "SET_ERROR", payload: no_api_error });
            return;
        }
        const nameChangeRequest = processNameChangeToApiRequest(
            state.nameChanges,
        );
        const response = await postJson(
            `${mediaLink}/rename/process`,
            nameChangeRequest,
        );
        if (response?.error) {
            dispatch({ type: "SET_ERROR", payload: response.error });
        } else {
            dispatch({ type: "CLEAR_NAME_CHANGES" });
            stageDispatcher("next");
        }
    };

    return (
        <FormContainer
            formTitle="Rename Files"
            containerStyle="flex flex-col gap-2"
            size={5}
        >
            <StageNavButtons
                leftLabel="Back"
                rightLabel="Skip"
                isLeftEnabled={true}
                isRightEnabled={true}
                stageDispatcher={stageDispatcher}
            />
            <NameChangeTable nameChanges={state.nameChanges} />
            <div className="flex justify-center">
                <SubmitButton
                    onClick={handleSubmit}
                    label="Rename!"
                    type="button"
                    buttonStyle="w-fit"
                />
            </div>
        </FormContainer>
    );
};

export default NameChangePreview;
