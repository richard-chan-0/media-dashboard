import type { Meta, StoryObj } from "@storybook/react";
import SetStreams from "./SetStreams";
import { RenameProvider } from "../RenameProvider";

const meta = {
    component: SetStreams,
    title: "Set Stream Stage",
    tags: ["autodocs"],
    render: (args) => {
        return (
            <RenameProvider>
                <SetStreams {...args} />
            </RenameProvider>
        )
    },
} satisfies Meta<typeof SetStreams>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        stageDispatcher: () => { },
    },
};
