import { createContext } from "react";
import { RenameState, RenameAction } from "../../lib/reducers/renameReducer";
import { PageState, PageAction } from "../../lib/reducers/pageReducer";

export type RenameContextType = {
    state: RenameState;
    dispatch: React.Dispatch<RenameAction>;
    pageState: PageState;
    pageDispatch: React.Dispatch<PageAction>;
};

export const RenameContext = createContext<RenameContextType | null>(null);
