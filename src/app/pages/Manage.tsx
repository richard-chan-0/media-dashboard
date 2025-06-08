import CreateVolumesForm from "./stages/forms/CreateVolumesForm";
import FormPage from "./FormPage";
import { ManageProvider } from "./provider/ManageProvider";

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
