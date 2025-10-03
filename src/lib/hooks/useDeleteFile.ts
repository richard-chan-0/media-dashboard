import { postForm } from "../api";
import { mediaLink, no_api_error } from "../constants";
import { removePathFromFilePath } from "../utilities";
import { PageAction } from "../../pages/state/pageReducer";
import { RenameAction } from "../../pages/state/renameReducer";
import { useRename } from "./usePageContext";

export const useDeleteFile = () => {
    const { state, dispatch, pageState, pageDispatch } = useRename();
    const deleteFile = async (fileName: string) => {
        if (!mediaLink) {
            pageDispatch({ type: "SET_ERROR", payload: no_api_error });
            return;
        }
        const formData = new FormData();
        formData.append("file-to-delete", fileName);

        const response = await postForm(`${mediaLink}/rename/delete`, formData);
        if (response?.error) {
            pageDispatch({ type: "SET_ERROR", payload: response.error });
        } else {
            const newFiles = pageState.previewFiles.filter(
                (file) => file !== fileName,
            );
            const setPreview = {
                type: "SET_PREVIEWS",
                payload: newFiles,
            } as PageAction;
            pageDispatch(setPreview);
            const newNameChanges = state.nameChanges.changes.filter(
                (nameChange) =>
                    removePathFromFilePath(nameChange.input) !== fileName,
            );
            const setNameChanges = {
                type: "SET_NAME_CHANGES",
                payload: { changes: newNameChanges },
            } as RenameAction;
            dispatch(setNameChanges);
            pageDispatch({ type: "CLEAR_ERROR" });
        }
    };
    return deleteFile;
};
