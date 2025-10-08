import type { Meta, StoryObj } from '@storybook/react'

import SquareButton from './SquareButton'

const meta = {
  title: 'Components/Atoms/SquareButton',
  component: SquareButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SquareButton>

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
    transparent: true,
  },
}

export const Accent: Story = {
  args: {
    text: 'Button',
    accent: true,
  },
}

export const Error: Story = {
  args: {
    text: 'Button',
    error: true,
  },
}

export const ErrorFill: Story = {
  args: {
    text: 'Button',
    errorFill: true,
  },
}
