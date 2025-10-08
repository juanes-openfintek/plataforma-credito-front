import type { Meta, StoryObj } from '@storybook/react'

import SquareSmallButton from './SquareSmallButton'

const meta = {
  title: 'Components/Atoms/SquareSmallButton',
  component: SquareSmallButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SquareSmallButton>

export default meta
type Story = StoryObj<typeof meta>

export const Open: Story = {
  args: {
    close: false,
  },
}

export const Close: Story = {
  args: {
    close: true,
  },
}
