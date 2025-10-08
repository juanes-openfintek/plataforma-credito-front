'use client'
interface RoundButtonProps {
  text: String
  lightStyle?: boolean
  onClickHandler?: () => void
}
/**
 * RoundButton is a component that renders a button with rounded borders
 * @param {String} text - The text of the button
 * @param {boolean} lightStyle - The style of the button, light or dark
 * @param {Function} onClickHandler - The function to handle the click event
 * @example <RoundButton text='text' lightStyle onClickHandler={onClickHandler} />
 * @returns The RoundButton component
 */
const RoundButton = ({
  text,
  lightStyle,
  onClickHandler,
}: RoundButtonProps) => {
  return (
    <>
      <button
        type='button'
        className={`${
          lightStyle
            ? 'bg-primary-color rounded-3xl border-radius-100 py-3 px-6'
            : 'bg-transparent border-4 border-white rounded-3xl py-2 px-[18px] hover:bg-white hover:text-primary-color transition-all'
        } text-white w-full`}
        onClick={onClickHandler}
      >
        {text}
      </button>
    </>
  )
}
export default RoundButton
