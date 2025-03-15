import Exception from "../lib/components/Exception";
import { useState } from "react";
import ResetDefaultsForm from "../form/ResetDefaultsForm";

const FfmpegPage = () => {
    const [error, setError] = useState("");

    return (
        <div className={`flex justify-center`}>
            <ResetDefaultsForm setError={setError} />
            <Exception error={error} />
        </div>
    );
};

export default FfmpegPage;