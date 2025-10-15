import { mediaLink } from "../constants";
import { postJson, postForm } from "./api";
import { NameChangeApiRequest } from "../types";
import { UploadAction } from "../reducers/uploadReducer";

export const postRenameChangeRequest = async (
    nameChangeRequest: NameChangeApiRequest,
) => {
    return await postJson(`${mediaLink}/rename/process`, nameChangeRequest);
};

export const postRenameVideosRequest = async (
    formData: FormData,
    uploadDispatcher: React.ActionDispatch<[action: UploadAction]>,
    abortControllerRef: React.RefObject<AbortController | null>,
) => {
    return await postForm(
        `${mediaLink}/rename/videos`,
        formData,
        uploadDispatcher,
        abortControllerRef?.current?.signal,
    );
};
