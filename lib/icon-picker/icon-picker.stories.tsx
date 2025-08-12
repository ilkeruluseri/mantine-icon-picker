import type { Meta, StoryObj } from '@storybook/react-vite';

import IconPicker from './icon-picker';

const meta = {
  component: IconPicker,
} satisfies Meta<typeof IconPicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};