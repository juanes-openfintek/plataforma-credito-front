import ArrowButton from '../../atoms/ArrowButton/ArrowButton'
import NextImage from '../../atoms/NextImage/NextImage'
/**
 * Footer is a component that renders the footer
 * @example <Footer />
 * @returns The Footer component
 */
const Footer = () => {
  return (
    <footer className='flex flex-row max-sm:flex-col py-20 max-sm:py-10 px-[12rem] max-sm:px-6 bg-primary-color text-white'>
      <div className='flex flex-col w-1/2 text-sm max-sm:w-full max-sm:items-center'>
        <NextImage
          src='/images/feelpay-logo-light.png'
          alt='logo-footer'
          className='max-2xl:w-[160px]'
          width={275}
          height={100}
        />
        <div className='flex flex-row justify-end border-b-2 max-2xl:py-4 py-10 mt-6 max-2xl:w-[11rem] w-[20rem] 2xl:text-[1.5rem]'>
          <ArrowButton text='Contáctanos' between />
        </div>
        <div className='flex flex-row justify-end border-b-2 max-2xl:py-4 py-10 max-2xl:w-[11rem] w-[20rem] 2xl:text-[1.5rem]'>
          <ArrowButton text='Legales' between />
        </div>
        <div className='flex flex-row justify-end border-b-2 max-2xl:py-4 py-10 max-2xl:w-[11rem] w-[20rem] 2xl:text-[1.5rem]'>
          <ArrowButton text='Información útil' between />
        </div>
      </div>
      <div className='flex flex-col w-1/2 max-sm:w-full'>
        <p className='text-base text-end max-sm:text-left mr-[8rem] max-sm:mr-0 max-sm:mt-8'>Síguenos en:</p>
        <div className='flex flex-row mt-6 self-end max-sm:self-center'>
          <span className='icon-instagram mr-10' />
          <span className='icon-facebook mr-10' />
          <NextImage
            className='mr-10'
            src='/images/linkedin-icon.png'
            alt='linkedin-icon'
            width={16}
            height={16}
          />
          <span className='icon-youtube mr-10' />
        </div>
      </div>
    </footer>
  )
}

export default Footer
