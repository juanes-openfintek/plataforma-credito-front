import SquareButton from '../../atoms/SquareButton/SquareButton'

interface ModalProps {
  showModal?: boolean
  title: string
  description: string
  negativeButtonText?: string
  positiveButtonText?: string
  borderRedButton?: boolean
  downBorderButton?: boolean
  fillRedButton?: boolean
  invertedButtons?: boolean
  disable?: boolean
  handleClickNegative?: () => void
  handleClickPositive?: () => void
}

/**
 * Modal component that displays a modal with a title, description, and optional buttons.
 * @param showModal - Whether or not to show the modal.
 * @param title - The title of the modal.
 * @param description - The description of the modal.
 * @param negativeButtonText - The text to display on the negative button.
 * @param positiveButtonText - The text to display on the positive button.
 * @param borderRedButton - Whether or not to display the positive button with a red border.
 * @param fillRedButton - Whether or not to display the positive button with a red fill.
 * @param invertedButtons - Whether or not to display the buttons with inverted colors.
 * @param disable - Whether or not to disable the buttons.
 * @param handleClickNegative - The function to call when the negative button is clicked.
 * @param handleClickPositive - The function to call when the positive button is clicked.
 */
const Modal = ({
  showModal,
  borderRedButton,
  fillRedButton,
  invertedButtons,
  title,
  description,
  negativeButtonText,
  positiveButtonText,
  downBorderButton,
  disable,
  handleClickNegative,
  handleClickPositive,
}: ModalProps) => {
  return (
    <>
      {showModal && (
        <>
          <div className='w-[100vw] h-[100vh] bg-light-color-two opacity-80 fixed top-0 left-0 xl:pl-[300px]' onClick={handleClickNegative} />
          <div className='bg-white p-10 w-[520px] max-md:w-[90%] h-auto rounded-3xl font-poppins fixed top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%]'>
            <h3 className={`text-[1.5625rem] font-bold text-center ${fillRedButton ? 'text-error-color' : 'text-primary-color'}`}>{title}</h3>
            <div
              className='text-[1.25rem] text-black my-6'
              dangerouslySetInnerHTML={{ __html: description }}
            />
            {negativeButtonText && (
              <div className='my-2 '>
                <SquareButton
                  text={negativeButtonText}
                  disable={disable}
                  grayBorder={fillRedButton || invertedButtons}
                  onClickHandler={handleClickNegative}
                />
              </div>
            )}
            {positiveButtonText && (
              <div className='my-2 font-bold'>
                <SquareButton
                  disable={disable}
                  text={positiveButtonText}
                  error={borderRedButton}
                  errorFill={fillRedButton}
                  transparent={downBorderButton}
                  onClickHandler={handleClickPositive}
                />
              </div>
            )}
          </div>
        </>
      )}
    </>
  )
}

export default Modal
