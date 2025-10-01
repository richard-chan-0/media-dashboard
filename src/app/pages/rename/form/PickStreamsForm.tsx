import { FormEvent } from "react";
import FormContainer from "../../../lib/components/FormContainer";
import { useState } from "react";
import { StreamSelect, StreamCheckboxList, SubmitButton } from "../../../lib/components";
import { postForm } from "../../../lib/api";
import { ffmpegLink, no_api_error } from "../../../lib/constants";
import { useRename } from "../../hooks/usePageContext";
import { Streams, Stream } from "../../../lib/types";

type PickStreamsFormProps = {
    streams: Streams;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
};
const PickStreamsForm = ({ streams, setMessage }: PickStreamsFormProps) => {
    const [defaultSubtitle, setDefaultSubtitle] = useState("");
    const [checkedSubtitles, setCheckedSubtitles] = useState([]);
    const [defaultAudio, setDefaultAudio] = useState("");
    const [checkedAudios, setCheckedAudios] = useState([]);
    const subtitles = streams["subtitle"];
    const audios = streams["audio"];

    const { pageDispatch } = useRename();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!ffmpegLink) {
            pageDispatch({ type: "SET_ERROR", payload: no_api_error });
            return;
        }

        const writeLink = streams?.is_mkv ? "/mkv/write" : "/ffmpeg/write";
        const formData = new FormData();
        formData.append(
            "subtitles",
            JSON.stringify([defaultSubtitle, ...checkedSubtitles]),
        );
        formData.append(
            "audios",
            JSON.stringify([defaultAudio, ...checkedAudios]),
        );
        const response = await postForm(`${ffmpegLink}${writeLink}`, formData);
        if (response?.error) {
            pageDispatch({ type: "SET_ERROR", payload: response.error });
        } else {
            pageDispatch({ type: "CLEAR_ERROR" });
            setMessage(response);
        }
    };

    const createStreamValue = (option: Stream) =>
        `${option.language}${option.title ? `:${option.title}` : ""}`;
    return (
        <FormContainer isBorderEnabled={false}>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col p-4 w-full gap-3 items-center"
            >
                <StreamSelect
                    label="Select Default Subtitle"
                    select={defaultSubtitle}
                    setSelect={setDefaultSubtitle}
                    selections={subtitles}
                    createVal={createStreamValue}
                    isCenterAlign={true}
                    isRequired={true}
                />
                <StreamSelect
                    label="Select Default Audio"
                    select={defaultAudio}
                    setSelect={setDefaultAudio}
                    selections={audios}
                    createVal={createStreamValue}
                    isCenterAlign={true}
                />
                {!streams?.is_mkv && (
                    <>
                        <FormContainer size={3}>
                            <StreamCheckboxList
                                label="Check Additional Subtitles"
                                checkedStreams={checkedSubtitles}
                                setCheckedStreams={setCheckedSubtitles}
                                streams={subtitles.filter(
                                    (subtitle) =>
                                        subtitle.stream_number.toString() !==
                                        defaultSubtitle,
                                )}
                                createVal={createStreamValue}
                            />
                        </FormContainer>
                        <FormContainer size={3}>
                            <StreamCheckboxList
                                label="Check Additional Audios"
                                checkedStreams={checkedAudios}
                                setCheckedStreams={setCheckedAudios}
                                streams={audios.filter(
                                    (audio) =>
                                        audio.stream_number.toString() !==
                                        defaultAudio,
                                )}
                                createVal={createStreamValue}
                            />
                        </FormContainer>
                    </>
                )}
                <SubmitButton label={"Reset Default"} type="submit" />
            </form>
        </FormContainer>
    );
};

export default PickStreamsForm;
