import NextImage from '../../atoms/NextImage/NextImage'

/**
 * StepsBannerLibranza is a component that renders the steps banner for Libranza credit
 * @example <StepsBannerLibranza />
 * @returns The StepsBannerLibranza component
 */
const StepsBannerLibranza = () => {
  return (
    <section className='relative bg-cover bg-wave-pattern-md py-20 lg:py-32 px-4 lg:px-20 overflow-hidden'>
      <div className='max-w-7xl mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 text-white'>
          <div className='flex flex-col items-center text-center p-8 bg-white/10 backdrop-blur-sm rounded-3xl hover:bg-white/20 transition-all duration-300 hover:scale-105 z-10'>
            <div className='w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform'>
              <NextImage
                className='filter brightness-0 invert'
                src='/images/workspace-premium.png'
                alt='Cómo funciona libranza'
                width={48}
                height={48}
              />
            </div>
            <h3 className='text-2xl lg:text-3xl font-bold mb-6'>Cómo funciona el descuento de nómina</h3>
            <p className='text-base lg:text-lg leading-relaxed text-white/90'>
              Solicita tu crédito, recibe la aprobación en 24 horas y comienza a recibir el dinero con pagos automáticos descontados directamente de tu salario.
            </p>
          </div>
          <div className='flex flex-col items-center text-center p-8 bg-white/10 backdrop-blur-sm rounded-3xl hover:bg-white/20 transition-all duration-300 hover:scale-105 z-10'>
            <div className='w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform'>
              <NextImage
                className='filter brightness-0 invert'
                src='/images/edit-note.png'
                alt='Requisitos para libranza'
                width={48}
                height={48}
              />
            </div>
            <h3 className='text-2xl lg:text-3xl font-bold mb-6'>Qué requisitos pedimos</h3>
            <p className='text-base lg:text-lg leading-relaxed text-white/90'>
              Documento de identidad, certificado de ingresos o comprobante de nómina, y datos básicos de tu empleo. Todo se carga de forma digital.
            </p>
          </div>
          <div className='flex flex-col items-center text-center p-8 bg-white/10 backdrop-blur-sm rounded-3xl hover:bg-white/20 transition-all duration-300 hover:scale-105 z-10'>
            <div className='w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform'>
              <NextImage
                className='filter brightness-0 invert'
                src='/images/credit-card.png'
                alt='Costos transparentes'
                width={48}
                height={48}
              />
            </div>
            <h3 className='text-2xl lg:text-3xl font-bold mb-6'>Tasas y costos transparentes</h3>
            <p className='text-base lg:text-lg leading-relaxed text-white/90'>
              Tasas especiales para descuento de nómina, cuotas fijas y detalles completos de todos los costos antes de aceptar tu crédito.
            </p>
          </div>
        </div>
      </div>
      <NextImage
        className='absolute -bottom-40 right-0 opacity-30 pointer-events-none'
        src='/images/dots-right.png'
        alt='Decoración'
        width={250}
        height={250}
      />
    </section>
  )
}

export default StepsBannerLibranza
