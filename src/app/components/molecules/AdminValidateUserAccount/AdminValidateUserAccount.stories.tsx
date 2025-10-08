import type { Meta, StoryObj } from '@storybook/react'

import AdminValidateUserAccount from './AdminValidateUserAccount'

const meta = {
  title: 'Components/Molecules/AdminValidateUserAccount',
  component: AdminValidateUserAccount,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AdminValidateUserAccount>

export default meta
type Story = StoryObj<typeof meta>

export const Field: Story = {
  args: {
    documentUrl: 'https://www.google.com',
  }
}
