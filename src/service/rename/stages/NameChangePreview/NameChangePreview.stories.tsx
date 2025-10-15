import type { Meta, StoryObj } from "@storybook/react";
import NameChangePreview from "./NameChangePreview";
import { RenameProvider } from "../../RenameProvider";
import { useRename } from "../../../../lib/hooks/usePageContext";
import { NameChanges, RenameAction } from "../../../../lib/types";
import { useEffect } from "react";

type TestNameChangePreviewProps = {
    nameChanges: NameChanges;
}

const TestNameChangePreview = (args: TestNameChangePreviewProps) => {
    const { dispatch } = useRename();
    useEffect(() => {
        const set_name_change_action = {
            type: "SET_NAME_CHANGES",
            payload: args.nameChanges as NameChanges,
        } as RenameAction;

        dispatch(set_name_change_action);
    }, [dispatch, args.nameChanges]);
    return (
        <NameChangePreview />
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
        nameChanges: {
            changes: [],
        }
    },
};
