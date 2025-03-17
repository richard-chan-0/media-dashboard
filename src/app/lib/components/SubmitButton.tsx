import { getWidthSize } from "../utilities";

type SubmitButtonProps = {
    label: string,
    size?: number
};

const SubmitButton = ({ label, size }: SubmitButtonProps) => {
    const width = getWidthSize(size);
    return (
        <button type="submit" className={`bg-blue-500 hover:bg-blue-600 active:bg-blue-800 disabled:bg-gray-200 text-white p-2 ${width} rounded-lg`} >
            {label}
        </button>
    )
}

export default SubmitButton;