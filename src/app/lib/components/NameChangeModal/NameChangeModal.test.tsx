import { render, screen, fireEvent } from "@testing-library/react";
import NameChangeModal from "./NameChangeModal";
import { RenameProvider } from "../../../pages/provider/RenameProvider";
import { vi, describe, it, } from "vitest";

const renderWithProvider = (ui: React.ReactElement) => {
    return render(<RenameProvider>{ui}</RenameProvider>);
};

describe("NameChangeModal", () => {
    const defaultProps = {
        isOpen: true,
        onClose: vi.fn(),
        initialName: "test.mp4",
    };

    it("renders when open", () => {
        renderWithProvider(<NameChangeModal {...defaultProps} />);
        expect(screen.getByLabelText(/Name:/)).toBeInTheDocument();
        expect(screen.getByDisplayValue("test.mp4")).toBeInTheDocument();
    });

    // it("does not render when closed", () => {
    //     renderWithProvider(<NameChangeModal {...defaultProps} isOpen={false} />);
    //     expect(screen.queryByLabelText(/Name:/)).not.toBeInTheDocument();
    // });

    // it("calls onClose when clicking the close button", () => {
    //     renderWithProvider(<NameChangeModal {...defaultProps} />);
    //     const closeButton = screen.getByRole("button", { name: "" }); // The icon button has no accessible name
    //     fireEvent.click(closeButton);
    //     expect(defaultProps.onClose).toHaveBeenCalled();
    // });

    // it("updates input value when typing", () => {
    //     renderWithProvider(<NameChangeModal {...defaultProps} />);
    //     const input = screen.getByDisplayValue("test.mp4");
    //     fireEvent.change(input, { target: { value: "newname.mp4" } });
    //     expect(input).toHaveValue("newname.mp4");
    // });

    // it("calls handleSubmit and closes modal on update", () => {
    //     const onClose = vi.fn();
    //     renderWithProvider(<NameChangeModal {...defaultProps} onClose={onClose} />);
    //     const input = screen.getByDisplayValue("test.mp4");
    //     fireEvent.change(input, { target: { value: "updated.mp4" } });
    //     const updateButton = screen.getByRole("button", { name: /Update/i });
    //     fireEvent.click(updateButton);
    //     expect(onClose).toHaveBeenCalled();
    // });
});