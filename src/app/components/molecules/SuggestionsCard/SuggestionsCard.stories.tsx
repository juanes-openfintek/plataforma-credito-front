import type { Meta, StoryObj } from '@storybook/react'
import SuggestionsCard from './SuggestionsCard'

const meta: Meta<typeof SuggestionsCard> = {
  title: 'Molecules/SuggestionsCard',
  component: SuggestionsCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof SuggestionsCard>

export const Default: Story = {
  args: {},
}

export const Compact: Story = {
  args: {
    compact: true,
  },
}

export const WithSuggestions: Story = {
  args: {
    compact: false,
  },
}
