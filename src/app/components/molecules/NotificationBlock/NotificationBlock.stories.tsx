import type { Meta, StoryObj } from '@storybook/react'

import NotificationBlock from './NotificationBlock'

const meta = {
  title: 'Components/Molecules/NotificationBlock',
  component: NotificationBlock,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NotificationBlock>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    read: false,
    title: 'Recuerda revisar la solicitud anterior, debes correguir algo',
  },
}
