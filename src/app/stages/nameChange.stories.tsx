
import type { Meta, StoryObj } from '@storybook/react';
import NameChangePreview from './nameChange';

const meta = {
    component: NameChangePreview,
    title: 'Name Change Stage',
    tags: ['autodocs'],
} satisfies Meta<typeof NameChangePreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const VideoNameChangePreview: Story = {
    args: {
        nameChanges: {
            changes: [
                { input: 'video1.mp4', output: 'video1_renamed.mp4' },
                { input: 'video2.mp4', output: 'video2_renamed.mp4' },
                { input: 'video3.mp4', output: 'video3_renamed.mp4' },
            ],
        },
        stage: 0,
        setNameChanges: () => { },
        setRenameMessage: () => { },
        setStage: () => { },
    },
};

