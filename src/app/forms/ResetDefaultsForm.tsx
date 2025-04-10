import { get } from "../lib/api";
import { ffmpegLink } from "../lib/constants";
import { FormEvent } from "react";
import FormContainer from "./FormContainer";
import SubmitButton from "../lib/components/SubmitButton";

type ResetDefaultsFormProps = {
    setError: CallableFunction
    setStreams: CallableFunction
}

const ResetDefaultsForm = ({ setError, setStreams }: ResetDefaultsFormProps) => {

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (ffmpegLink) {
            const response = await get(`${ffmpegLink}/read`)
            if (response?.error) {
                setError(response?.error);
            } else {
                setStreams(response);
                setError("");
            }
        }
    };


    return (
        <FormContainer size={0} isBorderEnabled={false} containerStyle="flex flex-col items-center w-full">
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <label>Get Streams</label>
                <SubmitButton label="Pull" />
            </form>
        </FormContainer>
    );
};

export default ResetDefaultsForm;