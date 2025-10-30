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
          Para quien es nuestro portafolio de credito digital
        </h2>
        <h3 className='max-2xl:text-base text-[1.75rem] font-bold text-primary-color mb-2'>
          Tarjetas, libranza y libre inversion en un mismo lugar
        </h3>
        <p className='max-2xl:text-xs text-[1.25rem] mb-6'>
          Creamos una experiencia simple para empresas, independientes y colaboradores que necesitan soluciones de financiamiento especializadas sin procesos manuales.
        </p>
        <ul className='max-2xl:text-xs text-[1.25rem] space-y-3 list-disc list-inside'>
          <li><span className='font-bold text-primary-color'>Tarjetas empresariales:</span> controla gastos de equipo con cupos escalables y seguimiento en tiempo real.</li>
          <li><span className='font-bold text-primary-color'>Credito por libranza:</span> cuotas fijas descontadas automaticamente para colaboradores o pensionados.</li>
          <li><span className='font-bold text-primary-color'>Libre inversion y capital de trabajo:</span> montos desde 500.000 con plazos flexibles y desembolsos digitales.</li>
        </ul>
      </div>
    </section>
  )
}

export default ForWhoBanner
