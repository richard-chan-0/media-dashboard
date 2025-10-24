import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import RenamePanel from "./RenamePanel";
import { TASK_RENAME, VIDEOS, COMICS, TASK_EDIT } from "../../../../lib/constants";
import { renderWithProvider } from "../../../../lib/test/renameRenderer";

describe("RenamePanel", () => {
    it("renders the RenamePanel component", () => {
        const setRenameMediaMock = vi.fn();
        const setTaskMock = vi.fn();
        const setEditTypeMock = vi.fn();

        renderWithProvider(
            <RenamePanel
                task={TASK_RENAME}
                renameMedia={VIDEOS}
                setTask={setTaskMock}
                setRenameMedia={setRenameMediaMock}
                editType={TASK_EDIT}
                setEditType={setEditTypeMock}
            />
        );

        expect(screen.getByText("Media Type")).toBeInTheDocument();
        expect(screen.getByText("Task")).toBeInTheDocument();
        expect(screen.getByText("Edit Type")).toBeInTheDocument();
    });

    it("toggles media type between videos and comics", () => {
        const setRenameMediaMock = vi.fn();
        const setTaskMock = vi.fn();
        const setEditTypeMock = vi.fn();

        renderWithProvider(
            <RenamePanel
                task={TASK_RENAME}
                renameMedia={VIDEOS}
                setTask={setTaskMock}
                setRenameMedia={setRenameMediaMock}
                editType={TASK_EDIT}
                setEditType={setEditTypeMock}
            />
        );

        const toggleButtons = screen.getAllByRole("checkbox");
        fireEvent.click(toggleButtons[0]);

        expect(setRenameMediaMock).toHaveBeenCalledWith(COMICS);

        fireEvent.click(toggleButtons[0]);
        expect(setRenameMediaMock).toHaveBeenCalledWith(VIDEOS);
    });

    it("toggles task between rename and merge", () => {
        const setRenameMediaMock = vi.fn();
        const setTaskMock = vi.fn();
        const setEditTypeMock = vi.fn();

        renderWithProvider(
            <RenamePanel
                task={TASK_RENAME}
                renameMedia={VIDEOS}
                setTask={setTaskMock}
                setRenameMedia={setRenameMediaMock}
                editType={TASK_EDIT}
                setEditType={setEditTypeMock}
            />
        );

        const toggleButtons = screen.getAllByRole("checkbox");
        fireEvent.click(toggleButtons[1]);
        fireEvent.click(toggleButtons[1]);
        expect(setTaskMock).toHaveBeenCalledTimes(2);
    });
});