import type { Meta, StoryObj } from '@storybook/react'

import RoundButton from './RoundButton'

const meta = {
  title: 'Components/Atoms/RoundButton',
  component: RoundButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RoundButton>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    text: 'Button',
    lightStyle: true,
  },
}

export const Secondary: Story = {
  args: {
    text: 'Button',
    lightStyle: false,
  },
}
