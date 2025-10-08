'use client'

import ArrowIconDown from '../ArrowIcon/ArrowIconDown'
import ArrowIconUp from '../ArrowIcon/ArrowIconUp'

interface ArrowButtonProps {
  text: String
  left?: boolean
  up?: boolean
  between?: boolean
  onClickHandler?: () => void
}

/**
 * ArrowButton is a component that renders a button text with an arrow
 * @param {String} text - The text of the button
 * @param {boolean} left - The position of the arrow
 * @param {boolean} up - The direction of the arrow
 * @param {boolean} between - The position of the text
 * @param {Function} onClickHandler - The function to handle the click event
 * @example <ArrowButton text='text' left up between onClickHandler={onClickHandler} />
 * @returns The ArrowButton component
 */

const ArrowButton = ({
  text,
  left,
  up,
  between,
  onClickHandler,
}: ArrowButtonProps) => {
  return (
    <>
      {left ? (
        <button
          type='button'
          className={`bg-transparent border-0 text-center flex items-center ${between ? 'justify-between' : 'justify-start'} w-full`}
          onClick={onClickHandler}
        >
          {up ? <ArrowIconUp /> : <ArrowIconDown />}
          {text}
        </button>
      ) : (
        <button
          type='button'
          className={`bg-transparent border-0 text-center flex items-center ${between ? 'justify-between' : 'justify-end'} w-full`}
          onClick={onClickHandler}
        >
          {text}
          {up ? <ArrowIconUp /> : <ArrowIconDown />}
        </button>
      )}
    </>
  )
}
export default ArrowButton
