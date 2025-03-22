import { postForm } from "../lib/api";
import { ffmpegLink } from "../lib/constants";
import { FormEvent } from "react";
import FormContainer from "./FormContainer";
import SubmitButton from "../lib/components/SubmitButton";
import FormInput from "../lib/components/FormInput";

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
        <FormContainer size={0} >
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <label>Get Streams</label>
                <FormInput
                    type="text"
                    inputValue={pathToFiles}
                    setInputValue={setPathToFiles}
                    placeholder="Enter path to files"
                    required
                />
                <SubmitButton label={"Get Streams"} />
            </form>
        </FormContainer>
    );
};

export default ResetDefaultsForm;