import NextImage from '../../atoms/NextImage/NextImage'

/**
 * BenefitsBanner is a component that renders the benefits banner
 * @example <BenefitsBanner />
 * @returns The BenefitsBanner component
 */
const BenefitsBanner = () => {
  return (
    <section id="beneficios" className='py-20 px-4 lg:px-20 bg-gradient-to-b from-gray-50 to-white'>
      <div className='max-w-7xl mx-auto'>
        <h2 className='text-gray-900 text-4xl md:text-5xl lg:text-6xl text-center font-bold mb-16'>
          Beneficios de nuestra plataforma de credito digital
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
                alt='Beneficios de nuestros creditos'
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
                  alt='Aprobacion digital'
                  width={96}
                  height={96}
                />
              </div>
              <div className='bg-gradient-to-r from-primary-color to-accent-color rounded-3xl px-8 py-6 flex-1 shadow-lg hover:shadow-xl transition-shadow'>
                <p className='text-white text-base md:text-lg font-medium leading-relaxed'>
                  Simula, solicita y firma tu credito completamente en linea con desembolsos en menos de 24 horas.
                </p>
              </div>
            </div>
            <div className='flex items-center gap-4 group hover:scale-105 transition-transform'>
              <div className='flex-shrink-0 w-20 h-20 md:w-24 md:h-24 relative'>
                <NextImage
                  className='drop-shadow-lg group-hover:drop-shadow-2xl transition-all'
                  src='/images/circle-secure-icon.png'
                  alt='Seguridad digital'
                  width={96}
                  height={96}
                />
              </div>
              <div className='bg-gradient-to-r from-primary-color to-accent-color rounded-3xl px-8 py-6 flex-1 shadow-lg hover:shadow-xl transition-shadow'>
                <p className='text-white text-base md:text-lg font-medium leading-relaxed'>
                  Firma digital segura, verificacion automatica y seguimiento en tiempo real desde cualquier dispositivo.
                </p>
              </div>
            </div>
            <div className='flex items-center gap-4 group hover:scale-105 transition-transform'>
              <div className='flex-shrink-0 w-20 h-20 md:w-24 md:h-24 relative'>
                <NextImage
                  className='drop-shadow-lg group-hover:drop-shadow-2xl transition-all'
                  src='/images/circle-bank-icon.png'
                  alt='Portafolio integral'
                  width={96}
                  height={96}
                />
              </div>
              <div className='bg-gradient-to-r from-primary-color to-accent-color rounded-3xl px-8 py-6 flex-1 shadow-lg hover:shadow-xl transition-shadow'>
                <p className='text-white text-base md:text-lg font-medium leading-relaxed'>
                  Accede a tarjetas empresariales, libranza, libre inversion y capital de trabajo desde un mismo ecosistema.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BenefitsBanner
