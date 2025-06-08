import { useReducer, ReactNode } from "react";
import { ManageContext } from "../context/ManageContext";
import { pageReducer, initialState as initialPageState } from "../state/pageReducer";

export const ManageProvider = ({ children }: { children: ReactNode }) => {
    const [pageState, pageDispatch] = useReducer(pageReducer, initialPageState);

    return (
        <ManageContext.Provider value={{ pageState, pageDispatch }}>
            {children}
        </ManageContext.Provider>
    );
};
