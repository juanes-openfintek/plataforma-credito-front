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
      <section className='flex justify-content-center bg-white pt-20 lg:p-20 lg:mt-8'>
        <div className='w-full lg:w-1/2'>
          <div className='flex flex-col px-8'>
            <h2 className='text-black text-[3.75rem] max-2xl:text-4xl'>
              ¿
              <span className='text-primary-color font-bold'>
                Necesitas capital
              </span>{' '}
              para tu negocio o emprendimiento?
            </h2>
            <p className='text-black text-[1.5625rem] max-2xl:text-md my-4'>
              <span className='text-primary-color font-bold'>¡Solicítalo ya!</span> Obtén tu crédito en menos de 24 Hrs
            </p>
            <BasicCalculator />
          </div>
        </div>
        <div className='w-1/2 px-8 hidden lg:block'>
          <NextImage
            className='float-right'
            src='/images/main-banner.png'
            alt='Next.js logo'
            width={750}
            height={750}
          />
        </div>
      </section>
      <UserDataForms />
    </CreditContextProvider>
  )
}

export default MainBanner
