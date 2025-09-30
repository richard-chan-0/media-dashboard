import { createContext } from "react";
import { RenameState, RenameAction } from "../state/renameReducer";
import { PageState, PageAction } from "../state/pageReducer";

export type RenameContextType = {
    state: RenameState;
    dispatch: React.Dispatch<RenameAction>;
    pageState: PageState;
    pageDispatch: React.Dispatch<PageAction>;
};

export const RenameContext = createContext<RenameContextType | null>(null);
