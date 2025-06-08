import { createContext } from "react";
import { PageState, PageAction } from "../state/pageReducer";

export type ManageContextType = {
    pageState: PageState;
    pageDispatch: React.Dispatch<PageAction>;
};

export const ManageContext = createContext<ManageContextType | null>(null);
