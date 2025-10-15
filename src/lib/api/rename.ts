import { mediaLink } from "../constants";
import { postJson } from "./api";
import { NameChangeApiRequest } from "../types";

export const postRenameChangeRequest = async (
    nameChangeRequest: NameChangeApiRequest,
) => {
    return await postJson(`${mediaLink}/rename/process`, nameChangeRequest);
};
