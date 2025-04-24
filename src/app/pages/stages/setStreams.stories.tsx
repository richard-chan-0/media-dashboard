
import type { Meta, StoryObj } from '@storybook/react';
import SetStreams from './setStreams';

const meta = {
    component: SetStreams,
    title: 'Set Stream Stage',
    tags: ['autodocs'],
} satisfies Meta<typeof SetStreams>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        setError: () => { },
        stage: 0,
        stageDispatcher: () => { }
    },
};

