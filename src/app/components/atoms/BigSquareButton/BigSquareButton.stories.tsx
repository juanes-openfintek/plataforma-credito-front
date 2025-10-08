import type { Meta, StoryObj } from '@storybook/react'

import BigSquareButton from './BigSquareButton'

const meta = {
  title: 'Components/Atoms/BigSquareButton',
  component: BigSquareButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BigSquareButton>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    text: 'Button',
    value: '100',
  },
}
