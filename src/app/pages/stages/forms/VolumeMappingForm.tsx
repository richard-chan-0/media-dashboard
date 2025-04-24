import { FormEvent, useState } from "react";
import theme from "../../../lib/theme";

type VolumeMappingFormInputProps = {
    label: string;
    value: string;
    setValue: CallableFunction;
};

const VolumeMappingFormInput = ({
    label,
    value,
    setValue,
}: VolumeMappingFormInputProps) => {
    return (
        <div className="flex flex-col w-1/4">
            <label className="text-center">{label}</label>
            <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
                className={`border border-blue-200 text-center ${theme.appSecondaryColor}`}
            />
        </div>
    );
};

type VolumeMappingFormProps = {
    setVolumesMapping: CallableFunction;
};
const VolumeMappingForm = ({
    setVolumesMapping: setVolumeMapping,
}: VolumeMappingFormProps) => {
    const [volumeNumber, setVolumeNumber] = useState("");
    const [startChapter, setStartChapter] = useState("");
    const [endChapter, setEndChapter] = useState("");

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault(); // Prevents form from reloading the page
        setVolumeMapping((prev: object) => ({
            ...prev,
            [volumeNumber]: {
                startChapter,
                endChapter,
            },
        }));
        setVolumeNumber("");
        setStartChapter("");
        setEndChapter("");
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row md:gap-3 gap-2 items-center w-full"
        >
            <VolumeMappingFormInput
                label={"Enter volume number"}
                value={volumeNumber}
                setValue={setVolumeNumber}
            />
            <VolumeMappingFormInput
                label={"Enter start number"}
                value={startChapter}
                setValue={setStartChapter}
            />
            <VolumeMappingFormInput
                label={"Enter end number"}
                value={endChapter}
                setValue={setEndChapter}
            />
            <button
                type="submit"
                className="text-xs pt-2 pb-2 w-1/4 bg-blue-500 hover:bg-blue-600 active:bg-blue-800 disabled:bg-gray-200 text-white rounded-lg items-center text-wrap"
            >
                Add/Update
            </button>
        </form>
    );
};

export default VolumeMappingForm;
