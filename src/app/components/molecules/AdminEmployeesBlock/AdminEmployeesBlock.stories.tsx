import type { Meta, StoryObj } from '@storybook/react'

import AdminEmployeesBlock from './AdminEmployeesBlock'

const meta = {
  title: 'Components/Molecules/AdminEmployeesBlock',
  component: AdminEmployeesBlock,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AdminEmployeesBlock>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    employees: {
      _id: '',
      createdAt: '',
      email: '',
      uid: '',
      isActive: false,
      roles: [],
      emailVerified: false,
      __v: 0,
      dateOfBirth: '',
      documentNumber: '',
      documentType: '',
      lastname: '',
      name: '',
      phoneNumber: '',
      commission: '',
      identificationNumber: '',
    },
  },
}
