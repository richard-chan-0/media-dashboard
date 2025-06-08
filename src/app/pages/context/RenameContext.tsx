import { createContext } from "react";
import { RenameState, RenameAction } from "../state/renameReducer";
import { PageState, PageAction } from "../state/pageReducer";

export const RenameContext = createContext<{
    state: RenameState;
    dispatch: React.Dispatch<RenameAction>;
    pageState: PageState;
    pageDispatch: React.Dispatch<PageAction>;
} | null>(null);
