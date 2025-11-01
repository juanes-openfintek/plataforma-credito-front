import NextImage from '../../atoms/NextImage/NextImage'

/**
 * BenefitsBannerLibranza is a component that renders the benefits banner for Libranza credit
 * @example <BenefitsBannerLibranza />
 * @returns The BenefitsBannerLibranza component
 */
const BenefitsBannerLibranza = () => {
  return (
    <section id="beneficios" className='py-20 px-4 lg:px-20 bg-gradient-to-b from-gray-50 to-white'>
      <div className='max-w-7xl mx-auto'>
        <h2 className='text-gray-900 text-4xl md:text-5xl lg:text-6xl text-center font-bold mb-16'>
          Beneficios del crédito por libranza
        </h2>
        <div className='flex flex-col lg:flex-row gap-12 items-center'>
          <div className='relative w-full lg:w-1/2 flex justify-center'>
            <div className='relative'>
              <div className='absolute -top-8 -left-8 bg-white rounded-full px-6 py-3 shadow-xl z-10 hover:scale-105 transition-transform'>
                <NextImage
                  src='/images/openfintek-logo.png'
                  alt='OpenFintek logo'
                  width={120}
                  height={40}
                  className='object-contain max-h-10'
                />
              </div>
              <NextImage
                src='/images/group-one.png'
                alt='Beneficios del crédito libranza'
                width={600}
                height={450}
                className='rounded-2xl shadow-xl'
              />
            </div>
          </div>
          <div className='flex flex-col w-full lg:w-1/2 gap-8'>
            <div className='flex items-center gap-4 group hover:scale-105 transition-transform'>
              <div className='flex-shrink-0 w-20 h-20 md:w-24 md:h-24 relative'>
                <NextImage
                  className='drop-shadow-lg group-hover:drop-shadow-2xl transition-all'
                  src='/images/circle-dollar-icon.png'
                  alt='Pagos automáticos'
                  width={96}
                  height={96}
                />
              </div>
              <div className='bg-gradient-to-r from-primary-color to-accent-color rounded-3xl px-8 py-6 flex-1 shadow-lg hover:shadow-xl transition-shadow'>
                <p className='text-white text-base md:text-lg font-medium leading-relaxed'>
                  Pagos automáticos y seguros descuento de nómina. Sin sorpresas, sin riesgos de incumplimiento.
                </p>
              </div>
            </div>
            <div className='flex items-center gap-4 group hover:scale-105 transition-transform'>
              <div className='flex-shrink-0 w-20 h-20 md:w-24 md:h-24 relative'>
                <NextImage
                  className='drop-shadow-lg group-hover:drop-shadow-2xl transition-all'
                  src='/images/circle-secure-icon.png'
                  alt='Tasas competitivas'
                  width={96}
                  height={96}
                />
              </div>
              <div className='bg-gradient-to-r from-primary-color to-accent-color rounded-3xl px-8 py-6 flex-1 shadow-lg hover:shadow-xl transition-shadow'>
                <p className='text-white text-base md:text-lg font-medium leading-relaxed'>
                  Tasas competitivas y plazos flexibles. Encuentra la opción que se ajusta mejor a tu presupuesto.
                </p>
              </div>
            </div>
            <div className='flex items-center gap-4 group hover:scale-105 transition-transform'>
              <div className='flex-shrink-0 w-20 h-20 md:w-24 md:h-24 relative'>
                <NextImage
                  className='drop-shadow-lg group-hover:drop-shadow-2xl transition-all'
                  src='/images/circle-bank-icon.png'
                  alt='Aprobación rápida'
                  width={96}
                  height={96}
                />
              </div>
              <div className='bg-gradient-to-r from-primary-color to-accent-color rounded-3xl px-8 py-6 flex-1 shadow-lg hover:shadow-xl transition-shadow'>
                <p className='text-white text-base md:text-lg font-medium leading-relaxed'>
                  Aprobación en menos de 24 horas. Solicitud 100% digital sin papeleos ni trámites complicados.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BenefitsBannerLibranza
