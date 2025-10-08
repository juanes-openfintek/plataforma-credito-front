import type { Meta, StoryObj } from '@storybook/react'

import ThreeColumnInputs from './ThreeColumnInputs'

const meta = {
  title: 'Components/Molecules/ThreeColumnInputs',
  component: ThreeColumnInputs,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ThreeColumnInputs>

export default meta
type Story = StoryObj<typeof meta>

export const Field: Story = {
  args: {
    fields: [
      {
        value: '',
        errors: 'error',
        placeholder: 'placeholder',
        type: 'text',
        label: 'label',
        name: 'name1',
      },
      {
        value: '2',
        errors: 'error2',
        type: 'number',
        label: 'label2',
        name: 'name2',
      },
      {
        value: '',
        errors: 'error3',
        type: 'date',
        label: 'label3',
        name: 'name3',
      },
    ],
    title: 'title',
    onHandleChange: () => {},
  },
}
