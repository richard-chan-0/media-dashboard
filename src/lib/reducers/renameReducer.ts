import { NameChanges } from "../../lib/types";

export const initialState: RenameState = {
    nameChanges: { changes: [] },
    mediaType: "",
};

export type RenameState = {
    nameChanges: NameChanges;
    mediaType: string;
};

export type RenameAction =
    | { type: "SET_NAME_CHANGES"; payload: NameChanges }
    | { type: "CLEAR_NAME_CHANGES" }
    | { type: "RESET" }
    | { type: "SET_MEDIA_TYPE"; payload: string };

export const renameReducer = (state: RenameState, action: RenameAction): RenameState => {
    switch (action.type) {
        case "SET_NAME_CHANGES":
            return { ...state, nameChanges: action.payload };
        case "RESET":
            return initialState;
        case "CLEAR_NAME_CHANGES":
            return { ...state, nameChanges: { changes: [] } };
        case "SET_MEDIA_TYPE":
            return { ...state, mediaType: action.payload };
        default:
            return state;
    }
}