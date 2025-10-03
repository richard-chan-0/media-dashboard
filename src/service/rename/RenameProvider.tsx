import { useReducer, ReactNode } from "react";
import { RenameContext } from "./RenameContext";
import { renameReducer, initialState as initialRenameState } from "../../lib/reducers/renameReducer";
import { pageReducer, initialState as initialPageState } from "../../lib/reducers/pageReducer";

export const RenameProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(renameReducer, initialRenameState);
    const [pageState, pageDispatch] = useReducer(pageReducer, initialPageState);

    return (
        <RenameContext.Provider value={{ state, dispatch, pageState, pageDispatch }}>
            {children}
        </RenameContext.Provider>
    );
};
