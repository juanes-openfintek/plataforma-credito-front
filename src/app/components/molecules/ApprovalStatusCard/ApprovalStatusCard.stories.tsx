import type { Meta, StoryObj } from '@storybook/react'
import ApprovalStatusCard from './ApprovalStatusCard'

const meta: Meta<typeof ApprovalStatusCard> = {
  title: 'Molecules/ApprovalStatusCard',
  component: ApprovalStatusCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof ApprovalStatusCard>

export const AutoApproved: Story = {
  args: {
    creditId: '507f1f77bcf86cd799439011',
    showDetails: true,
  },
}

export const ManualApproval: Story = {
  args: {
    creditId: '507f1f77bcf86cd799439012',
    showDetails: false,
  },
}

export const WithDetails: Story = {
  args: {
    creditId: '507f1f77bcf86cd799439011',
    showDetails: true,
  },
}

export const WithoutDetails: Story = {
  args: {
    creditId: '507f1f77bcf86cd799439011',
    showDetails: false,
  },
}
