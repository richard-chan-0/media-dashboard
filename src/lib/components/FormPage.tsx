import { ReactNode } from "react";
import Exception from "./Exception";

type FormPageProps = {
    children: ReactNode;
    error?: string;
    isColumn?: boolean;
    pageStyle?: string;
};

const FormPage = ({
    children,
    error,
    isColumn = true,
    pageStyle,
}: FormPageProps) => {
    return (
        <>
            {error && <Exception error={error} />}
            <main
                className={`flex ${isColumn ? "flex-col" : ""} items-center gap-4 ${pageStyle}`}
            >
                {children}
            </main>
        </>
    );
};

export default FormPage;
