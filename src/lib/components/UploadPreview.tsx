import { TrashSolid } from "iconoir-react";
import theme from "../theme";
import { truncateString } from "../utilities";

export type UploadPreviewProps = {
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
                            <span title={file}>{truncateString(file, 40)}</span>
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
