import type { Meta, StoryObj } from "@storybook/react";
import NameChangePreview from "./NameChange";
import { RenameProvider } from "../provider/RenameProvider";
import { useRename } from "../hooks/useRename";
import { NameChanges } from "../../lib/types";
import { Action } from "../context/RenameContext";
import { useEffect } from "react";

type TestNameChangePreviewProps = {
    stageDispatcher: (action: string) => void;
    nameChanges: NameChanges;
}

const TestNameChangePreview = (args: TestNameChangePreviewProps) => {
    const { dispatch } = useRename();
    useEffect(() => {
        const set_name_change_action = {
            type: "SET_NAME_CHANGES",
            payload: args.nameChanges as NameChanges,
        } as Action;

        dispatch(set_name_change_action);
    }, [dispatch, args.nameChanges]);
    return (
        <NameChangePreview {...args} />
    )
}

const meta = {
    component: TestNameChangePreview,
    title: "Name Change Stage",
    tags: ["autodocs"],
    render: (args) => {

        return (
            <RenameProvider>
                <TestNameChangePreview {...args} />
            </RenameProvider>
        )
    },
} satisfies Meta<typeof TestNameChangePreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const VideoNameChangePreview: Story = {
    args: {
        stageDispatcher: () => { },
        nameChanges: {
            changes: [
                {
                    input: "test.mp4",
                    output: "test_renamed.mp4",
                },
                {
                    input: "test2.mp4",
                    output: "test_renamed2.mp4",
                },
            ],
        }
    },
};

export const VideoNameChangePreviewEmpty: Story = {
    args: {
        stageDispatcher: () => { },
        nameChanges: {
            changes: [],
        }
    },
};
