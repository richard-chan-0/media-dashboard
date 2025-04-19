import { useState } from "react";
import PickStreamsForm from "../forms/PickStreamsForm"
import ResetDefaultsForm from "../forms/ResetDefaultsForm"
import SuccessMessage from "../lib/components/SuccessMessage"
import FormContainer from "../forms/FormContainer";
import StageNavButtons from "./stageNavButtons";

type SetStreamsProps = {
    setError: React.Dispatch<React.SetStateAction<string>>;
    stageDispatcher: React.ActionDispatch<[action: string]>;
}

const SetStreams = ({ stageDispatcher, setError }: SetStreamsProps) => {
    const [message, setMessage] = useState("");
    const [streams, setStreams] = useState({ attachment: [], subtitle: [], audio: [] });

    return (
        <FormContainer size={3} containerStyle="flex flex-col gap-4">
            <StageNavButtons
                leftLabel="Back"
                rightLabel="Reset"
                isLeftEnabled={true}
                isRightEnabled={true}
                stageDispatcher={stageDispatcher}
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