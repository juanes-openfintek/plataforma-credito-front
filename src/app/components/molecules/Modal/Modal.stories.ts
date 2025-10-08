import type { Meta, StoryObj } from '@storybook/react'

import Modal from './Modal'

const meta = {
  title: 'Components/Molecules/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

export const RedBorderButton: Story = {
  args: {
    showModal: true,
    title: 'Title',
    description: '<p>description</p>',
    negativeButtonText: 'Cancel',
    positiveButtonText: 'OK',
    borderRedButton: true,
  },
}

export const RedFilledButton: Story = {
  args: {
    showModal: true,
    title: 'Title',
    description: '<p>description</p>',
    negativeButtonText: 'Cancel',
    positiveButtonText: 'OK',
    fillRedButton: true,
  },
}

export const InvertedButtons: Story = {
  args: {
    showModal: true,
    title: 'Title',
    description: '<p>description</p>',
    negativeButtonText: 'Cancel',
    positiveButtonText: 'OK',
    invertedButtons: true,
  },
}

export const NoPositiveButton: Story = {
  args: {
    showModal: true,
    title: 'Title',
    description: '<p>description</p>',
    negativeButtonText: 'Cancel',
  },
}

export const NoNegativeButton: Story = {
  args: {
    showModal: true,
    title: 'Title',
    description: '<p>description</p>',
    positiveButtonText: 'OK',
  },
}
