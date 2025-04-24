import { createContext } from "react";
import { NameChanges } from "../../lib/types";

export type RenameState = {
    nameChanges: NameChanges;
    previewFiles: string[];
    error: string;
};

export type Action =
    | { type: "SET_NAME_CHANGES"; payload: NameChanges }
    | { type: "SET_PREVIEWS"; payload: string[] }
    | { type: "SET_ERROR"; payload: string }
    | { type: "CLEAR_ERROR" }
    | { type: "CLEAR_NAME_CHANGES" }
    | { type: "RESET" };


export const RenameContext = createContext<{
    state: RenameState;
    dispatch: React.Dispatch<Action>;
} | null>(null);




