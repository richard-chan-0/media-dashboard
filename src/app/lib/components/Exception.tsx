import { useRename } from "../../pages/hooks/useRename";
import CloseButton from "./CloseButton";

type ExceptionProps = {
    error: string;
};

const Exception = ({ error }: ExceptionProps) => {
    const { dispatch } = useRename();
    if (!error) {
        return <></>;
    }

    return (
        <div className="flex items-center justify-between w-full bg-red-300 p-2 text-red-600 text-center opacity-80">
            Exception: {error}
            <CloseButton className="text-red-700 hover:text-red-600" onClose={() => dispatch({ type: "CLEAR_ERROR" })} />
        </div>
    );
};

export default Exception;
