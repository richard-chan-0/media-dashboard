import FormContainer from "./FormContainer";

type PreviewFilesProps = {
    previewFiles: string[];
}

const PreviewFiles = ({ previewFiles }: PreviewFilesProps) => {
    if (!previewFiles || previewFiles.length == 0) {
        return <></>
    }
    return (
        <FormContainer
            size={3}
            formTitle="Uploaded Files"
            containerStyle="flex flex-col gap-2"
        >
            <p className="text-sm"><i>files currently uploaded</i></p>
            <ul className="border border-white shadow-white shadow-md bg-black p-2 text-md font-light">
                {previewFiles.map((fileName: string) => (
                    <li key={fileName}>{fileName}</li>
                ))}
            </ul>

        </FormContainer>
    )
}

export default PreviewFiles;