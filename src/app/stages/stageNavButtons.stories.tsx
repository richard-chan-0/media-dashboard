
import type { Meta, StoryObj } from '@storybook/react';
import StageNavButtons from './stageNavButtons';

const meta = {
    component: StageNavButtons,
    title: 'Stage Buttons',
    tags: ['autodocs'],
} satisfies Meta<typeof StageNavButtons>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LeftButtonWithLabel: Story = {
    args: {
        label: "Left button is shown",
        stage: 0,
        setStage: () => { },
        isLeftEnabled: true,
    }
};

export const RightButtonWithLabel: Story = {
    args: {
        label: "Right button is shown",
        stage: 0,
        setStage: () => { },
        isRightEnabled: true,
    }
}

export const BothButtonsWithLabel: Story = {
    args: {
        label: "Both button is shown",
        stage: 0,
        setStage: () => { },
        isLeftEnabled: true,
        isRightEnabled: true,
    }
}

