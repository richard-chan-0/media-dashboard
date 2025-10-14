import { BaseSyntheticEvent, useState } from "react";
import { Stream } from "../../../lib/types";

type StreamCheckboxListProps = {
    checkedStreams: string[];
    label: string;
    setCheckedStreams: React.Dispatch<React.SetStateAction<string[]>>;
    streams: Stream[];
    createVal: (option: Stream) => string;
};

const DISPLAY_LIMIT = 5;

const StreamCheckboxList = ({
    label,
    checkedStreams,
    setCheckedStreams,
    streams,
    createVal,
}: StreamCheckboxListProps) => {
    const [showAll, setShowAll] = useState(false);

    const handleChange = (e: BaseSyntheticEvent) => {
        const checkIndex = e.target.value;
        if (checkedStreams.includes(checkIndex)) {
            setCheckedStreams(
                checkedStreams.filter((stream) => stream !== checkIndex),
            );
        } else {
            setCheckedStreams([...checkedStreams, checkIndex]);
        }
    };

    const displayedStreams = showAll ? streams : streams.slice(0, DISPLAY_LIMIT);

    return (
        <fieldset className="flex flex-wrap justify-evenly">
            <legend className="text-sm">{label}</legend>
            {displayedStreams.map((option: Stream) => {
                const optionVal = createVal(option);
                const isChecked = checkedStreams.includes(
                    option.stream_number.toString(),
                );
                return (
                    <label key={optionVal} className="flex gap-2 hover:text-blue-400">
                        <input
                            type="checkbox"
                            value={option.stream_number}
                            checked={isChecked}
                            onChange={handleChange}
                        />
                        {optionVal}
                    </label>
                );
            })}
            {streams.length > DISPLAY_LIMIT && (
                <button
                    type="button"
                    onClick={() => setShowAll(!showAll)}
                    className="text-blue-500 hover:text-blue-400 underline text-sm"
                >
                    {showAll ? "Show Less" : "Show More"}
                </button>
            )}
        </fieldset>
    );
};

export default StreamCheckboxList;
