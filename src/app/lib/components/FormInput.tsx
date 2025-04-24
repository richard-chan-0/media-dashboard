import theme from "../theme";

type FormInputProps = {
    type: string
    inputValue: string
    setInputValue: CallableFunction
    placeholder?: string
    required?: boolean
}

const FormInput = ({ type, inputValue, setInputValue, placeholder, required }: FormInputProps) => {
    return (
        <input
            type={type}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            required={required}
            className={`border p-2 w-1/2 rounded-sm ${theme.appSecondaryColor} text-sm text-center`}
        />
    );
};

export default FormInput;