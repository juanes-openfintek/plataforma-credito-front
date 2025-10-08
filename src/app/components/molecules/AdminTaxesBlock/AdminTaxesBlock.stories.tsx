import type { Meta, StoryObj } from '@storybook/react'

import AdminTaxesBlock from './AdminTaxesBlock'

const meta = {
  title: 'Components/Molecules/AdminTaxesBlock',
  component: AdminTaxesBlock,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AdminTaxesBlock>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    tax: {
      minAmount: 0,
      maxAmount: 100000,
      emPercentage: 0.1,
      eaPercentage: 0.1,
      interestPercentage: 0.1,
      insurancePercentage: 0.1,
      administrationPercentage: 0.1,
      ivaPercentage: 0.1,
      id: ''
    },
    position: 1,
  },
}
