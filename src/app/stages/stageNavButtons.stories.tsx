
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
        stage: 0,
        setStage: () => { },
        isLeftEnabled: true,
    }
};

export const RightButtonWithLabel: Story = {
    args: {
        stage: 0,
        setStage: () => { },
        isRightEnabled: true,
    }
}

export const BothButtonsWithLabel: Story = {
    args: {
        stage: 0,
        setStage: () => { },
        isLeftEnabled: true,
        isRightEnabled: true,
    }
}

