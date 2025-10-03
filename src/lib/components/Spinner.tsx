import { Refresh } from "iconoir-react";
import theme from "../theme";

const Spinner = () => {
    return (
        <div className={`flex items-center p-2 rounded-4xl ${theme.shadowBorder}`}>
            <Refresh className={`animate-spin text-white stroke-2 h-4`} />
            Processing
        </div>
    )
}

export default Spinner;