type NameChangeListPreviewProps = {
    files: File[]
}

const NameChangeListPreview = ({ files }: NameChangeListPreviewProps) => {
    return (
        <ul className={`${files.length > 0 ? "mt-2" : ""}`}>
            {files.map((file) => (
                <li key={file.name} className="text-white">{file.name}</li>
            ))}
        </ul>
    )
}

export default NameChangeListPreview;