import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import RenameComicsForm from "./RenameComicsForm";
import '@testing-library/jest-dom';
import { RenameContext } from "../../RenameContext";
import { COMICS } from "../../../../lib/constants";
import { FormInputProps } from "../../../../lib/components/FormInput";
import { FileUploaderProps } from "../../../../lib/components/FileUploader";
import { ProgressBarProps } from "../../../../lib/components/ProgressBar/ProgressBar";
import { UploadPreviewProps } from "../../../../lib/components/UploadPreview";
import { UploadAction, UploadState } from "../../../../lib/reducers/uploadReducer";

const dispatch = vi.fn();
const pageDispatch = vi.fn();
const initialContext = { state: { nameChanges: { changes: [] }, mediaType: COMICS }, dispatch, pageState: { previewFiles: [], error: "" }, pageDispatch }

vi.mock("../../../../lib/api/api", () => ({
    postForm: vi.fn(),
    processApiResponseToNameChange: vi.fn((resp) => resp),
}));
vi.mock("../../../../lib/constants", () => ({
    inputStartVolumeMessage: "Enter start volume",
    inputStoryNameMessage: "Enter story name",
    mediaLink: "http://localhost/api",
    no_api_error: "No API link",
    COMICS: "comics",
}));
vi.mock("../../../../lib/components/UploadPreview", () => ({
    __esModule: true,
    default: ({ files, deleteFile }: UploadPreviewProps) => (
        <div data-testid="upload-preview">
            {files.map((name: string) => (
                <div key={name}>
                    {name}
                    <button onClick={() => deleteFile(name)}>Delete</button>
                </div>
            ))}
        </div>
    ),
}));
vi.mock("../../../../lib/components/FormInput", () => ({
    __esModule: true,
    default: ({ inputValue, setInputValue, placeholder, type }: FormInputProps) => (
        <input
            type={type}
            value={inputValue}
            placeholder={placeholder}
            onChange={(e) => setInputValue(e.target.value)}
            data-testid={placeholder}
        />
    ),
}));
vi.mock("../../../../lib/components/FileUploader", () => ({
    __esModule: true,
    default: ({ onDrop }: FileUploaderProps) => (
        <button
            onClick={() =>
                onDrop([new File(["dummy content"], "comic1.cbz", { type: "application/zip" })])
            }
            data-testid="file-uploader"
        >
            Upload Files
        </button>
    ),
}));
vi.mock("../../../../lib/components/ProgressBar/ProgressBar", () => ({
    __esModule: true,
    default: ({ isInProgress }: ProgressBarProps) =>
        isInProgress ? <div data-testid="progress-bar">Uploading...</div> : null,
}));
vi.mock("../../../hooks/useRename", () => ({
    useRename: () => ({
        state: { previewFiles: [], error: "", nameChanges: { changes: [] } },
        dispatch,
    }),
}));
vi.mock("../../../state/uploadReducer", () => ({
    uploadReducer: (state: UploadState, action: UploadAction) => {
        switch (action.type) {
            case "START_UPLOAD":
                return { ...state, isUploading: true };
            case "RESET_UPLOAD":
                return { ...state, isUploading: false, uploadPercent: 0 };
            default:
                return state;
        }
    },
}));

const renderWithContext = (props = {}) => {
    return render(
        <RenameContext.Provider value={initialContext}>
            <RenameComicsForm stageDispatcher={vi.fn()} {...props} />
        </RenameContext.Provider>
    );
};

describe("RenameComicsForm", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders form inputs and submit button", () => {
        renderWithContext();
        expect(screen.getByPlaceholderText("Enter story name")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Enter start volume")).toBeInTheDocument();
        expect(screen.getByText("Submit Files!")).toBeInTheDocument();
    });

    it("calls onDrop and shows file preview", async () => {
        renderWithContext();
        fireEvent.click(screen.getByTestId("file-uploader"));
        expect(await screen.findByTestId("upload-preview")).toBeInTheDocument();
        expect(screen.getByText("comic1.cbz")).toBeInTheDocument();
    });

    it("removes file from preview when delete is clicked", async () => {
        renderWithContext();
        fireEvent.click(screen.getByTestId("file-uploader"));
        const deleteBtn = await screen.findByText("Delete");
        fireEvent.click(deleteBtn);
        await waitFor(() => {
            expect(screen.queryByText("comic1.cbz")).not.toBeInTheDocument();
        });
    });

    it("shows error if story name is missing on submit", async () => {
        render(
            <RenameContext.Provider value={initialContext}>
                <RenameComicsForm stageDispatcher={vi.fn()} />
            </RenameContext.Provider>
        );
        fireEvent.click(screen.getByTestId("file-uploader"));
        fireEvent.click(screen.getByText("Submit Files!"));
        await waitFor(() => {
            expect(pageDispatch).toHaveBeenCalledWith({ type: "SET_ERROR", payload: "story title is required" });
        });
    });

    it("submits form and resets state on success", async () => {
        const { postForm } = await import("../../../../lib/api/api");
        const { processApiResponseToNameChange } = await import("../../../../lib/api/api");
        (postForm as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({ success: true });
        (processApiResponseToNameChange as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ changes: ["foo"] });

        const stageDispatcher = vi.fn();
        render(
            <RenameContext.Provider value={initialContext}>
                <RenameComicsForm stageDispatcher={stageDispatcher} />
            </RenameContext.Provider>
        );
        fireEvent.change(screen.getByPlaceholderText("Enter story name"), { target: { value: "My Comic" } });
        fireEvent.change(screen.getByPlaceholderText("Enter start volume"), { target: { value: "1" } });
        fireEvent.click(screen.getByTestId("file-uploader"));
        fireEvent.click(screen.getByText("Submit Files!"));

        await waitFor(() => {
            expect(postForm).toHaveBeenCalled();
            expect(dispatch).toHaveBeenCalledWith({ type: "SET_NAME_CHANGES", payload: { changes: ["foo"] } });
            expect(stageDispatcher).toHaveBeenCalledWith("next");
        });
    });

    it("shows progress bar when uploading", async () => {
        renderWithContext();
        fireEvent.click(screen.getByTestId("file-uploader"));
        fireEvent.change(screen.getByPlaceholderText("Enter story name"), { target: { value: "My Comic" } });
        fireEvent.change(screen.getByPlaceholderText("Enter start volume"), { target: { value: "1" } });
        fireEvent.click(screen.getByText("Submit Files!"));
        screen.debug();
        expect(screen.queryByTestId("progress-bar")).toBeInTheDocument();
    });
});