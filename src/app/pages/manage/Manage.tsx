import CreateVolumesForm from "./CreateVolumesForm";
import FormPage from "../FormPage";
import { ManageProvider } from "./ManageProvider";

const ManagePage = () => {
    return (
        <ManageProvider>
            <FormPage>
                <CreateVolumesForm />
            </FormPage>
        </ManageProvider>
    );
};

export default ManagePage;
