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
              ¡Crecemos <span className='font-extrabold text-white drop-shadow-lg'>junto a ti</span>!
            </h2>
            <p className='text-lg md:text-xl leading-relaxed text-white/90'>
              Somos una plataforma fintech comprometida con el crecimiento de tu negocio.
              Ofrecemos soluciones de financiamiento rápidas, seguras y transparentes, diseñadas
              especialmente para emprendedores y empresarios que buscan impulsar sus proyectos.
              Con nosotros, el financiamiento es simple y confiable.
            </p>
            <div className='flex flex-wrap gap-4 pt-4'>
              <div className='bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4 hover:bg-white/30 transition-all'>
                <p className='text-2xl font-bold'>24hrs</p>
                <p className='text-sm'>Respuesta rápida</p>
              </div>
              <div className='bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4 hover:bg-white/30 transition-all'>
                <p className='text-2xl font-bold'>100%</p>
                <p className='text-sm'>Digital</p>
              </div>
              <div className='bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4 hover:bg-white/30 transition-all'>
                <p className='text-2xl font-bold'>0</p>
                <p className='text-sm'>Trámites complejos</p>
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
        alt='Decoración'
        width={300}
        height={300}
      />
    </section>
  )
}

export default GrowthBanner
