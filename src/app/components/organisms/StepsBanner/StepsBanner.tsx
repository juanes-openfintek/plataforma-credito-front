import NextImage from '../../atoms/NextImage/NextImage'

/**
 * StepsBanner is a component that renders the steps banner
 * @example <StepsBanner />
 * @returns The StepsBanner component
 */
const StepsBanner = () => {
  return (
    <section className='flex flex-row max-lg:flex-col bg-cover bg-white bg-wave-pattern-md p-20 max-lg:p-6 relative text-white'>
      <div className='flex flex-col items-center justify-center p-16 max-lg:p-6 w-1/3 max-lg:w-full text-center z-10'>
        <h2 className='max-2xl:text-lg text-[1.875rem] font-bold'>¿Cómo funciona?</h2>
        <NextImage
          className='my-10'
          src='/images/workspace-premium.png'
          alt='workspace-premium'
          width={50}
          height={50}
        />
        <p className='max-2xl:text-xs text-[1.25rem]'>
          Los créditos en Horizont no son como otros: son un cupo de crédito
          rotativo. Acá te aprobamos un monto. Tú pides desembolsos. Y a medida
          que pagas, liberas tu cupo
        </p>
      </div>
      <div className='flex flex-col items-center justify-center p-16 max-lg:p-6 w-1/3 max-lg:w-full text-center z-10'>
        <h2 className='max-2xl:text-lg text-[1.875rem] font-bold'>¿Qué requisitos?</h2>
        <NextImage
          className='my-10'
          src='/images/edit-note.png'
          alt='workspace-premium'
          width={50}
          height={50}
        />
        <p className='max-2xl:text-xs text-[1.25rem]'>
          ¿Eres mayor de edad y vives en Colombia? Ya tienes la mitad de los
          requisitos para pedir tu cupo de crédito. Y los otros dos son igual de
          sencillos.
        </p>
      </div>
      <div className='flex flex-col items-center justify-center p-16 max-lg:p-6 w-1/3 max-lg:w-full text-center z-10'>
        <h2 className='max-2xl:text-lg text-[1.875rem] font-bold'>¿Cuánto cuesta?</h2>
        <NextImage
          className='my-10'
          src='/images/credit-card.png'
          alt='workspace-premium'
          width={50}
          height={50}
        />
        <p className='max-2xl:text-xs text-[1.25rem]'>
          Queremos explicarte qué estás pagado, sin costos ocultos ni letra
          pequeña. Además, acá te mostramos cómo pagar menos en cargos e interese
        </p>
      </div>
      <NextImage
        className='absolute -bottom-[10rem] right-0'
        src='/images/dots-right.png'
        alt='workspace-premium'
        width={250}
        height={250}
      />
    </section>
  )
}

export default StepsBanner
