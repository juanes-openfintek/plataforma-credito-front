import type { Meta, StoryObj } from '@storybook/react'

import BigInfoSquare from './BigInfoSquare'

const meta = {
  title: 'Components/Atoms/BigInfoSquare',
  component: BigInfoSquare,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BigInfoSquare>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    text: 'Button',
    value: '100',
  },
}
