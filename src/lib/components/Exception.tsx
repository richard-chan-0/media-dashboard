import { useRename } from "../hooks/usePageContext";
import CloseButton from "./CloseButton";
import React from "react";

type ExceptionProps = {
    error: string;
};

const parseError = (error: string) => {
    try {
        return JSON.parse(error);
    } catch {
        return { message: error, name: "Error", stack: "" };
    }
}

const Exception = ({ error }: ExceptionProps) => {
    const { pageDispatch: errorDispatch } = useRename();
    const [isShowStack, setIsShowStack] = React.useState(false);
    if (!error) {
        return <></>;
    }

    const errorDict = parseError(error);

    return (
        <div className="flex w-full bg-red-300 p-2 text-red-600 text-left opacity-80">
            <div className="flex flex-col flex-1">
                <div>Error Message: {errorDict.message}</div>
                <div>Error Name: {errorDict.name}</div>
                {isShowStack && <div>Error Stack: {errorDict.stack}</div>}
                <button
                    className="underline text-blue-900 hover:text-blue-600 w-fit"
                    onClick={() => setIsShowStack(!isShowStack)}
                >
                    {isShowStack ? "Hide Stack Trace" : "Show Stack Trace"}
                </button>
            </div>
            <CloseButton className="text-red-700 hover:text-red-600 flex w-fit justify-end" onClose={() => errorDispatch({ type: "CLEAR_ERROR" })} />
        </div>
    );
};

export default Exception;
