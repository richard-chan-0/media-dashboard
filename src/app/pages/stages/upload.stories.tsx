import type { Meta, StoryObj } from "@storybook/react";
import RenameUploadStage from "./upload";

const meta = {
    component: RenameUploadStage,
    title: "Upload Stage",
    tags: ["autodocs"],
} satisfies Meta<typeof RenameUploadStage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const VideoUploadStageWithPreview: Story = {
    args: {
        mediaType: "videos",
        stageDispatcher: () => {},
    },
};
