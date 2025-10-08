'use-client'
import { useState } from 'react'
import SquareSmallButton from '../../atoms/SquareSmallButton/SquareSmallButton'

interface Props {
  question: string
  answer: string
}
/**
 * ExpandableItem is a component that renders a expandable item
 * @param {string} question - The question of the item
 * @param {string} answer - The answer of the item
 * @example <ExpandableItem question={question} answer={answer} />
 * @returns The ExpandableItem component
 */
const ExpandableItem = ({ question, answer }: Props) => {
  /**
   * State that controls the close button
   */
  const [close, setClose] = useState(false)
  return (
    <>
      <div className='flex flex-row justify-end'>
        <p className='mr-auto max-lg:w-[15rem] 2xl:text-[1.5625rem] 2xl:leading-[32px]'>{question}</p>
        <SquareSmallButton
          close={close}
          onClickHandler={() => setClose(!close)}
        />
      </div>
      {close && (
        <div
          className='ml-6 mt-2 2xl:text-[1.5625rem] 2xl:leading-[32px]'
          dangerouslySetInnerHTML={{
            __html: answer,
          }}
        />
      )}
    </>
  )
}

export default ExpandableItem
