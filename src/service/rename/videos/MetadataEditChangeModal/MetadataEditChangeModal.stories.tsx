import type { Meta, StoryObj } from "@storybook/react";
import MetadataEditChangeModal from "./MetadataEditChangeModal";
import { useState } from "react";
import { RenameProvider } from "../../RenameProvider";


const meta = {
    component: MetadataEditChangeModal,
    title: "Name Change Modal",
    tags: ["autodocs"],
    render: (args) => {
        const [isOpen, setIsOpen] = useState(false);
        return (
            <>
                <button
                    className="bg-white text-black p-2 rounded-xl hover:bg-gray-200 active:bg-gray-300"
                    onClick={() => setIsOpen(true)}
                >
                    Open Modal
                </button>
                <RenameProvider>
                    <MetadataEditChangeModal
                        isOpen={isOpen}
                        onClose={() => setIsOpen(false)}
                        currentName={args.currentName}
                        suggestedName={args.suggestedName}
                        onEdit={() => { }}
                    />
                </RenameProvider>
            </>
        )
    }
} satisfies Meta<typeof MetadataEditChangeModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        currentName: "example.txt",
        isOpen: true,
        onClose: () => { },
        onEdit: () => { },
        suggestedName: "newname.txt",
    }
};
