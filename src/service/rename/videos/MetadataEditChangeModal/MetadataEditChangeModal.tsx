import theme from "../../../../lib/theme";
import { useEffect, useState } from "react";
import { removePathFromFilePath } from "../../../../lib/utilities";
import Modal from "../../shared/Modal/Modal";
import { CloseButton, Spinner } from "../../../../lib/components";
import { StreamSelect } from "../../shared";
import { Streams, MetadataEditChange, Stream } from "../../../../lib/types";

type MetadataEditChangeModalProps = {
    isOpen: boolean;
    onClose: () => void;
    currentName: string;
    suggestedName: string;
    onEdit: (filename: string, newChange: MetadataEditChange | undefined) => void;
    streams: Streams | null;
    isLoadingStreams: boolean;
};

const MetadataEditChangeModal = ({ isOpen, onClose, currentName, suggestedName, onEdit, streams, isLoadingStreams }: MetadataEditChangeModalProps) => {
    const [filename, setFilename] = useState(removePathFromFilePath(suggestedName));
    const [fileTitle, setFileTitle] = useState("");
    const [defaultSubtitle, setDefaultSubtitle] = useState("");
    const [defaultAudio, setDefaultAudio] = useState("");

    useEffect(() => {
        if (isOpen) {
            setFilename(removePathFromFilePath(suggestedName));
        }
    }, [isOpen, suggestedName]);

    const isMetadataChange = (change: MetadataEditChange) => {
        return (
            change.title !== undefined ||
            change.defaultSubtitle !== undefined ||
            change.defaultAudio !== undefined
        );
    };

    const handleOnClose = () => {
        setFilename("");
        setFileTitle("");
        setDefaultSubtitle("");
        setDefaultAudio("");
        onClose();
    }

    const handleEditSubmit = () => {

        const newChange: MetadataEditChange = {
            title: fileTitle || undefined,
            defaultSubtitle: defaultSubtitle || undefined,
            defaultAudio: defaultAudio || undefined,
        };

        onEdit(currentName, isMetadataChange(newChange) ? newChange : undefined);
        handleOnClose();
    };

    const createStreamVal = (option: Stream) => {
        const mainIdentifier = option.language && option.language !== "no language" ? option.language : option.merge_track_number;
        const secondaryIdentifier = option.title ? ` - ${option.title}` : "";
        const thirdIdentifier = option.is_forced ? " (forced)" : "";
        return `${mainIdentifier}${secondaryIdentifier}${thirdIdentifier}`;
    };

    return (
        <Modal isOpen={isOpen} onClose={handleOnClose}>
            <div className="flex flex-col gap-2 text-blue-900 font-medium text-left">
                <div className="flex justify-between items-center">
                    <div className="text-lg">
                        {removePathFromFilePath(suggestedName)}
                    </div>
                    <CloseButton onClose={handleOnClose} />
                </div>
                {currentName !== suggestedName && (<div className="flex items-center gap-2 w-full">
                    <label className="w-fit" htmlFor="name">
                        New Filename <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={filename}
                        onChange={(e) => setFilename(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
                    />
                </div>)}
                <div className="flex items-center gap-2 w-full">
                    <label className="w-fit " htmlFor="title">
                        Title:
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={fileTitle}
                        onChange={(e) => setFileTitle(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    />
                </div>
                {isLoadingStreams && <Spinner />}
                {!isLoadingStreams && streams && (
                    <div className="w-full flex flex-col gap-4">
                        <StreamSelect
                            label="Select Default Audio"
                            select={defaultAudio}
                            setSelect={setDefaultAudio}
                            selections={streams.audio}
                            createVal={createStreamVal}
                            isCenterAlign={true}
                        />
                        <StreamSelect
                            label="Select Default Subtitle"
                            select={defaultSubtitle}
                            setSelect={setDefaultSubtitle}
                            selections={streams.subtitle}
                            createVal={createStreamVal}
                            isCenterAlign={true}
                            isRequired={true}
                        />
                    </div>
                )}

                <button
                    onClick={handleEditSubmit}
                    className={`${theme.buttonColor} ${theme.buttonFormat} w-1/5 self-center`}
                >
                    Update
                </button>
            </div>
        </Modal>
    );
};

MetadataEditChangeModal.displayName = "MetadataChangeModal";

export default MetadataEditChangeModal;
