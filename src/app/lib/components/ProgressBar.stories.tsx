
import type { Meta, StoryObj } from '@storybook/react';
import ProgressBar from './ProgressBar';


const meta = {
    component: ProgressBar,
    title: 'Progress Bar',
    tags: ['autodocs'],
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        isInProgress: false,
        progressLabel: "Uploading...",
        progressPercent: 50,
    },
};

