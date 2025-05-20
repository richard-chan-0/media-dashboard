import type { Meta, StoryObj } from "@storybook/react";
import NameChangeModal from "./NameChangeModal";


const meta = {
    component: NameChangeModal,
    title: "Name Change Modal",
    tags: ["autodocs"],
} satisfies Meta<typeof NameChangeModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        isOpen: true,
        onClose: () => console.log("Modal closed"),
    }
};
