import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import NameChangePreview from "./NameChangePreview";
import * as api from "../../../../lib/api/api";
import * as usePageContext from "../../../../lib/hooks/usePageContext";
import { COMICS, VIDEOS, TASK_EDIT, TASK_MERGE } from "../../../../lib/constants";
import '@testing-library/jest-dom';
import { renderWithProvider } from "../../../../lib/test/renameRenderer";

vi.mock("../../../../lib/constants", async (importOriginal) => {
    const actual = await importOriginal<typeof import("../../../../lib/constants")>();
    return {
        ...actual,
        mediaLink: "http://localhost/api", // <-- mock API link
        ffmpegLink: "http://localhost/ffmpeg", // <-- added mock ffmpeg API link
        no_api_error: "No API link",
    };
});


const mockState = {
    nameChanges: { changes: [{ input: "a.mp4", output: "b.mp4" }] },
    mediaType: VIDEOS,
};

const mockPageState = {
    error: "",
    previewFiles: [],
};

describe("NameChangePreview", () => {
    let useRenameMock: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        vi.clearAllMocks();
        useRenameMock = vi.spyOn(usePageContext, "useRename").mockReturnValue({
            pageState: mockPageState,
            state: mockState,
            dispatch: vi.fn(),
            pageDispatch: vi.fn(),
        });

    });

    it("renders the table and submit button when there are name changes", () => {
        renderWithProvider(<NameChangePreview changeType={TASK_EDIT} />);
        expect(screen.getByText("Onboard Files")).toBeInTheDocument();
        expect(screen.getByText("Submit Edits!")).toBeInTheDocument();
        expect(screen.getByText("a.mp4")).toBeInTheDocument();
        expect(screen.getByText("b.mp4")).toBeInTheDocument();
    });

    it("shows 'No files to rename.' when there are no name changes", () => {
        useRenameMock.mockReturnValue({
            state: {
                mediaType: VIDEOS,
                nameChanges: { changes: [] },
            },
            dispatch: vi.fn(),
            pageDispatch: vi.fn(),
            pageState: mockPageState,
        });
        renderWithProvider(<NameChangePreview changeType={TASK_EDIT} />);
        expect(screen.getByText("No files to rename.")).toBeInTheDocument();
    });

    it("calls handleEditSubmit and processes success path", async () => {
        vi.spyOn(api, "postJson").mockResolvedValue({}); // Mock successful API response
        const dispatch = vi.fn();
        const pageDispatch = vi.fn();
        useRenameMock.mockReturnValue({
            state: mockState,
            dispatch,
            pageDispatch,
            pageState: mockPageState,
        });

        renderWithProvider(<NameChangePreview changeType={TASK_EDIT} />);
        fireEvent.click(screen.getByText("Submit Edits!"));

        await waitFor(() => {
            expect(dispatch).toHaveBeenCalledWith({ type: "CLEAR_NAME_CHANGES" });
        });
    });

    it("handles API error response for edits", async () => {
        const errorMsg = "API error";
        vi.spyOn(api, "postJson").mockResolvedValue({ error: errorMsg });
        const dispatch = vi.fn();
        const pageDispatch = vi.fn();
        useRenameMock.mockReturnValue({
            state: mockState,
            dispatch,
            pageDispatch,
            pageState: mockPageState,
        });

        renderWithProvider(<NameChangePreview changeType={TASK_EDIT} />);
        fireEvent.click(screen.getByText("Submit Edits!"));

        await waitFor(() => {
            expect(pageDispatch).toHaveBeenCalledWith({ type: "SET_ERROR", payload: errorMsg });
        });
    });

    it("calls handleMergeSubmit and processes success path", async () => {
        vi.spyOn(api, "postJson").mockResolvedValue({}); // Mock successful API response
        const pageDispatch = vi.fn();
        useRenameMock.mockReturnValueOnce({
            state: mockState,
            dispatch: vi.fn(),
            pageDispatch,
            pageState: mockPageState,
        });

        renderWithProvider(<NameChangePreview changeType={TASK_MERGE} />);
        fireEvent.click(screen.getByText("Submit Merges!"));

        await waitFor(() => {
            expect(pageDispatch).not.toHaveBeenCalledWith({ type: "SET_ERROR", payload: expect.anything() });
        });
    });

    it("calls regular rename API when no metadata changes exist", async () => {
        const postJsonMock = vi.spyOn(api, "postJson").mockResolvedValue({});
        const dispatch = vi.fn();
        const pageDispatch = vi.fn();
        useRenameMock.mockReturnValueOnce({
            state: mockState,
            dispatch,
            pageDispatch,
            pageState: mockPageState,
        });

        renderWithProvider(<NameChangePreview changeType={TASK_EDIT} />);
        fireEvent.click(screen.getByText("Submit Edits!"));

        await waitFor(() => {
            expect(postJsonMock).toHaveBeenCalledWith(
                "http://localhost/api/rename/process",
                expect.anything()
            );
        });
    });

    it("posts metadata merge changes correctly", async () => {
        const postJsonMock = vi.spyOn(api, "postJson").mockResolvedValue({});
        const pageDispatch = vi.fn();
        useRenameMock.mockReturnValueOnce({
            state: mockState,
            dispatch: vi.fn(),
            pageDispatch,
            pageState: mockPageState,
        });

        renderWithProvider(<NameChangePreview changeType={TASK_MERGE} />);
        fireEvent.click(screen.getByText("Submit Merges!"));

        await waitFor(() => {
            expect(postJsonMock).toHaveBeenCalledWith(
                "http://localhost/ffmpeg/mkv/merge",
                expect.anything()
            );
        });
    });

    it("uses correct navProps for COMICS", () => {
        useRenameMock.mockReturnValueOnce({
            state: {
                ...mockState,
                mediaType: COMICS,
            },
            dispatch: vi.fn(),
            pageDispatch: vi.fn(),
            pageState: mockPageState,
        });
        renderWithProvider(<NameChangePreview changeType={TASK_EDIT} />);
        // No right button for comics
        expect(screen.queryByText("Skip")).not.toBeInTheDocument();
        expect(screen.queryByText("Next")).not.toBeInTheDocument();
    });
});