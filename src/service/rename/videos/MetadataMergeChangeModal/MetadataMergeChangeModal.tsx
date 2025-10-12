import theme from "../../../../lib/theme";
import { useEffect, useState } from "react";
import { useRename } from "../../../../lib/hooks/usePageContext";
import { removePathFromFilePath } from "../../../../lib/utilities";
import Modal from "../../shared/Modal/Modal";
import { CloseButton, Spinner } from "../../../../lib/components";
import { get } from "../../../../lib/api/api";
import { ffmpegLink, no_api_error } from "../../../../lib/constants";
import { StreamCheckboxList } from "../../shared";
import { Streams, MetadataChange, Stream } from "../../../../lib/types";

type MetadataMergeChangeModalProps = {
    isOpen: boolean;
    onClose: () => void;
    currentName: string;
    suggestedName: string;
    onMerge: (filename: string, newChange: MetadataChange | undefined) => void;
};

const MetadataMergeChangeModal = ({ isOpen, onClose, suggestedName, onMerge }: MetadataMergeChangeModalProps) => {
    const [filename, setFilename] = useState(removePathFromFilePath(suggestedName));
    const [streams, setStreams] = useState<Streams | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [checkedSubtitles, setCheckedSubtitles] = useState<string[]>([]);
    const [checkedAudios, setCheckedAudios] = useState<string[]>([]);
    const { pageDispatch } = useRename();

    useEffect(() => {
        if (isOpen) {
            setFilename(removePathFromFilePath(suggestedName));
            fetchStreams();
        }
    }, [isOpen]);

    const fetchStreams = async () => {
        if (!ffmpegLink) {
            pageDispatch({ type: "SET_ERROR", payload: no_api_error });
            return;
        }
        setIsLoading(true);
        const response = await get(`${ffmpegLink}/read`);
        setIsLoading(false);
        if (response?.error) {
            pageDispatch({ type: "SET_ERROR", payload: response.error });
        } else {
            setStreams(response);
            pageDispatch({ type: "CLEAR_ERROR" });
        }
    };

    const handleEditSubmit = () => {
        const additionalSubtitles = checkedSubtitles.map((number) => {
            return streams?.subtitle.find((s) => s.stream_number.toString() === number)?.merge_track_number.toString()
        }).filter((track) => track !== undefined);
        const additionalAudios = checkedAudios.map((number) => {
            return streams?.audio.find((a) => a.stream_number.toString() === number)?.merge_track_number.toString()
        }).filter((track) => track !== undefined);

        const newChange: MetadataChange = {
            newFilename: filename,
            title: undefined,
            defaultSubtitle: undefined,
            defaultAudio: undefined,
            audiosToKeep: additionalAudios || undefined,
            subtitlesToKeep: additionalSubtitles || undefined,
        };

        console.log("Submitting metadata change:", newChange);

        // onEdit(currentName, isMetadataChange(newChange) ? newChange : undefined);
        onClose();
    };

    const createStreamVal = (option: Stream) => {
        const mainIdentifier = option.language && option.language !== "no language" ? option.language : option.merge_track_number;
        const secondaryIdentifier = option.title ? ` - ${option.title}` : "";
        return `${mainIdentifier}${secondaryIdentifier}`;
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="flex flex-col gap-2 text-blue-900 font-medium text-left">
                <div className="flex justify-between items-center">
                    <div className="text-lg">
                        {removePathFromFilePath(suggestedName)}
                    </div>
                    <CloseButton onClose={onClose} />
                </div>
                {isLoading && <Spinner />}
                {!isLoading && streams && (
                    <div className="w-full flex flex-col gap-4">
                        <StreamCheckboxList
                            label="Select Audios to Keep"
                            checkedStreams={checkedAudios}
                            setCheckedStreams={setCheckedAudios}
                            streams={streams.audio}
                            createVal={createStreamVal}
                        />
                        <StreamCheckboxList
                            label="Select Subtitles to Keep"
                            checkedStreams={checkedSubtitles}
                            setCheckedStreams={setCheckedSubtitles}
                            streams={streams.subtitle}
                            createVal={createStreamVal}
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

MetadataMergeChangeModal.displayName = "MetadataChangeModal";

export default MetadataMergeChangeModal;
