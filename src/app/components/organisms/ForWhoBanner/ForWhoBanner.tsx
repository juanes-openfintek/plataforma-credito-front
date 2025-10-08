import NextImage from '../../atoms/NextImage/NextImage'

/**
 * ForWhoBanner is a component that renders the for who banner
 * @example <ForWhoBanner />
 * @returns The ForWhoBanner component
 */
const ForWhoBanner = () => {
  return (
    <section className='flex flex-row bg-white p-20 items-center max-lg:flex-col max-lg:py-10'>
      <NextImage
        className='w-1/2 p-10 max-lg:w-full max-lg:p-0 max-lg:mb-10 z-10'
        src='/images/group-three.png'
        alt='ForWhoBanner'
        width={700}
        height={500}
      />
      <div className='w-1/2 text-black px-20 max-lg:px-0 max-lg:w-full'>
        <h2 className='max-2xl:text-xl text-[2.25rem] font-bold mb-4'>
          {' '}
          ¿Para <span className='text-primary-color'>quién</span> es el crédito?
        </h2>
        <h3 className='max-2xl:text-base text-[1.75rem] font-bold text-primary-color mb-2'>
          Libre inversión
        </h3>
        <p className='max-2xl:text-xs text-[1.25rem]'>
          Monto mínimo aprobado de $500.000 y máximo de acuerdo a la capacidad
          de endeudamiento. <br /><br /> Plazo mínimo 6 meses y máximo 36 meses.
          <br /><br /> Es un <span className='font-bold text-primary-color'>crédito de libre destinación</span>, exclusivo para esas
          necesidades soñadas, con financiación a corto y mediano plazo.
          <br /><br /> Manejamos cuotas fijas durante toda la vigencia del préstamo,
          incluyendo capital e intereses.
          <br /><br />
          Aseguramos tu crédito en caso de calamidad.
        </p>
      </div>
    </section>
  )
}

export default ForWhoBanner
