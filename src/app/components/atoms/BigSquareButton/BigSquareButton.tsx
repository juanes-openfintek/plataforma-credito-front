interface BigInfoSquareProps {
  text: string
  value: string
  active?: boolean
  onHandleClick?: () => void
}

const BigSquareButton = ({
  text,
  value,
  active,
  onHandleClick,
}: BigInfoSquareProps) => {
  return (
    <div
      className={`flex flex-row p-4 px-12 w-[33%] max-md:w-full h-[160px] rounded-2xl justify-between items-center cursor-pointer ${
        active
          ? 'text-white bg-primary-color'
          : 'border-primary-color border-[3px]'
      }`}
      onClick={onHandleClick}
    >
      <div className='flex flex-col'>
        <p className='font-bold text-[2.5rem]'>{value}</p>
        <p className='font-semibold text-[1.5625rem]'>{text}</p>
      </div>
      {/* <NextImage src='/images/right-arrow.png' alt='calendar' width={20} /> */}
      <span className='icon-right-arrow text-[2rem]' />
    </div>
  )
}

export default BigSquareButton
