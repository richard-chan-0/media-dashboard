import { BaseSyntheticEvent, SyntheticEvent } from "react";
import { Stream } from "../../form/PickStreamsForm";

type StreamCheckboxListProps = {
    checkedStreams: string[]
    label: string
    setCheckedStreams: CallableFunction
    streams: Stream[]
    createVal: CallableFunction
}

const StreamCheckboxList = ({
    label, checkedStreams, setCheckedStreams, streams, createVal
}: StreamCheckboxListProps) => {

    const handleChange = (e: BaseSyntheticEvent) => {
        const checkIndex = e.target.value;
        if (checkedStreams.includes(checkIndex)) {
            setCheckedStreams(checkedStreams.filter((stream) => stream !== checkIndex));
        } else {
            setCheckedStreams([...checkedStreams, checkIndex]);
        }
    }

    return (
        <fieldset className="flex flex-col  gap-2">
            <legend className="text-sm">{label}</legend>
            {streams.map((option: Stream) => {
                const optionVal = createVal(option);
                const isChecked = checkedStreams.includes(option.stream_number.toString());
                return (
                    <label key={optionVal} className="flex gap-2">
                        <input
                            type="checkbox"
                            value={option.stream_number}
                            checked={isChecked}
                            onChange={handleChange}
                        />
                        {optionVal}
                    </label>
                )
            })}

        </fieldset>
    )
}

export default StreamCheckboxList;