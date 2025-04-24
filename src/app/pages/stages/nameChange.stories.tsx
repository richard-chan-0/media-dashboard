import type { Meta, StoryObj } from "@storybook/react";
import NameChangePreview from "./nameChange";

const meta = {
    component: NameChangePreview,
    title: "Name Change Stage",
    tags: ["autodocs"],
} satisfies Meta<typeof NameChangePreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const VideoNameChangePreview: Story = {
    args: {
        stageDispatcher: () => {},
    },
};
