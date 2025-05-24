import { TrashSolid } from "iconoir-react";
import theme from "../theme";

type UploadPreviewProps = {
    files: string[];
    deleteFile: (fileName: string) => void;
};

const UploadPreview = ({ files, deleteFile }: UploadPreviewProps) => {

    return (
        <div className="w-full">
            <ul className="flex flex-col gap-2">
                {
                    files.map((file: string) => (
                        <li key={file} className="flex justify-between">
                            {file}
                            <button
                                className={theme.deleteIconColor}
                                onClick={() => { deleteFile(file) }}
                            >
                                <TrashSolid />
                            </button>

                        </li>
                    ))
                }
            </ul>

        </div>
    );
};

export default UploadPreview;
