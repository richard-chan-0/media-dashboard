import { describe, it, expect, vi } from "vitest";
import '@testing-library/jest-dom';

import { render, screen, fireEvent } from "@testing-library/react";
import SlidingToggleButton, { IconToggle } from "./SlidingToggleButton";

describe("SlidingToggleButton", () => {
    it("renders the toggle button", () => {
        render(<SlidingToggleButton isToggle={false} onToggle={vi.fn()} />);
        const inputElement = screen.getByRole("checkbox");
        expect(inputElement).toBeInTheDocument();
    });

    it("calls onToggle with the correct value when toggled", () => {
        const onToggleMock = vi.fn();
        render(<SlidingToggleButton isToggle={false} onToggle={onToggleMock} />);

        const inputElement = screen.getByRole("checkbox");
        fireEvent.click(inputElement);
        fireEvent.click(inputElement);
        expect(onToggleMock).toHaveBeenCalledTimes(2);
    });

    it("displays the correct icon when icons are provided", () => {
        const MockIconBefore = vi.fn(() => <svg data-testid="icon-before" />);
        const MockIconAfter = vi.fn(() => <svg data-testid="icon-after" />);

        const { rerender } = render(
            <SlidingToggleButton
                isToggle={false}
                onToggle={vi.fn()}
                icons={{ before: MockIconBefore, after: MockIconAfter } as IconToggle}
            />
        );

        expect(screen.getByTestId("icon-after")).toBeInTheDocument();

        rerender(
            <SlidingToggleButton
                isToggle={true}
                onToggle={vi.fn()}
                icons={{ before: MockIconBefore, after: MockIconAfter }}
            />
        );

        expect(screen.getByTestId("icon-before")).toBeInTheDocument();
    });

    it("applies the correct styles based on toggle state", () => {
        const { container, rerender } = render(
            <SlidingToggleButton isToggle={false} onToggle={vi.fn()} />
        );

        const sliderElement = container.querySelector("span.cursor-pointer");
        expect(sliderElement).toHaveClass("bg-purple-500/80");

        rerender(<SlidingToggleButton isToggle={true} onToggle={vi.fn()} />);
        expect(sliderElement).toHaveClass("bg-blue-500/80");
    });
});