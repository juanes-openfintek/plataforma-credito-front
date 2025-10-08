import type { Meta, StoryObj } from '@storybook/react'

import NextImage from './NextImage'

const meta = {
  title: 'Components/Atoms/NextImage',
  component: NextImage,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NextImage>

export default meta
type Story = StoryObj<typeof meta>

export const Image: Story = {
  args: {
    src: '/images/main-banner.png',
    alt: 'Next.js logo',
    width: 600,
    height: 600,
  },
}
