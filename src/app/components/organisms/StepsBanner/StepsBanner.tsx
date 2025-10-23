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
                alt='Cómo funciona'
                width={48}
                height={48}
              />
            </div>
            <h3 className='text-2xl lg:text-3xl font-bold mb-6'>¿Cómo funciona?</h3>
            <p className='text-base lg:text-lg leading-relaxed text-white/90'>
              Nuestro sistema de crédito rotativo te permite acceder a un cupo aprobado.
              Solicitas desembolsos según tus necesidades y, a medida que pagas, recuperas
              tu cupo disponible.
            </p>
          </div>
          <div className='flex flex-col items-center text-center p-8 bg-white/10 backdrop-blur-sm rounded-3xl hover:bg-white/20 transition-all duration-300 hover:scale-105 z-10'>
            <div className='w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform'>
              <NextImage
                className='filter brightness-0 invert'
                src='/images/edit-note.png'
                alt='Requisitos'
                width={48}
                height={48}
              />
            </div>
            <h3 className='text-2xl lg:text-3xl font-bold mb-6'>¿Qué requisitos?</h3>
            <p className='text-base lg:text-lg leading-relaxed text-white/90'>
              Si eres mayor de edad y resides en Colombia, ya cumples la mitad de los requisitos.
              Los demás son igual de simples: documentos básicos y información de tu negocio.
            </p>
          </div>
          <div className='flex flex-col items-center text-center p-8 bg-white/10 backdrop-blur-sm rounded-3xl hover:bg-white/20 transition-all duration-300 hover:scale-105 z-10'>
            <div className='w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform'>
              <NextImage
                className='filter brightness-0 invert'
                src='/images/credit-card.png'
                alt='Costos'
                width={48}
                height={48}
              />
            </div>
            <h3 className='text-2xl lg:text-3xl font-bold mb-6'>¿Cuánto cuesta?</h3>
            <p className='text-base lg:text-lg leading-relaxed text-white/90'>
              Transparencia total: te explicamos cada cargo sin costos ocultos ni letra pequeña.
              Además, te mostramos cómo optimizar tus pagos para reducir intereses.
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

export default StepsBanner
