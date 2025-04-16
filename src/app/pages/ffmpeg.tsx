import { useState } from "react";
import ResetDefaultsForm from "../forms/ResetDefaultsForm";
import PickStreamsForm from "../forms/PickStreamsForm";
import SuccessMessage from "../lib/components/SuccessMessage";
import FormPage from "./formPage";

const FfmpegPage = () => {
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [streams, setStreams] = useState({ attachment: [], subtitle: [], audio: [] });

    return (
        <FormPage error={error}>
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
        </FormPage>
    );
};

export default FfmpegPage;