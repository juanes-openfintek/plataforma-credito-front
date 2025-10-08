interface IconArrowButtonProps {
  image: string
  title: string
  description: string
  onClickHandler?: () => void
}

const IconArrowButton = ({
  title,
  description,
  image,
  onClickHandler,
}: IconArrowButtonProps) => {
  return (
    <div className='flex flex-row relative bg-light-color-one rounded-xl p-8 items-center text-black cursor-pointer' onClick={onClickHandler}>
      <span className={`${image} text-[5rem] ml-4 text-primary-color`} />
      <div className='flex flex-col ml-8 max-w-[290px]'>
        <h3 className='text-[1.5625rem] font-semibold'>{title}</h3>
        <p className='text-[1.25rem]'>{description}</p>
      </div>
      <div className='flex flex-col absolute right-0 mr-12'>
        <span className='icon-right-arrow text-[2rem]' />
      </div>
    </div>
  )
}

export default IconArrowButton
