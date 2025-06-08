import { createContext } from "react";
import { PageState, PageAction } from "../state/pageReducer";

export const ManageContext = createContext<{
    pageState: PageState;
    pageDispatch: React.Dispatch<PageAction>;
} | null>(null);
