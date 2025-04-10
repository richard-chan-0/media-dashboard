import { useState } from "react";
import PickStreamsForm from "../forms/PickStreamsForm"
import ResetDefaultsForm from "../forms/ResetDefaultsForm"
import SuccessMessage from "../lib/components/SuccessMessage"
import FormContainer from "../forms/FormContainer";
import StageNavButtons from "./stageNavButtons";

type SetStreamsProps = {
    setError: React.Dispatch<React.SetStateAction<string>>;
    setStage: React.Dispatch<React.SetStateAction<number>>;
    stage: number;
}

const SetStreams = ({ stage, setStage, setError }: SetStreamsProps) => {
    const [message, setMessage] = useState("");
    const [streams, setStreams] = useState({ attachment: [], subtitle: [], audio: [] });

    return (
        <FormContainer size={3} containerStyle="flex flex-col">
            <StageNavButtons
                leftLabel="Back"
                isLeftEnabled={true}
                stage={stage}
                setStage={setStage}
            />
            <ResetDefaultsForm
                setError={setError}
                setStreams={setStreams}
            />
            {
                streams && streams?.subtitle?.length > 0 &&
                <PickStreamsForm
                    streams={streams}
                    setError={setError}
                    setMessage={setMessage}
                />
            }
            <SuccessMessage message={message} />
        </FormContainer>
    )
}

export default SetStreams