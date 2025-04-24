import { Stream } from "../../pages/stages/forms/PickStreamsForm";

type StreamSelectProps = {
    select: string
    label: string
    setSelect: CallableFunction
    selections: Stream[]
    createVal: CallableFunction
    isCenterAlign?: boolean
    isRequired?: boolean
}
const StreamSelect = ({ label, select, setSelect, selections, createVal, isCenterAlign, isRequired }: StreamSelectProps) => {
    return (
        <div className={`flex w-full gap-2 ${isCenterAlign ? "justify-center" : ""} items-center`}>
            <label htmlFor="selectStream" className="text-wrap w-1/3 text-sm">{label}</label>
            <select
                id="selectStream"
                value={select}
                onChange={(e) => setSelect(e.target.value)}
                required={isRequired || false}
                className="border rounded-md p-2 w-1/2"
            >
                <option value="" disabled>Select an option</option>
                {selections.map((option) => {
                    const optionVal = createVal(option);
                    return < option key={option.stream_number} value={option.stream_number} > {optionVal}</option>;
                })}
            </select>
        </div>
    );
};

export default StreamSelect;