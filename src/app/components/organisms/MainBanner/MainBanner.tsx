'use client'
import { CreditContextProvider } from '../../../context/creditContext'
import NextImage from '../../atoms/NextImage/NextImage'
import BasicCalculator from '../../molecules/BasicCalculator/BasicCalculator'
import UserDataForms from '../UserDataForms/UserDataForms'

/**
 * MainBanner is a component that renders the main banner
 * @example <MainBanner />
 * @returns The MainBanner component
 */
const MainBanner = () => {
  return (
    <CreditContextProvider>
      <section id="creditos" className='flex justify-center items-center bg-gradient-to-br from-white to-gray-50 pt-24 pb-16 lg:pt-32 lg:pb-20 px-4 lg:px-20 min-h-screen'>
        <div className='max-w-7xl w-full flex flex-col lg:flex-row items-center gap-12'>
          <div className='w-full lg:w-1/2 animate-slide-up'>
            <div className='flex flex-col space-y-6'>
              <h1 className='text-gray-900 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight'>
                Activa creditos digitales <span className='text-primary-color'>rapidos y sin papeles</span>
              </h1>
              <p className='text-gray-600 text-xl md:text-2xl leading-relaxed'>
                Gestiona tarjetas de credito, libranza, libre inversion y capital de trabajo en un solo flujo digital con respuesta en menos de 24 horas.
              </p>
              <div className='pt-4'>
                <BasicCalculator />
              </div>
            </div>
          </div>
          <div className='w-full lg:w-1/2 flex justify-center lg:justify-end'>
            <div className='relative w-full max-w-xl'>
              <div className='absolute inset-0 bg-gradient-to-r from-primary-color to-accent-color rounded-full blur-3xl opacity-10 animate-pulse'></div>
              <NextImage
                className='relative z-10 w-full h-auto drop-shadow-2xl'
                src='/images/main-banner.png'
                alt='Creditos digitales para tu negocio'
                width={750}
                height={750}
                priority
              />
            </div>
          </div>
        </div>
      </section>
      <UserDataForms />
    </CreditContextProvider>
  )
}

export default MainBanner
