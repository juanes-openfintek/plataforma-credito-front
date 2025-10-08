/* eslint-disable no-undef */
import { expect, test } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import ArrowButton from './ArrowButton'

test('renders the button text', () => {
  render(<ArrowButton text='Hola' />)
  const main = within(screen.getByText('Hola'))
  expect(
    main.getByText('Hola')
  ).toBeDefined()
})
