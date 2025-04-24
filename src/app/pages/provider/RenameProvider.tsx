import { useReducer, ReactNode } from "react";
import { RenameContext } from "../context/RenameContext";
import { RenameState, Action } from "../context/RenameContext";

const initialState: RenameState = {
    nameChanges: { changes: [] },
    previewFiles: [],
    error: "",
};

function renameReducer(state: RenameState, action: Action): RenameState {
    switch (action.type) {
        case "SET_NAME_CHANGES":
            return { ...state, nameChanges: action.payload };
        case "SET_PREVIEWS":
            return { ...state, previewFiles: action.payload };
        case "SET_ERROR":
            return { ...state, error: action.payload };
        case "RESET":
            return initialState;
        case "CLEAR_ERROR":
            return { ...state, error: "" };
        case "CLEAR_NAME_CHANGES":
            return { ...state, nameChanges: { changes: [] } };
        default:
            return state;
    }
}

export const RenameProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(renameReducer, initialState);

    return (
        <RenameContext.Provider value={{ state, dispatch }}>
            {children}
        </RenameContext.Provider>
    );
};