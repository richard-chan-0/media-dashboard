import FormContainer from "../forms/FormContainer";
import NameChangeTable from "../lib/components/NameChangeTable";
import { NameChanges } from "../lib/types";
import { postJson, processNameChangeToApiRequest } from "../lib/api";
import SubmitButton from "../lib/components/SubmitButton";
import StageButton from "../lib/components/StageButton";


type NameChangePreviewProps = {
    mediaType: string;
    nameChanges: NameChanges;
    setNameChanges: React.Dispatch<React.SetStateAction<NameChanges>>;
    setRenameMessage: React.Dispatch<React.SetStateAction<string>>;
    setStage: React.Dispatch<React.SetStateAction<number>>;
}



const NameChangePreview = ({
    mediaType,
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
            formTitle={mediaType == "videos" ? "Rename Videos" : "Rename Comics"}
            size={6}
            containerStyle="flex flex-col gap-2 items-center"
        >
            <NameChangeTable nameChanges={nameChanges} />

            <div className="flex flex-col items-center gap-2">
                <SubmitButton
                    onClick={handleSubmit}
                    label="Rename Files"
                    size={0}
                    type="button"
                />
                <StageButton
                    onClick={() => setStage(0)}
                    label="Back"
                    type="button"
                    direction="left"
                />
            </div>
        </FormContainer>
    )
}

export default NameChangePreview;