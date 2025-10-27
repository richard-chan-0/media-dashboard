import { useEffect, useState } from "react";
import { removePathFromFilePath } from "../../../../lib/utilities";
import Modal from "../../shared/Modal/Modal";
import { CloseButton, Spinner, SubmitButton } from "../../../../lib/components";
import { StreamCheckboxList } from "../../shared";
import { Streams, Stream, MetadataMergeChange } from "../../../../lib/types";

type MetadataMergeChangeModalProps = {
    isOpen: boolean;
    onClose: () => void;
    currentName: string;
    onMerge: (newChange: MetadataMergeChange | undefined) => void;
    streams: Streams | null;
    isLoadingStreams: boolean;
};

const MetadataMergeChangeModal = ({ isOpen, onClose, currentName, onMerge, streams, isLoadingStreams }: MetadataMergeChangeModalProps) => {
    const [filename, setFilename] = useState(removePathFromFilePath(currentName));
    const [checkedSubtitles, setCheckedSubtitles] = useState<string[]>([]);
    const [checkedAudios, setCheckedAudios] = useState<string[]>([]);

    useEffect(() => {
        if (isOpen) {
            setFilename(removePathFromFilePath(currentName));
        }
    }, [isOpen, currentName]);

    const handleMergeSubmit = () => {
        const additionalSubtitles = checkedSubtitles.map((number) => {
            return streams?.subtitle.find((s) => s.stream_number.toString() === number)?.merge_track_number.toString()
        }).filter((track) => track !== undefined);
        const additionalAudios = checkedAudios.map((number) => {
            return streams?.audio.find((a) => a.stream_number.toString() === number)?.merge_track_number.toString()
        }).filter((track) => track !== undefined);

        if (additionalSubtitles.length === 0 && additionalAudios.length === 0) {
            onClose();
            return;
        }

        const newChange: MetadataMergeChange = {
            filename: filename,
            output_filename: `temp-${filename}`,
            audio_tracks: `[${additionalAudios.join(",")}]`,
            subtitle_tracks: `[${additionalSubtitles.join(",")}]`,
        };

        onMerge(newChange);
        onClose();
    };

    const createStreamVal = (option: Stream) => {
        const mainIdentifier = option.language && option.language !== "no language" ? option.language : option.merge_track_number;
        const secondaryIdentifier = option.title ? ` - ${option.title}` : "";
        return `${mainIdentifier}${secondaryIdentifier}`;
    };

    const printSelectedStream = (checkedStreams: string[], type: "audio" | "subtitle") => {
        if (checkedStreams.length === 0 || !streams) {
            return "[ ]";
        }

        return `[ ${checkedStreams.map((num) => {
            const stream = streams[type].find((s) => s.stream_number.toString() === num);
            return stream ? createStreamVal(stream) : num;
        }).join(", ")} ]`;
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="flex flex-col gap-2 text-blue-900 font-medium text-left">
                <div className="flex w-full justify-between items-center">
                    <div className="text-lg flex wrap-anywhere ">
                        {removePathFromFilePath(currentName)}
                    </div>
                    <CloseButton onClose={onClose} />
                </div>
                {isLoadingStreams && <Spinner />}
                {!isLoadingStreams && streams && (
                    <div className="w-full flex flex-col gap-4">
                        <section>
                            <div>Audio Order: {printSelectedStream(checkedAudios, "audio")}</div>
                            <div>Subtitle Order: {printSelectedStream(checkedSubtitles, "subtitle")}</div>
                        </section>
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
                <footer className="flex justify-center mt-4">
                    <SubmitButton
                        onClick={handleMergeSubmit}
                        label="Update"
                        buttonStyle="w-1/5"
                    />
                </footer>
            </div>
        </Modal>
    );
};

MetadataMergeChangeModal.displayName = "MetadataChangeModal";

export default MetadataMergeChangeModal;
