import NextImage from '../../atoms/NextImage/NextImage'

/**
 * StepsBanner is a component that renders the steps banner
 * @example <StepsBanner />
 * @returns The StepsBanner component
 */
const StepsBanner = () => {
  return (
    <section className='relative bg-cover bg-wave-pattern-md py-20 lg:py-32 px-4 lg:px-20 overflow-hidden'>
      <div className='max-w-7xl mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 text-white'>
          <div className='flex flex-col items-center text-center p-8 bg-white/10 backdrop-blur-sm rounded-3xl hover:bg-white/20 transition-all duration-300 hover:scale-105 z-10'>
            <div className='w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform'>
              <NextImage
                className='filter brightness-0 invert'
                src='/images/workspace-premium.png'
                alt='Como funciona'
                width={48}
                height={48}
              />
            </div>
            <h3 className='text-2xl lg:text-3xl font-bold mb-6'>Como funciona la experiencia digital</h3>
            <p className='text-base lg:text-lg leading-relaxed text-white/90'>
              Preaprobamos tu cupo, firmas en linea y desembolsamos donde lo necesites. Cada pago libera nuevamente tu capacidad de credito.
            </p>
          </div>
          <div className='flex flex-col items-center text-center p-8 bg-white/10 backdrop-blur-sm rounded-3xl hover:bg-white/20 transition-all duration-300 hover:scale-105 z-10'>
            <div className='w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform'>
              <NextImage
                className='filter brightness-0 invert'
                src='/images/edit-note.png'
                alt='Requisitos digitales'
                width={48}
                height={48}
              />
            </div>
            <h3 className='text-2xl lg:text-3xl font-bold mb-6'>Que requisitos pedimos</h3>
            <p className='text-base lg:text-lg leading-relaxed text-white/90'>
              Documento, soporte de ingresos y datos basicos de tu empresa o empleo. Los cargas en PDF y nuestro motor los valida al instante.
            </p>
          </div>
          <div className='flex flex-col items-center text-center p-8 bg-white/10 backdrop-blur-sm rounded-3xl hover:bg-white/20 transition-all duration-300 hover:scale-105 z-10'>
            <div className='w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform'>
              <NextImage
                className='filter brightness-0 invert'
                src='/images/credit-card.png'
                alt='Costos claros'
                width={48}
                height={48}
              />
            </div>
            <h3 className='text-2xl lg:text-3xl font-bold mb-6'>Cuanto cuesta</h3>
            <p className='text-base lg:text-lg leading-relaxed text-white/90'>
              Tasas transparentes, cuotas fijas y panel de seguimiento para que sepas cada cargo antes de aceptar.
            </p>
          </div>
        </div>
      </div>
      <NextImage
        className='absolute -bottom-40 right-0 opacity-30 pointer-events-none'
        src='/images/dots-right.png'
        alt='Decoracion'
        width={250}
        height={250}
      />
    </section>
  )
}

export default StepsBanner
