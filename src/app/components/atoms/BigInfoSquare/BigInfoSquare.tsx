interface BigInfoSquareProps {
  text: string
  value: string
}

const BigInfoSquare = ({ text, value }: BigInfoSquareProps) => {
  return (
    <div className='flex flex-row p-4 w-[33%] max-xl:w-full h-[160px] text-white bg-primary-color rounded-2xl justify-between items-center'>
      <p className='font-semibold text-[1.5625rem] mx-3 w-[30%]'>{text}</p>
      <p className='font-bold text-[3rem] mx-2 max-lg:text-[2rem]'>{value}</p>
    </div>
  )
}

export default BigInfoSquare
