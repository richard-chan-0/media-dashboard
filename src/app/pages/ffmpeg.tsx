import { useState } from "react";
import ResetDefaultsForm from "../form/ResetDefaultsForm";
import PickStreamsForm from "../form/PickStreamsForm";
import SuccessMessage from "../lib/components/SuccessMessage";
import FormPage from "./formPage";

const FfmpegPage = () => {
    const [error, setError] = useState("");
    const [pathToFiles, setPathToFiles] = useState("");
    const [message, setMessage] = useState("");
    const [streams, setStreams] = useState({ attachment: [], subtitle: [], audio: [] });

    return (
        <FormPage error={error}>
            <ResetDefaultsForm
                setError={setError}
                setStreams={setStreams}
                setPathToFiles={setPathToFiles}
                pathToFiles={pathToFiles}
            />
            {
                streams && streams?.subtitle?.length > 0 &&
                <PickStreamsForm
                    streams={streams}
                    setError={setError}
                    pathToFiles={pathToFiles}
                    setPathToFiles={setPathToFiles}
                    setMessage={setMessage}
                />
            }
            <SuccessMessage message={message} />
        </FormPage>
    );
};

export default FfmpegPage;