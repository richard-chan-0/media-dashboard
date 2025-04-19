import FormContainer from "../forms/FormContainer";
import NameChangeTable from "../lib/components/NameChangeTable";
import { NameChanges } from "../lib/types";
import { postJson, processNameChangeToApiRequest } from "../lib/api";
import SubmitButton from "../lib/components/SubmitButton";
import StageNavButtons from "./stageNavButtons";
import { mediaLink, no_api_error } from "../lib/constants";


type NameChangePreviewProps = {
    nameChanges: NameChanges;
    setNameChanges: React.Dispatch<React.SetStateAction<NameChanges>>;
    stage: number,
    stageDispatcher: React.ActionDispatch<[action: string]>;
    setError: React.Dispatch<React.SetStateAction<string>>;
}

// TODO: remove stage from props
const NameChangePreview = ({
    nameChanges,
    setNameChanges,
    stage,
    stageDispatcher,
    setError
}: NameChangePreviewProps
) => {
    if (nameChanges?.changes.length === 0) {
        return <></>;
    }

    const handleSubmit = async () => {
        setError("");
        if (!mediaLink) {
            setError(no_api_error);
            return;
        }
        const nameChangeRequest = processNameChangeToApiRequest(nameChanges);
        const response = await postJson(`${mediaLink}/rename/process`, nameChangeRequest)
        if (response?.error) {
            setError(response.error)
        } else {
            setNameChanges({ changes: [] });
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
                stage={stage}
                stageDispatcher={stageDispatcher}
            />
            <NameChangeTable nameChanges={nameChanges} />
            <div className="flex justify-center">
                <SubmitButton
                    onClick={handleSubmit}
                    label="Rename!"
                    type="button"
                    buttonStyle="w-fit"
                />
            </div>

        </FormContainer>

    )
}

export default NameChangePreview;