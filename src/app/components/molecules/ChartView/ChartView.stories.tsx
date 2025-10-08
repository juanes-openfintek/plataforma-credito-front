import type { Meta, StoryObj } from '@storybook/react'

import ChartView from './ChartView'

const meta = {
  title: 'Components/Molecules/ChartView',
  component: ChartView,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ChartView>

export default meta
type Story = StoryObj<typeof meta>

export const Chart: Story = {
  args: {
    collectedData: [
      {
        _id: '1',
        total: 0
      }
    ]
  }
}
