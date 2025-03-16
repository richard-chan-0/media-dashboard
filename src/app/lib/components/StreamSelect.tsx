type StreamSelectProps = {
    select: string
    label: string
    setSelect: CallableFunction
    selections: object[]
    createVal: CallableFunction
    isCenterAlign?: boolean
}
const StreamSelect = ({ label, select, setSelect, selections, createVal, isCenterAlign }: StreamSelectProps) => {
    return (
        <div className={`flex w-full gap-2 ${isCenterAlign ? "justify-center" : ""} items-center`}>
            <label htmlFor="selectStream" className="text-wrap w-1/3 text-sm">{label}</label>
            <select
                id="selectStream"
                value={select}
                onChange={(e) => setSelect(e.target.value)}
                className="border rounded-md p-2 w-1/2"
            >
                <option value="" disabled>Select an option</option>
                {selections.map((option) => {
                    const optionVal = createVal(option);
                    return < option key={optionVal} value={optionVal} > {optionVal}</option>
                })}
            </select>
        </div>
    )
}

export default StreamSelect;