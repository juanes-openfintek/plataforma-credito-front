import type { Meta, StoryObj } from '@storybook/react'

import Paginator from './Paginator'

const meta = {
  title: 'Components/Molecules/Paginator',
  component: Paginator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Paginator>

export default meta
type Story = StoryObj<typeof meta>

export const Principal: Story = {
  args: {
    page: 1,
    total: 5,
    perPage: 1,
  },
}
