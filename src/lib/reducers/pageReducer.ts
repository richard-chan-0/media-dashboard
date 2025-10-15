import { PageState, PageAction } from "../types";
export const initialState: PageState = {
    error: "",
    previewFiles: [],
};

export const pageReducer = (
    state: PageState,
    action: PageAction,
): PageState => {
    switch (action.type) {
        case "SET_PREVIEWS":
            return { ...state, previewFiles: action.payload };
        case "SET_ERROR":
            return {
                ...state,
                error: action.payload,
            };
        case "CLEAR_ERROR":
            return {
                ...state,
                error: "",
            };
        case "RESET":
            return { error: "", previewFiles: [] };
        default:
            return state;
    }
};
