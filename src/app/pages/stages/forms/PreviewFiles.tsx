import FormContainer from "./FormContainer";
import { useRename } from "../../hooks/useRename";
import UploadPreview from "../../../lib/components/UploadPreview";
import { useDeleteFile } from "../../hooks/useDeleteFile";

const PreviewFiles = () => {
    const { state } = useRename();
    const deleteFile = useDeleteFile();
    if (!state.previewFiles || state.previewFiles.length == 0) {
        return <></>;
    }

    return (
        <FormContainer
            size={3}
            formTitle="Uploaded Files"
            containerStyle="flex flex-col gap-2"
        >
            <p className="text-sm">
                <i>files currently uploaded</i>
            </p>
            <UploadPreview files={state.previewFiles} deleteFile={deleteFile} />
        </FormContainer>
    );
};

export default PreviewFiles;
