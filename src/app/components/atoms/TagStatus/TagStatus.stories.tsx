import type { Meta, StoryObj } from '@storybook/react'

import TagStatus from './TagStatus'

const meta = {
  title: 'Components/Atoms/TagStatus',
  component: TagStatus,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TagStatus>

export default meta
type Story = StoryObj<typeof meta>

export const Approved: Story = {
  args: {
    text: 'approved',
  },
}

export const Rejected: Story = {
  args: {
    text: 'rejected',
  },
}
