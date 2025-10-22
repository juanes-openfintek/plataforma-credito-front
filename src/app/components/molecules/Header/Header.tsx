'use client'

import NextImage from '../../atoms/NextImage/NextImage'
import RoundButton from '../../atoms/RoundButton/RoundButton'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import useDecryptedSession from '../../../hooks/useDecryptedSession'
import redirectionByRole from '../../../helpers/redirectionByRole'
/**
 * Header is a component that renders the header
 * @example <Header />
 * @returns The Header component
 */
const Header = () => {
  /**
   * Get the current path
  */
  const path = usePathname()
  /**
   * State to manage the menu visibility
   */
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  /**
   * userData is the data of the user
   */
  const userData: any = useDecryptedSession()
  return (
    <>
      <header className='flex fixed justify-between items-center bg-white py-2 px-20 max-lg:px-0 max-lg:justify-center w-screen shadow-md font-semibold text-base z-50'>
        <NextImage
          src='/images/feelpay-logo.png'
          alt='logo'
          width={150}
          height={27}
        />
        <NextImage
          src='/images/bars-solid.svg'
          alt='menu'
          className='absolute right-5 lg:hidden'
          onClickHandler={() => setIsMenuOpen(!isMenuOpen)}
          width={20}
          height={20}
        />
        <nav className='flex items-center'>
          <Link
            href='/'
            className={
              path === '/'
                ? 'text-black hover:text-primary-color mx-4 px-4 border-b-2 border-accent-light-color max-lg:hidden'
                : 'text-black hover:text-primary-color mx-4 px-4 max-lg:hidden'
            }
          >
            Inicio
          </Link>
          <Link
            href='/#creditos'
            className='text-black hover:text-primary-color mx-4 px-4 max-lg:hidden'
          >
            Créditos
          </Link>
          <Link
            href='/#beneficios'
            className='text-black hover:text-primary-color mx-4 px-4 max-lg:hidden'
          >
            Beneficios
          </Link>
          <Link
            href='/#nosotros'
            className='text-black hover:text-primary-color mx-4 px-4 max-lg:hidden'
          >
            Nosotros
          </Link>
          <Link
            href='/#preguntas'
            className='text-black hover:text-primary-color mx-4 px-4 max-lg:hidden'
          >
            Preguntas
          </Link>
          <Link
            href='/#contactanos'
            className='text-black hover:text-primary-color mx-4 px-4 max-lg:hidden'
          >
            Contáctanos
          </Link>
          <Link
            href={userData?.token ? redirectionByRole(userData?.roles ?? 'user') : '/login'}
            className='text-black hover:text-primary-color mx-4 px-4 max-lg:hidden'
          >
            <RoundButton text='Ingresar' lightStyle />
          </Link>
        </nav>
      </header>
      {isMenuOpen && (
        <nav className='flex flex-col items-start px-4 font-bold text-2xl pt-16 h-screen w-full fixed bg-secondary-color lg:hidden z-60'>
          <Link href='/login' className='self-center'>
            <RoundButton text='Ingresar' lightStyle />
          </Link>
          <Link
            href='/'
            className={
              path === '/'
                ? 'my-4 pt-5 border-b-2 border-accent-light-color text-primary-color'
                : 'my-4 pt-5 text-primary-color'
            }
          >
            Inicio
          </Link>
          <Link
            href='/#creditos'
            className='my-4 text-primary-color'
          >
            {' '}
            Créditos
          </Link>
          <Link
            href='/#beneficios'
            className='my-4 text-primary-color'
          >
            Beneficios
          </Link>
          <Link
            href='/#nosotros'
            className='my-4 text-primary-color'
          >
            Nosotros
          </Link>
          <Link
            href='/#preguntas'
            className='my-4 text-primary-color'
          >
            Preguntas
          </Link>
          <Link
            href='/#contactanos'
            className='my-4 text-primary-color'
          >
            Contáctanos
          </Link>
        </nav>
      )}
    </>
  )
}

export default Header
