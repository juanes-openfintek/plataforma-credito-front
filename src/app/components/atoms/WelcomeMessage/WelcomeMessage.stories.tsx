import type { Meta, StoryObj } from '@storybook/react'

import WelcomeMessage from './WelcomeMessage'

const meta = {
  title: 'Components/Atoms/WelcomeMessage',
  component: WelcomeMessage,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof WelcomeMessage>

export default meta
type Story = StoryObj<typeof meta>

export const Approved: Story = {
  args: {},
}
