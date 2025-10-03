import CreateVolumesForm from "../service/manage/CreateVolumesForm";
import FormPage from "../lib/components/FormPage";
import { ManageProvider } from "../service/manage/ManageProvider";

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
