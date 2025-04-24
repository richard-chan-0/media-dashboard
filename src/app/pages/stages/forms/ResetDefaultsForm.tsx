import { get } from "../../../lib/api";
import { ffmpegLink } from "../../../lib/constants";
import { FormEvent } from "react";
import FormContainer from "./FormContainer";
import SubmitButton from "../../../lib/components/SubmitButton";
import { useRename } from "../../../pages/hooks/useRename";

type ResetDefaultsFormProps = {
    setStreams: CallableFunction
}

const ResetDefaultsForm = ({ setStreams }: ResetDefaultsFormProps) => {
    const { dispatch } = useRename();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!ffmpegLink) {
            dispatch({ type: "SET_ERROR", payload: "ffmpeg api not defined" });
            return;
        }

        const response = await get(`${ffmpegLink}/read`);
        if (response?.error) {
            dispatch({ type: "SET_ERROR", payload: response.error });
        } else {
            setStreams(response);
            dispatch({ type: "CLEAR_ERROR" });
        }

    };


    return (
        <FormContainer size={0} isBorderEnabled={false} containerStyle="flex flex-col items-center w-full">
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <label>Get Streams</label>
                <SubmitButton label="Pull" type="submit" />
            </form>
        </FormContainer>
    );
};

export default ResetDefaultsForm;