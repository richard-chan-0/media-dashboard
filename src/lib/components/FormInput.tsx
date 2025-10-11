import theme from "../theme";

export type FormInputProps = {
    type: string;
    inputValue: string;
    setInputValue: CallableFunction;
    placeholder?: string;
    required?: boolean;
};

const FormInput = ({
    type,
    inputValue,
    setInputValue,
    placeholder,
    required,
}: FormInputProps) => {
    return (
        <input
            type={type}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            required={required}
            className={`border p-2 ${theme.roundedBorder} ${theme.appSecondaryColor} text-sm text-center`}
        />
    );
};

export default FormInput;
