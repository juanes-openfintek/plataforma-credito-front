import NextImage from '../../atoms/NextImage/NextImage'

/**
 * GrowthBanner is a component that renders the growth banner
 * @example <GrowthBanner />
 * @returns The GrowthBanner component
 */
const GrowthBanner = () => {
  return (
    <section id="nosotros" className='flex flex-row bg-cover bg-white bg-wave-pattern-lg h-[60rem] p-20 items-center max-lg:flex-col relative text-white'>
      <div className='w-1/2 p-20 max-lg:w-full max-lg:p-0'>
        <h2 className='max-2xl:text-4xl text-[3.125rem]'>
          ¡Crecemos <span className='font-bold'>junto a ti</span>!
        </h2>
        <p className='mt-6 2xl:text-[1.25rem]'>
          Acá irá texto de relleno que permita exponer que es Marca Blanca Creditos, cómo está
          compuesta y demás información con el fin de brindar confianza con los
          usuarios para que estos adquieran los beneficios que brinda la marca.
          Acá irá texto de relleno que permita exponer que es Marca Blanca
        </p>
      </div>
      <NextImage
        className='w-1/2 p-10 max-lg:w-full max-lg:p-0 max-lg:mt-10 z-10'
        src='/images/group-two.png'
        alt='Growth Banner'
        width={700}
        height={500}
      />
      <NextImage className='absolute -left-2 -bottom-[8rem] max-lg:-bottom-[4rem]' src='/images/dots-left-two.png' alt='Curve' width={300} height={300} />
    </section>
  )
}

export default GrowthBanner
