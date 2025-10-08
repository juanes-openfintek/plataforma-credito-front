import type { Meta, StoryObj } from '@storybook/react'

import BreadcrumbLabel from './BreadcrumbLabel'

const meta = {
  title: 'Components/Atoms/BreadcrumbLabel',
  component: BreadcrumbLabel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BreadcrumbLabel>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    link: '/',
    text: 'Button',
    leftArrow: true,
  },
}

export const Secondary: Story = {
  args: {
    text: 'Button',
  },
}
