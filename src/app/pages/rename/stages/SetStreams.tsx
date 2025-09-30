import { useState } from "react";
import PickStreamsForm from "../form/PickStreamsForm";
import ResetDefaultsForm from "../form/ResetDefaultsForm";
import SuccessMessage from "../../../lib/components/SuccessMessage";
import FormContainer from "../../../lib/components/FormContainer";
import StageNavButtons from "./StageNavButtons";

type SetStreamsProps = {
    stageDispatcher: React.ActionDispatch<[action: string]>;
};

const SetStreams = ({ stageDispatcher }: SetStreamsProps) => {
    const [message, setMessage] = useState("");
    const [streams, setStreams] = useState({
        attachment: [],
        subtitle: [],
        audio: [],
    });

    return (
        <FormContainer size={3} containerStyle="flex flex-col gap-4">
            <StageNavButtons
                leftLabel="Back"
                rightLabel="Reset"
                isLeftEnabled={true}
                isRightEnabled={true}
                leftButtonAction={() => stageDispatcher("prev")}
                rightButtonAction={() => stageDispatcher("reset")}
            />
            <ResetDefaultsForm setStreams={setStreams} />
            {streams && streams?.subtitle?.length > 0 && (
                <PickStreamsForm streams={streams} setMessage={setMessage} />
            )}
            <SuccessMessage message={message} />
        </FormContainer>
    );
};

export default SetStreams;
