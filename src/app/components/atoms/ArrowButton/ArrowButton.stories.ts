import type { Meta, StoryObj } from '@storybook/react'

import ArrowButton from './ArrowButton'

const meta = {
  title: 'Components/Atoms/ArrowButton',
  component: ArrowButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ArrowButton>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    text: 'Button',
  },
}

export const Secondary: Story = {
  args: {
    text: 'Button',
    left: true,
  },
}
