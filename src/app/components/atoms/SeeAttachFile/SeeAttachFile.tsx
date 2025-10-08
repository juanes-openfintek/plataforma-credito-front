import NextImage from '../NextImage/NextImage'

interface SeeAttachFileProps {
  url: string
}

const SeeAttachFile = ({ url }: SeeAttachFileProps) => {
  return (
    <a
      className='w-[250px] h-[100px] rounded-xl bg-light-color-two flex flex-row justify-evenly items-center cursor-pointer'
      href={url}
      target='_blank'
    >
      <p className='text-white'>Ver archivo</p>
      <NextImage src='/images/attach-icon.png' alt='calendar' width={74} />
    </a>
  )
}

export default SeeAttachFile
