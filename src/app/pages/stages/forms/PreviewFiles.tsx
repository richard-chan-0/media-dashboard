import FormContainer from "./FormContainer";
import { useRename } from "../../hooks/useRename";

const PreviewFiles = () => {
    const { state } = useRename();
    if (!state.previewFiles || state.previewFiles.length == 0) {
        return <></>;
    }
    return (
        <FormContainer
            size={3}
            formTitle="Uploaded Files"
            containerStyle="flex flex-col gap-2"
        >
            <p className="text-sm">
                <i>files currently uploaded</i>
            </p>
            <ul className="border border-white shadow-white shadow-md bg-black p-2 text-md font-light">
                {state.previewFiles.map((fileName: string) => (
                    <li key={fileName}>{fileName}</li>
                ))}
            </ul>
        </FormContainer>
    );
};

export default PreviewFiles;
