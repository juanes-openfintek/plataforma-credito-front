'use client'
import NextImage from '../../atoms/NextImage/NextImage'
import StaticLibranzaCalculator from '../../molecules/StaticLibranzaCalculator/StaticLibranzaCalculator'

/**
 * MainBannerLibranza is a component that renders the main banner for Libranza credit
 * @example <MainBannerLibranza />
 * @returns The MainBannerLibranza component
 */
const MainBannerLibranza = () => {
  return (
    <section id="creditos" className='flex justify-center items-center bg-gradient-to-br from-white to-gray-50 pt-24 pb-16 lg:pt-32 lg:pb-20 px-4 lg:px-20 min-h-screen'>
      <div className='max-w-7xl w-full flex flex-col lg:flex-row items-center gap-12'>
        <div className='w-full lg:w-1/2 animate-slide-up'>
          <div className='flex flex-col space-y-6'>
            <h1 className='text-gray-900 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight'>
              Crédito <span className='text-primary-color'>descuento de nómina</span> para tu tranquilidad
            </h1>
            <p className='text-gray-600 text-xl md:text-2xl leading-relaxed'>
              Obtén el crédito que necesitas con pagos automáticos descontados de tu nómina. Aprobación digital rápida, segura y sin trámites en menos de 24 horas.
            </p>
            <div className='pt-4'>
              <StaticLibranzaCalculator />
            </div>
          </div>
        </div>
        <div className='w-full lg:w-1/2 flex justify-center lg:justify-end'>
          <div className='relative w-full max-w-xl'>
            <div className='absolute inset-0 bg-gradient-to-r from-primary-color to-accent-color rounded-full blur-3xl opacity-10 animate-pulse'></div>
            <NextImage
              className='relative z-10 w-full h-auto drop-shadow-2xl'
              src='/images/main-banner.png'
              alt='Crédito libranza digital'
              width={750}
              height={750}
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default MainBannerLibranza
