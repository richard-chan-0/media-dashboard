import type { Meta, StoryObj } from "@storybook/react";
import MetadataChangeModal from "./MetadataChangeModal";
import { useState } from "react";
import { RenameProvider } from "../../../pages/rename/RenameProvider";


const meta = {
    component: MetadataChangeModal,
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
                    <MetadataChangeModal
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
} satisfies Meta<typeof MetadataChangeModal>;

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
