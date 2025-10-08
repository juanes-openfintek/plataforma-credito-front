import type { Meta, StoryObj } from '@storybook/react'

import StateTag from './StateTag'

const meta = {
  title: 'Components/Molecules/StateTag',
  component: StateTag,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof StateTag>

export default meta
type Story = StoryObj<typeof meta>

export const Field: Story = {
  args: {
    state: 'pending',
  },
}
