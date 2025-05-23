import { postForm } from "../../lib/api";
import { mediaLink , no_api_error} from "../../lib/constants";
import { removePathFromFilePath } from "../../lib/utilities";
import { Action } from "../context/RenameContext";
import { useRename } from "./useRename";

export const useDeleteFile = () => {
    const { state, dispatch } = useRename();
    const deleteFile = async (fileName: string) => {
        
        if (!mediaLink) {
            dispatch({ type: "SET_ERROR", payload: no_api_error });
            return;
        }
        const formData = new FormData();
        formData.append("file-to-delete", fileName);

        const response = await postForm(
            `${mediaLink}/rename/delete`,
            formData,
        );
        if (response?.error) {
            dispatch({ type: "SET_ERROR", payload: response.error });
        } else {
            const newFiles = state.previewFiles.filter((file) => file !== fileName);
            const setPreview = { type: "SET_PREVIEWS", payload: newFiles } as Action
            dispatch(setPreview);
            const newNameChanges = state.nameChanges.changes.filter(
                (nameChange) => removePathFromFilePath(nameChange.input) !== fileName);
            const setNameChanges = { type: "SET_NAME_CHANGES", payload: { changes: newNameChanges } } as Action
            dispatch(setNameChanges);
            dispatch({ type: "CLEAR_ERROR" });
        }
    }
    return deleteFile;
};