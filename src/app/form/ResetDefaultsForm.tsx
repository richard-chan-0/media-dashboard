import { postForm } from "../lib/api";
import { ffmpegLink } from "../lib/constants";
import { FormEvent } from "react";
import theme from "../lib/theme";
import FormContainer from "./FormContainer";
import SubmitButton from "../lib/components/SubmitButton";

type ResetDefaultsFormProps = {
    setError: CallableFunction
    setStreams: CallableFunction
    setPathToFiles: CallableFunction
    pathToFiles: string
}

const ResetDefaultsForm = ({ setError, setStreams, pathToFiles, setPathToFiles }: ResetDefaultsFormProps) => {

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (ffmpegLink) {
            const formData = new FormData();
            formData.append("path", pathToFiles);
            const response = await postForm(`${ffmpegLink}/default_reset/read`, formData)
            if (response?.error) {
                setError(response?.error);
            } else {
                setStreams(response);
                setError("");
            }
        }
    };


    return (
        <FormContainer size={0}>
            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-2">
                <label>Get Streams</label>
                <input
                    type="text"
                    value={pathToFiles}
                    onChange={(e) => setPathToFiles(e.target.value)}
                    placeholder="Enter path to files"
                    required
                    className={`border p-2 w-full rounded-t-lg ${theme.appSecondaryColor}`}
                />
                <SubmitButton label={"Get Streams"} />
            </form>
        </FormContainer>
    );
};

export default ResetDefaultsForm;