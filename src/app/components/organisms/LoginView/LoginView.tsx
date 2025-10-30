import React from 'react'
import Link from 'next/link'
import NextImage from '../../atoms/NextImage/NextImage'
import RoundButton from '../../atoms/RoundButton/RoundButton'

/**
 * LoginView is a component that renders the login view
 * @example <LoginView />
 * @returns The LoginView component
 */
const LoginView = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <section className='relative flex flex-col lg:flex-row max-lg:px-10 justify-content-center h-screen'>
      <Link
        href='/'
        className='absolute top-6 right-6 max-lg:top-4 max-lg:right-4 z-20 w-44'
      >
        <RoundButton text='Volver al inicio' lightStyle />
      </Link>
      <div className='container w-full xl:w-1/2 h-full flex justify-center items-center'>
        <div className='lg:w-1/2 bg-white px-2 2xl:px-8 py-10'>
          {children}
        </div>
      </div>
      <div className='max-xl:hidden mt-[4rem] relative w-1/2 lg:pr-[6rem] 2xl:pr-[12rem] pl-[4rem] flex flex-col justify-center items-center font-poppins text-white lg:leading-[25px] 2xl:leading-[30px]'>
        <NextImage
          src='/images/main-banner.png'
          alt='main-image'
          className='ml-auto 2xl:mt-[-5rem] z-10'
          width={600}
          height={600}
          priority
        />
        <NextImage
          src='/images/bg-wave-lateral.png'
          alt='wave-right'
          className='absolute z-0 w-full h-[95%] right-0 bottom-0'
          priority
          width={600}
          height={500}
        />
        <h2 className='self-end lg:text-[2rem] 2xl:text-[2.5rem] font-bold mt-10 z-10'>
          Laura Torres
        </h2>
        <h3 className='self-end lg:text-[1rem] 2xl:text-[1.56rem] font-semibold z-10'>
          Directora financiera
        </h3>
        <p className='text-end text-[1rem] 2xl:text-[1.56rem] mt-4 2xl:mt-10 z-10 pl-[10rem] 2xl:leading-6'>
          Con nuestra plataforma digital gestionamos tarjetas, libranza y libre inversion en un solo lugar y liberamos capital en horas.
        </p>
      </div>
    </section>
  )
}

export default LoginView
