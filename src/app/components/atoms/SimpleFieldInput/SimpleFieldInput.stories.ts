import type { Meta, StoryObj } from '@storybook/react'

import SimpleFieldInput from './SimpleFieldInput'

const meta = {
  title: 'Components/Atoms/SimpleFieldInput',
  component: SimpleFieldInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SimpleFieldInput>

export default meta
type Story = StoryObj<typeof meta>

export const Field: Story = {
  args: {
    value: 'Value',
    errors: 'Error',
    type: 'text',
    placeholder: 'Placeholder',
    label: 'Label',
    name: 'name',
    border: false,
    readonly: false,
    onHandleChange: () => {},
  },
}
