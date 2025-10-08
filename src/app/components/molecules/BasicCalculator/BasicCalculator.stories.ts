import type { Meta, StoryObj } from '@storybook/react'

import BasicCalculator from './BasicCalculator'

const meta = {
  title: 'Components/Molecules/BasicCalculator',
  component: BasicCalculator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BasicCalculator>

export default meta
type Story = StoryObj<typeof meta>

export const Calculator: Story = {}
