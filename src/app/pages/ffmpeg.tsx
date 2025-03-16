import Exception from "../lib/components/Exception";
import { useState } from "react";
import ResetDefaultsForm from "../form/ResetDefaultsForm";
import PickStreamsForm from "../form/PickStreamsForm";

const FfmpegPage = () => {
    const [error, setError] = useState("");
    const [streams, setStreams] = useState({});

    return (
        <>
            <div className={`flex justify-center gap-4 m-4`}>
                <ResetDefaultsForm setError={setError} setStreams={setStreams} />
                {streams && Object.keys(streams).length > 0 && <PickStreamsForm streams={streams} />}
            </div>
            <Exception error={error} />
        </>

    );
};

export default FfmpegPage;