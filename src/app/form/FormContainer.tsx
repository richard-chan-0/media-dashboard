import { ReactNode } from "react";
import theme from "../lib/theme";
import { getWidthSize } from "../lib/utilities";

type FormContainerProps = {
    children: ReactNode
    size?: number
    containerStyle?: string
    formTitle?: string
    isBorderEnabled?: boolean
}

const FormContainer = ({ children, size, containerStyle, formTitle, isBorderEnabled = true }: FormContainerProps) => {
    const containerSize = getWidthSize(size);
    return (
        <div
            className={`p-4 ${containerSize} ${isBorderEnabled ? "border border-blue-400 rounded-2xl shadow-blue-200 shadow-md" : ""} ${theme.appColor} ${containerStyle}`}
        >
            {formTitle &&
                <>
                    <h1 className="text-center">{formTitle}</h1>
                </>}
            {children}
        </div>
    )
}

export default FormContainer;