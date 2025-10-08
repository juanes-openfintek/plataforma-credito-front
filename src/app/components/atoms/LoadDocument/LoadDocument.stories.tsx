import type { Meta, StoryObj } from '@storybook/react'

import LoadDocument from './LoadDocument'

const meta = {
  title: 'Components/Atoms/LoadDocument',
  component: LoadDocument,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LoadDocument>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    file: 'default-file-value',
  },
}
