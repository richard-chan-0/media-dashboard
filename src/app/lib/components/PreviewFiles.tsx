import FormContainer from "./FormContainer";
import UploadPreview from "../../lib/components/UploadPreview";
import { useDeleteFile } from "../../pages/hooks/useDeleteFile";
import { useRename } from "../../pages/hooks/usePageContext";

const PreviewFiles = () => {
    const { pageState } = useRename();
    const deleteFile = useDeleteFile();
    if (!pageState.previewFiles || pageState.previewFiles.length == 0) {
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
            <UploadPreview files={pageState.previewFiles} deleteFile={deleteFile} />
        </FormContainer>
    );
};

export default PreviewFiles;
