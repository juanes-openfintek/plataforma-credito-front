import type { Meta, StoryObj } from '@storybook/react'

import SeeAttachFile from './SeeAttachFile'

const meta = {
  title: 'Components/Atoms/SeeAttachFile',
  component: SeeAttachFile,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SeeAttachFile>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    url: 'https://www.google.com',
  },
}
