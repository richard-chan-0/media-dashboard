import { ReactNode } from "react"
import Exception from "../lib/components/Exception"

type FormPageProps = {
    children: ReactNode
    error?: string
    isColumn?: boolean
    pageStyle?: string
}

const FormPage = ({
    children,
    error,
    isColumn = true,
    pageStyle
}: FormPageProps) => {
    return (
        <div className={`flex ${isColumn ? "flex-col" : ""} items-center m-4 gap-4 ${pageStyle}`}>
            {error && <Exception error={error} />}
            {children}
        </div>
    )
}

export default FormPage