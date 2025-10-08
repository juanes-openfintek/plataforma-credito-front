import type { Meta, StoryObj } from '@storybook/react'

import MenuUser from './MenuUser'

const meta = {
  title: 'Components/Molecules/MenuUser',
  component: MenuUser,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MenuUser>

export default meta
type Story = StoryObj<typeof meta>

export const Field: Story = {
}
