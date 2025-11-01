import NextImage from '../../atoms/NextImage/NextImage'

/**
 * ForWhoBannerLibranza is a component that renders the for who banner for Libranza credit
 * @example <ForWhoBannerLibranza />
 * @returns The ForWhoBannerLibranza component
 */
const ForWhoBannerLibranza = () => {
  return (
    <section className='flex flex-row bg-white p-20 items-center max-lg:flex-col max-lg:py-10'>
      <NextImage
        className='w-1/2 p-10 max-lg:w-full max-lg:p-0 max-lg:mb-10 z-10'
        src='/images/group-three.png'
        alt='Crédito libranza para empleados'
        width={700}
        height={500}
      />
      <div className='w-1/2 text-black px-20 max-lg:px-0 max-lg:w-full'>
        <h2 className='max-2xl:text-xl text-[2.25rem] font-bold mb-4'>
          Para quién es el crédito por libranza
        </h2>
        <h3 className='max-2xl:text-base text-[1.75rem] font-bold text-primary-color mb-2'>
          Descuento automático de nómina para empleados y pensionados
        </h3>
        <p className='max-2xl:text-xs text-[1.25rem] mb-6'>
          El crédito por libranza es la solución perfecta para quienes tienen ingresos fijos y desean acceso rápido a capital con pagos automáticos y sin complicaciones.
        </p>
        <ul className='max-2xl:text-xs text-[1.25rem] space-y-3 list-disc list-inside'>
          <li><span className='font-bold text-primary-color'>Empleados en nómina:</span> obtén crédito con pagos automáticos descontados directamente de tu salario.</li>
          <li><span className='font-bold text-primary-color'>Pensionados:</span> accede a líneas de crédito con descuento de pensión garantizado y tasas preferenciales.</li>
          <li><span className='font-bold text-primary-color'>Trabajadores independientes:</span> si tienes ingresos demostrables, también puedes acceder a nuestras soluciones de financiamiento.</li>
        </ul>
      </div>
    </section>
  )
}

export default ForWhoBannerLibranza
