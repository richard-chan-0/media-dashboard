import Exception from "../lib/components/Exception";
import { useState } from "react";
import ResetDefaultsForm from "../form/ResetDefaultsForm";
import PickStreamsForm from "../form/PickStreamsForm";
import SuccessMessage from "../lib/components/SuccessMessage";

const FfmpegPage = () => {
    const [error, setError] = useState("");
    const [pathToFiles, setPathToFiles] = useState("");
    const [message, setMessage] = useState("");
    const [streams, setStreams] = useState({ attachment: [], subtitle: [], audio: [] });

    return (
        <div className="flex flex-col items-center">
            <div className={`flex justify-center gap-4 m-4`}>
                <ResetDefaultsForm
                    setError={setError}
                    setStreams={setStreams}
                    setPathToFiles={setPathToFiles}
                    pathToFiles={pathToFiles}
                />
                {
                    streams && Object.keys(streams).length > 0 &&
                    <PickStreamsForm
                        streams={streams}
                        setError={setError}
                        pathToFiles={pathToFiles}
                        setPathToFiles={setPathToFiles}
                        setMessage={setMessage}
                    />}
            </div>
            <Exception error={error} />
            <SuccessMessage message={message} />
        </div>

    );
};

export default FfmpegPage;