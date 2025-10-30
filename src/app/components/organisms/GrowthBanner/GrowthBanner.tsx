import NextImage from '../../atoms/NextImage/NextImage'

/**
 * GrowthBanner is a component that renders the growth banner
 * @example <GrowthBanner />
 * @returns The GrowthBanner component
 */
const GrowthBanner = () => {
  return (
    <section id="nosotros" className='relative bg-cover bg-wave-pattern-lg py-20 lg:py-32 px-4 lg:px-20 overflow-hidden'>
      <div className='max-w-7xl mx-auto'>
        <div className='flex flex-col lg:flex-row items-center gap-12 lg:gap-16 text-white'>
          <div className='w-full lg:w-1/2 space-y-6 z-10'>
            <h2 className='text-4xl md:text-5xl lg:text-6xl font-bold leading-tight'>
              Crecemos contigo digitalizando el acceso al credito
            </h2>
            <p className='text-lg md:text-xl leading-relaxed text-white/90'>
              Somos la plataforma que convierte cada solicitud en una experiencia 100 por ciento digital. Unificamos tarjetas empresariales, libranza y creditos de libre inversion para que tu equipo tenga capital inmediato sin desgaste operativo.
            </p>
            <div className='flex flex-wrap gap-4 pt-4'>
              <div className='bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4 hover:bg-white/30 transition-all'>
                <p className='text-2xl font-bold'>24h</p>
                <p className='text-sm'>Aprobacion digital</p>
              </div>
              <div className='bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4 hover:bg-white/30 transition-all'>
                <p className='text-2xl font-bold'>100%</p>
                <p className='text-sm'>Proceso online</p>
              </div>
              <div className='bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4 hover:bg-white/30 transition-all'>
                <p className='text-2xl font-bold'>Multi</p>
                <p className='text-sm'>Productos en un lugar</p>
              </div>
            </div>
          </div>
          <div className='w-full lg:w-1/2 z-10 flex justify-center'>
            <NextImage
              className='w-full max-w-2xl h-auto drop-shadow-2xl hover:scale-105 transition-transform duration-300'
              src='/images/group-two.png'
              alt='Crecemos contigo'
              width={700}
              height={500}
            />
          </div>
        </div>
      </div>
      <NextImage
        className='absolute left-0 -bottom-32 opacity-30 pointer-events-none'
        src='/images/dots-left-two.png'
        alt='Decoracion'
        width={300}
        height={300}
      />
    </section>
  )
}

export default GrowthBanner
