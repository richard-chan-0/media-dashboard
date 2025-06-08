import { useContext } from "react";
import { RenameContext } from "../context/RenameContext";

export const useRename = () => {
    const context = useContext(RenameContext);
    if (!context) {
        throw new Error("useRename must be used within a RenameProvider");
    }
    return context;
};
