import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from './Button';

const meta = {
    argTypes: {
        color: {
            control: { type: 'select' },
            options: ['primary', 'success', 'info', 'warning', 'error'],
        },
        size: {
            control: { type: 'select' },
            options: ['small', 'medium', 'large'],
        },
    },
    component: Button,
    parameters: {
        layout: 'centered',
    },
    title: 'Components/Button',
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof Button>;

export const DefaultButton: Story = {
    args: {
        children: 'Click Me!',
        color: 'primary',
        size: 'medium',
    },
};

export const DisabledButton: Story = {
    args: {
        ...DefaultButton.args,
        disabled: true,
    },
};
