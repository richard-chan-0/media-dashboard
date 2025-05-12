import FormContainer from "./FormContainer";
import { useRename } from "../../hooks/useRename";
import UploadPreview from "../../../lib/components/UploadPreview";
import { Action } from "../../context/RenameContext";
import { postForm } from "../../../lib/api";
import { mediaLink, no_api_error } from "../../../lib/constants";

const PreviewFiles = () => {
    const { state, dispatch } = useRename();
    if (!state.previewFiles || state.previewFiles.length == 0) {
        return <></>;
    }
    const handleDelete = async (file_name: string) => {
        if (!mediaLink) {
            dispatch({ type: "SET_ERROR", payload: no_api_error });
            return;
        }
        const formData = new FormData();
        formData.append("file-to-delete", file_name);

        const response = await postForm(
            `${mediaLink}/rename/delete`,
            formData,
        );
        if (response?.error) {
            dispatch({ type: "SET_ERROR", payload: response.error });
        } else {
            const newFiles = state.previewFiles.filter((file) => file !== file_name);
            const setPreview = { type: "SET_PREVIEWS", payload: newFiles } as Action
            dispatch(setPreview);
            dispatch({ type: "CLEAR_ERROR" });
        }
    };
    return (
        <FormContainer
            size={3}
            formTitle="Uploaded Files"
            containerStyle="flex flex-col gap-2"
        >
            <p className="text-sm">
                <i>files currently uploaded</i>
            </p>
            <UploadPreview files={state.previewFiles} deleteFile={handleDelete} />
        </FormContainer>
    );
};

export default PreviewFiles;
