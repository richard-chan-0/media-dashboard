import { createContext } from "react";
import { RenameContextType } from "../../lib/types";

export const RenameContext = createContext<RenameContextType | null>(null);
