import type { Meta, StoryObj } from "@storybook/react";
import NameChangeModal from "./NameChangeModal";
import { useState } from "react";
import { RenameProvider } from "../../../pages/rename/RenameProvider";


const meta = {
    component: NameChangeModal,
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
                    <NameChangeModal isOpen={isOpen} onClose={() => setIsOpen(false)} initialName={args.initialName} />
                </RenameProvider>
            </>
        )
    }
} satisfies Meta<typeof NameChangeModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        initialName: "example.txt",
        isOpen: true,
        onClose: () => { }
    }
};
