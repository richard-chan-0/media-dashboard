import { FormEvent } from "react";
import FormContainer from "./FormContainer";
import { useState } from "react";
import StreamSelect from "../lib/components/StreamSelect";
import StreamCheckboxList from "../lib/components/StreamCheckbox";
import SubmitButton from "../lib/components/SubmitButton";

export type Stream = {
    is_default: string,
    language: string,
    stream_number: number,
    title: string
}
type Streams = {
    attachment: object[],
    audio: Stream[],
    subtitle: Stream[]
}
type PickStreamsFormProps = {
    streams: Streams
}
const PickStreamsForm = ({ streams }: PickStreamsFormProps) => {
    const [defaultSubtitle, setDefaultSubtitle] = useState("");
    const [checkedSubtitles, setCheckedSubtitles] = useState([]);
    const [defaultAudio, setDefaultAudio] = useState("");
    const [checkedAudios, setCheckedAudios] = useState([]);
    const subtitles = streams["subtitle"]
    const audios = streams["audio"];

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
    }

    const createStreamValue = (option: Stream) => `${option.language}${option.title ? `:${option.title}` : ""}`
    return (
        <FormContainer size={4} >
            <form onSubmit={handleSubmit} className="flex flex-col p-4 w-full gap-3 items-center">
                <StreamSelect
                    label="Select Default Subtitle"
                    select={defaultSubtitle}
                    setSelect={setDefaultSubtitle}
                    selections={subtitles}
                    createVal={createStreamValue}
                    isCenterAlign={true}
                />
                <StreamSelect
                    label="Select Default Audio"
                    select={defaultAudio}
                    setSelect={setDefaultAudio}
                    selections={audios}
                    createVal={createStreamValue}
                    isCenterAlign={true}
                />
                <FormContainer size={3}>
                    <StreamCheckboxList
                        label="Check Subtitles"
                        checkedStreams={checkedSubtitles}
                        setCheckedStreams={setCheckedSubtitles}
                        streams={subtitles}
                        createVal={createStreamValue}
                    />
                </FormContainer>
                <FormContainer size={3}>
                    <StreamCheckboxList
                        label="Check Audios"
                        checkedStreams={checkedAudios}
                        setCheckedStreams={setCheckedAudios}
                        streams={audios}
                        createVal={createStreamValue}
                    />
                </FormContainer>
                <SubmitButton label={"Set Stream(s)"} size={0} />
            </form>
        </FormContainer>
    )
}

export default PickStreamsForm;