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
      <header className='flex fixed justify-between items-center bg-white py-4 px-20 max-lg:px-4 max-lg:justify-between w-screen shadow-lg font-semibold text-base z-50 transition-all duration-300'>
        <Link href='/' className='flex items-center hover:opacity-80 transition-opacity'>
          <NextImage
            src='/images/openfintek-logo.png'
            alt='OpenFintek logo'
            width={120}
            height={30}
            className='object-contain max-h-8'
          />
        </Link>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className='lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors'
          aria-label='Toggle menu'
        >
          <NextImage
            src='/images/bars-solid.svg'
            alt='menu'
            width={24}
            height={24}
          />
        </button>
        <nav className='flex items-center gap-2'>
          <Link
            href='/'
            className={
              path === '/'
                ? 'text-primary-color mx-2 px-4 py-2 border-b-2 border-primary-color max-lg:hidden transition-all'
                : 'text-gray-700 hover:text-primary-color mx-2 px-4 py-2 max-lg:hidden transition-all'
            }
          >
            Inicio
          </Link>
          <Link
            href='/#creditos'
            className='text-gray-700 hover:text-primary-color mx-2 px-4 py-2 max-lg:hidden transition-all'
          >
            Créditos
          </Link>
          <Link
            href='/#beneficios'
            className='text-gray-700 hover:text-primary-color mx-2 px-4 py-2 max-lg:hidden transition-all'
          >
            Beneficios
          </Link>
          <Link
            href='/#nosotros'
            className='text-gray-700 hover:text-primary-color mx-2 px-4 py-2 max-lg:hidden transition-all'
          >
            Nosotros
          </Link>
          <Link
            href='/#preguntas'
            className='text-gray-700 hover:text-primary-color mx-2 px-4 py-2 max-lg:hidden transition-all'
          >
            Preguntas
          </Link>
          <Link
            href='/#contactanos'
            className='text-gray-700 hover:text-primary-color mx-2 px-4 py-2 max-lg:hidden transition-all'
          >
            Contáctanos
          </Link>
          <Link
            href={userData?.token ? redirectionByRole(userData?.roles ?? 'user') : '/login'}
            className='ml-2 max-lg:hidden'
          >
            <RoundButton text='Ingresar' lightStyle />
          </Link>
        </nav>
      </header>
      {isMenuOpen && (
        <>
          <div
            className='fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40 animate-fade-in'
            onClick={() => setIsMenuOpen(false)}
          />
          <nav className='flex flex-col items-start px-8 py-6 font-semibold text-lg pt-24 h-screen w-80 fixed right-0 top-0 bg-white lg:hidden z-50 shadow-2xl animate-slide-in'>
            <button
              onClick={() => setIsMenuOpen(false)}
              className='absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors'
              aria-label='Close menu'
            >
              <span className='text-2xl text-gray-600'>&times;</span>
            </button>
            <Link
              href={userData?.token ? redirectionByRole(userData?.roles ?? 'user') : '/login'}
              className='self-center mb-6 w-full'
              onClick={() => setIsMenuOpen(false)}
            >
              <RoundButton text='Ingresar' lightStyle />
            </Link>
            <Link
              href='/'
              className={
                path === '/'
                  ? 'my-3 py-3 px-4 w-full border-l-4 border-primary-color text-primary-color bg-gray-50 rounded-r transition-all'
                  : 'my-3 py-3 px-4 w-full text-gray-700 hover:bg-gray-50 hover:text-primary-color rounded transition-all'
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link
              href='/#creditos'
              className='my-3 py-3 px-4 w-full text-gray-700 hover:bg-gray-50 hover:text-primary-color rounded transition-all'
              onClick={() => setIsMenuOpen(false)}
            >
              Créditos
            </Link>
            <Link
              href='/#beneficios'
              className='my-3 py-3 px-4 w-full text-gray-700 hover:bg-gray-50 hover:text-primary-color rounded transition-all'
              onClick={() => setIsMenuOpen(false)}
            >
              Beneficios
            </Link>
            <Link
              href='/#nosotros'
              className='my-3 py-3 px-4 w-full text-gray-700 hover:bg-gray-50 hover:text-primary-color rounded transition-all'
              onClick={() => setIsMenuOpen(false)}
            >
              Nosotros
            </Link>
            <Link
              href='/#preguntas'
              className='my-3 py-3 px-4 w-full text-gray-700 hover:bg-gray-50 hover:text-primary-color rounded transition-all'
              onClick={() => setIsMenuOpen(false)}
            >
              Preguntas
            </Link>
            <Link
              href='/#contactanos'
              className='my-3 py-3 px-4 w-full text-gray-700 hover:bg-gray-50 hover:text-primary-color rounded transition-all'
              onClick={() => setIsMenuOpen(false)}
            >
              Contáctanos
            </Link>
          </nav>
        </>
      )}
    </>
  )
}

export default Header
