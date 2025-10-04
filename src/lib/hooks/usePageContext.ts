import { useContext } from "react";
import { RenameContext } from "../../service/rename/RenameContext";
import { ManageContext } from "../../service/manage/ManageContext";

export const useRename = () => {
    const context = useContext(RenameContext);
    if (!context) {
        throw new Error("useRename must be used within a RenameProvider");
    }
    return context;
};

export const useManage = () => {
    const context = useContext(ManageContext);
    if (!context) {
        throw new Error("useManage must be used within a ManageProvider");
    }
    return context;
};
