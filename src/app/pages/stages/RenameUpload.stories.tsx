import type { Meta, StoryObj } from "@storybook/react";
import RenameUploadStage from "./RenameUpload";
import { RenameProvider } from "../provider/RenameProvider";

type TestRenameUploadStageProps = {
    mediaType: string;
    stageDispatcher: (action: string) => void;
}

const TestRenameUploadStage = (args: TestRenameUploadStageProps) => {
    return <RenameUploadStage {...args} />
}

const meta = {
    component: TestRenameUploadStage,
    title: "Upload Stage",
    tags: ["autodocs"],
    render: (args) => {
        return (
            <RenameProvider>
                <TestRenameUploadStage {...args} />
            </RenameProvider>
        )
    },
} satisfies Meta<typeof TestRenameUploadStage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const VideoUploadStage: Story = {
    args: {
        mediaType: "videos",
        stageDispatcher: () => { },
    },
};

export const ComicUploadStage: Story = {
    args: {
        mediaType: "comics",
        stageDispatcher: () => { },
    },
};

