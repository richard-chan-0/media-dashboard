import { render } from "@testing-library/react";
import { RenameProvider } from "../../service/rename/RenameProvider";


export function renderWithProvider(ui: React.ReactElement) {
    return render(<RenameProvider>{ui}</RenameProvider>);
}