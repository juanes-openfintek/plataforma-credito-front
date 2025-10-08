'use client'
interface ButtonProps {
  close?: boolean
  onClickHandler?: () => void
}
/**
 * SquareSmallButton is a component that renders a small square button
 * @param {boolean} close - Show if the button should be close
 * @param {Function} onClickHandler - The onClickHandler of the button
 * @example <SquareSmallButton close onClickHandler={onClickHandler} />
 * @returns The SquareSmallButton component
 */
const SquareSmallButton = ({
  close,
  onClickHandler,
}: ButtonProps) => {
  return (
    <button
      className='bg-primary-color text-white w-6 h-6'
      onClick={onClickHandler}
    >
      {close ? '-' : '+'}
    </button>
  )
}
export default SquareSmallButton
