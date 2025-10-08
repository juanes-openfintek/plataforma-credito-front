'use client'

interface ButtonProps {
  text: string
  accent?: boolean
  transparent?: boolean
  withIcon?: boolean
  error?: boolean
  errorFill?: boolean
  disable?: boolean
  grayBorder?: boolean
  gray?: boolean
  onClickHandler?: () => void
}
/**
 * SquareButton is a component that renders a square button
 * @param {string} text - The text of the button
 * @param {boolean} accent - Show if the button should be accent
 * @param {boolean} transparent - Show if the button should be transparent
 * @param {boolean} withIcon - Show if the button should be withIcon
 * @param {boolean} error - Show if the button should be error
 * @param {boolean} errorFill - Show if the button should be errorFill
 * @param {boolean} disable - The disable of the button
 * @param {Function} onClickHandler - The onClickHandler of the button
 * @example <SquareButton text='text' accent onClickHandler={onClickHandler} />
 * @returns The SquareButton component
 */
const SquareButton = ({
  text,
  accent,
  transparent,
  withIcon,
  error,
  errorFill,
  disable,
  grayBorder,
  gray,
  onClickHandler,
}: ButtonProps) => {
  return (
    <>
      {accent ? (
        <button
          className={`${
            disable ? 'bg-light-color-two' : 'bg-accent-color'
          } w-full rounded-md text-white border-radius-13 py-3 px-6`}
          disabled={disable}
          onClick={onClickHandler}
        >
          {text}
        </button>
      ) : transparent ? (
        <button
          className={`${
            disable
              ? 'bg-light-color-two border-transparent text-white'
              : 'bg-transparent border-primary-color text-primary-color'
          } w-full border-2 rounded-md border-radius-13 py-2 px-6`}
          disabled={disable}
          onClick={onClickHandler}
        >
          {text}
        </button>
      ) : error ? (
        <button
          className={`${
            disable ? 'bg-light-color-two' : 'bg-transparent'
          } w-full border-2 border-error-color rounded-md text-error-color border-radius-13 py-3 px-6`}
          disabled={disable}
          onClick={onClickHandler}
        >
          {text}
        </button>
      ) : errorFill ? (
        <button
          className={`${
            disable ? 'bg-light-color-two' : 'bg-error-color'
          } w-full h-full rounded-md text-white border-radius-13 py-3 px-6`}
          disabled={disable}
          onClick={onClickHandler}
        >
          {text}
        </button>
      ) : gray ? (
        <button
          className={`${
            disable ? 'bg-light-color-two' : 'bg-light-color-two'
          } w-full rounded-md text-white border-radius-13 py-3 px-6`}
          disabled={disable}
          onClick={onClickHandler}
        >
          {text}
        </button>
      ) : withIcon ? (
        <button
          className={`${
            disable ? 'bg-light-color-two' : 'bg-primary-color'
          } w-full h-full rounded-xl text-white border-radius-13 py-3 px-6 flex items-center justify-between`}
          disabled={disable}
          onClick={onClickHandler}
        >
          {text}
          <span className='icon-plus-icon text-[2rem]' />
        </button>
      ) : grayBorder ? (
        <button
          className={`${
            disable ? 'bg-light-color-two' : 'bg-transparent'
          } w-full h-full border-3 border-light-color-two rounded-md font-bold text-black border-radius-13 py-3 px-6`}
          disabled={disable}
          onClick={onClickHandler}
        >
          {text}
        </button>
      ) : (
        <button
          className={`${
            disable ? 'bg-light-color-two' : 'bg-primary-color'
          } w-full h-full rounded-md text-white border-radius-13 py-3 px-6`}
          disabled={disable}
          onClick={onClickHandler}
        >
          {text}
        </button>
      )}
    </>
  )
}
export default SquareButton
