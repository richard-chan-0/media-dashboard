import theme from "../../../../lib/theme";
import { useEffect, useState } from "react";
import { useRename } from "../../../../lib/hooks/usePageContext";
import { removePathFromFilePath } from "../../../../lib/utilities";
import Modal from "../../shared/Modal/Modal";
import { CloseButton, Spinner } from "../../../../lib/components";
import { get } from "../../../../lib/api/api";
import { ffmpegLink, no_api_error } from "../../../../lib/constants";
import { StreamSelect, StreamCheckboxList } from "../../shared";
import { Streams, MetadataChange, Stream } from "../../../../lib/types";
import React from "react";

type MetadataChangeModalProps = {
    isOpen: boolean;
    onClose: () => void;
    currentName: string;
    suggestedName: string;
    onEdit: (filename: string, newChange: MetadataChange | undefined) => void;
};

const MetadataChangeModal = React.memo(({ isOpen, onClose, currentName, suggestedName, onEdit }: MetadataChangeModalProps) => {
    const [filename, setFilename] = useState(removePathFromFilePath(suggestedName));
    const [fileTitle, setFileTitle] = useState("");
    const [streams, setStreams] = useState<Streams | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [defaultSubtitle, setDefaultSubtitle] = useState("");
    const [checkedSubtitles, setCheckedSubtitles] = useState<string[]>([]);
    const [defaultAudio, setDefaultAudio] = useState("");
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

    const isMetadataChange = (change: MetadataChange) => {
        return (
            change.title !== undefined ||
            change.defaultSubtitle !== undefined ||
            change.defaultAudio !== undefined ||
            (change.audiosToKeep !== undefined && change.audiosToKeep.length > 0) ||
            (change.subtitlesToKeep !== undefined && change.subtitlesToKeep.length > 0)
        );
    };

    const handleEditSubmit = () => {
        const additionalSubtitles = [defaultSubtitle, ...checkedSubtitles].map((number) => {
            return streams?.subtitle.find((s) => s.stream_number.toString() === number)?.merge_track_number.toString()
        }).filter((track) => track !== undefined);
        const additionalAudios = [defaultAudio, ...checkedAudios].map((number) => {
            return streams?.audio.find((a) => a.stream_number.toString() === number)?.merge_track_number.toString()
        }).filter((track) => track !== undefined);

        const newChange: MetadataChange = {
            newFilename: filename,
            title: fileTitle || undefined,
            defaultSubtitle: defaultSubtitle || undefined,
            defaultAudio: defaultAudio || undefined,
            audiosToKeep: additionalAudios || undefined,
            subtitlesToKeep: additionalSubtitles || undefined,
        };

        onEdit(currentName, isMetadataChange(newChange) ? newChange : undefined);
        onClose();
    };

    const createStreamVal = (option: Stream) => {
        return `${option.language}${option.title ? `:${option.title}` : ""}`;
    };

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="flex flex-col gap-2 text-blue-900 font-medium text-left">
                <div className="flex justify-between items-center">
                    <div className="text-lg">
                        {removePathFromFilePath(suggestedName)}
                    </div>
                    <CloseButton onClose={onClose} />
                </div>
                <div className="flex items-center gap-2 w-full">
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
                </div>
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
                {isLoading && <Spinner />}
                {!isLoading && streams && (
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
                        <StreamCheckboxList
                            label="Check Additional Audios"
                            checkedStreams={checkedAudios}
                            setCheckedStreams={setCheckedAudios}
                            streams={streams.audio.filter(
                                (audio) => audio.stream_number.toString() !== defaultAudio,
                            )}
                            createVal={createStreamVal}
                        />
                        <StreamCheckboxList
                            label="Check Additional Subtitles"
                            checkedStreams={checkedSubtitles}
                            setCheckedStreams={setCheckedSubtitles}
                            streams={streams.subtitle.filter(
                                (subtitle) => subtitle.stream_number.toString() !== defaultSubtitle,
                            )}
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
});

MetadataChangeModal.displayName = "MetadataChangeModal";

export default MetadataChangeModal;
