import { ReactNode } from "react"
import Exception from "../lib/components/Exception"

type FormPageProps = {
    children: ReactNode
    error?: string
}

const FormPage = ({ children, error }: FormPageProps) => {
    return (
        <div className="flex flex-col items-center m-4">
            {error && <Exception error={error} />}
            {children}
        </div>
    )
}

export default FormPage