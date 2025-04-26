import type { Meta, StoryObj } from "@storybook/react";
import StageNavButtons from "./StageNavButtons";

const meta = {
    component: StageNavButtons,
    title: "Stage Buttons",
    tags: ["autodocs"],
} satisfies Meta<typeof StageNavButtons>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LeftButtonWithLabel: Story = {
    args: {
        stageDispatcher: () => { },
        isLeftEnabled: true,
    },
};

export const RightButtonWithLabel: Story = {
    args: {
        stageDispatcher: () => { },
        isRightEnabled: true,
    },
};

export const BothButtonsWithLabel: Story = {
    args: {
        stageDispatcher: () => { },
        isLeftEnabled: true,
        isRightEnabled: true,
    },
};
