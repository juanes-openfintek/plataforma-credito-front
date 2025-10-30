import type { Meta, StoryObj } from '@storybook/react'
import ScoringCalculator from './ScoringCalculator'

const meta: Meta<typeof ScoringCalculator> = {
  title: 'Organisms/ScoringCalculator',
  component: ScoringCalculator,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof ScoringCalculator>

export const ScoreOnly: Story = {
  args: {
    showPreApproval: false,
  },
}

export const WithPreApproval: Story = {
  args: {
    showPreApproval: true,
  },
}

export const WithCallback: Story = {
  args: {
    showPreApproval: false,
    onScoreCalculated: (score) => {
      console.log('Score calculated:', score)
      alert(`Tu score es: ${score}`)
    },
  },
}
