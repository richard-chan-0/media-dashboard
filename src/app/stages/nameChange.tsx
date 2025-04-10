import FormContainer from "../forms/FormContainer";
import NameChangeTable from "../lib/components/NameChangeTable";
import { NameChanges } from "../lib/types";
import { postJson, processNameChangeToApiRequest } from "../lib/api";
import SubmitButton from "../lib/components/SubmitButton";
import StageButton from "../lib/components/StageButton";


type NameChangePreviewProps = {
    nameChanges: NameChanges;
    setNameChanges: React.Dispatch<React.SetStateAction<NameChanges>>;
    setRenameMessage: React.Dispatch<React.SetStateAction<string>>;
    setStage: React.Dispatch<React.SetStateAction<number>>;
}



const NameChangePreview = ({
    nameChanges,
    setNameChanges,
    setRenameMessage,
    setStage }: NameChangePreviewProps
) => {
    if (nameChanges?.changes.length === 0) {
        return <></>;
    }

    const handleSubmit = async () => {
        const apiLink = import.meta.env.VITE_MEDIA_UTILITY_API_LINK
        if (apiLink) {
            const nameChangeRequest = processNameChangeToApiRequest(nameChanges);
            const response = await postJson(`${apiLink}/rename/process`, nameChangeRequest)
            setRenameMessage(response?.error ? response.error : response);
        }
        setNameChanges({ changes: [] });
    };

    return (
        <FormContainer
            containerStyle="flex flex-col gap-2"
            size={5}
        >
            <div className="flex justify-between items-center mb-3">
                <StageButton
                    onClick={() => setStage(0)}
                    label="Back"
                    type="button"
                    direction="left"
                    buttonStyle="w-1/6 border border-gray-600 hover:bg-gray-600"
                />
                Name Changes Preview
                <StageButton
                    onClick={() => setStage(2)}
                    label="Skip"
                    type="button"
                    direction="right"
                    buttonStyle="w-1/6 border border-gray-600 hover:bg-gray-600"
                />
            </div>

            <NameChangeTable nameChanges={nameChanges} />
            <div className="flex justify-center">
                <SubmitButton
                    onClick={handleSubmit}
                    label="Rename Files"
                    type="button"
                    buttonStyle="w-fit"
                />
            </div>

        </FormContainer>

    )
}

export default NameChangePreview;