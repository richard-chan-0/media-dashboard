import theme from "../../theme";
import { useEffect, useState } from "react";
import { useRename } from "../../../pages/hooks/usePageContext";
import { removePathFromFilePath, splitPathFromFilePath } from "../../utilities";
import Modal from "../Modal/Modal";
import CloseButton from "../CloseButton";
import { get } from "../../api";
import { ffmpegLink, no_api_error } from "../../constants";
import { StreamSelect, StreamCheckboxList } from "../../components";
import { Streams, Stream } from "../../../lib/types";
import Spinner from "../Spinner";

type MetadataChangeModalProps = {
    isOpen: boolean;
    onClose: () => void;
    initialName: string;
};

const MetadataChangeModal = ({ isOpen, onClose, initialName }: MetadataChangeModalProps) => {
    const [filename, setFilename] = useState(initialName);
    const [fileTitle, setFileTitle] = useState("");
    const [streams, setStreams] = useState<Streams | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [defaultSubtitle, setDefaultSubtitle] = useState("");
    const [checkedSubtitles, setCheckedSubtitles] = useState<string[]>([]);
    const [defaultAudio, setDefaultAudio] = useState("");
    const [checkedAudios, setCheckedAudios] = useState<string[]>([]);

    const { state, dispatch, pageDispatch } = useRename();

    useEffect(() => {
        if (isOpen) {
            setFilename(initialName);
            fetchStreams();
        }
    }, [initialName, isOpen]);

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

    const handleSubmit = () => {
        const updatedChanges = state.nameChanges.changes.map((change) => {
            if (change.output === initialName) {
                const { path } = splitPathFromFilePath(change.output);
                return {
                    ...change,
                    output: `${path}/${filename}`,
                };
            } else {
                return change;
            }
        });
        const updatedNameChanges = {
            changes: updatedChanges,
        };
        dispatch({ type: "SET_NAME_CHANGES", payload: updatedNameChanges });
        onClose();
    };

    if (!isOpen) return null;

    const createStreamValue = (option: Stream) =>
        `${option.language}${option.title ? `:${option.title}` : ""}`;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="flex flex-col gap-2 text-blue-900 font-medium text-left">
                <div className="flex justify-between items-center">
                    <div className="text-lg">
                        {removePathFromFilePath(initialName)}
                    </div>
                    <CloseButton onClose={onClose} />
                </div>
                <div className="flex items-center gap-2 w-full">
                    <label className="w-fit" htmlFor="name">
                        New Filename:
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={removePathFromFilePath(filename)}
                        onChange={(e) => setFilename(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
                    />
                </div>
                <div className="flex items-center gap-2 w-full">
                    <label className="w-fit " htmlFor="title">
                        New Title (optional):
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
                            label="Select Default Subtitle"
                            select={defaultSubtitle}
                            setSelect={setDefaultSubtitle}
                            selections={streams.subtitle}
                            createVal={createStreamValue}
                            isCenterAlign={true}
                            isRequired={true}
                        />
                        <StreamSelect
                            label="Select Default Audio"
                            select={defaultAudio}
                            setSelect={setDefaultAudio}
                            selections={streams.audio}
                            createVal={createStreamValue}
                            isCenterAlign={true}
                        />
                        <StreamCheckboxList
                            label="Check Additional Audios"
                            checkedStreams={checkedAudios}
                            setCheckedStreams={setCheckedAudios}
                            streams={streams.audio.filter(
                                (audio) =>
                                    audio.stream_number.toString() !==
                                    defaultAudio,
                            )}
                            createVal={createStreamValue}
                        />
                        <StreamCheckboxList
                            label="Check Additional Subtitles"
                            checkedStreams={checkedSubtitles}
                            setCheckedStreams={setCheckedSubtitles}
                            streams={streams.subtitle.filter(
                                (subtitle) =>
                                    subtitle.stream_number.toString() !==
                                    defaultSubtitle,
                            )}
                            createVal={createStreamValue}
                        />
                    </div>
                )}

                <button
                    onClick={handleSubmit}
                    className={`${theme.buttonColor} ${theme.buttonFormat} w-1/5 self-center`}
                >
                    Update
                </button>
            </div>
        </Modal>
    );
};

export default MetadataChangeModal;
