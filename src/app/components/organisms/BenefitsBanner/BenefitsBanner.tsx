import NextImage from '../../atoms/NextImage/NextImage'

/**
 * BenefitsBanner is a component that renders the benefits banner
 * @example <BenefitsBanner />
 * @returns The BenefitsBanner component
 */
const BenefitsBanner = () => {
  return (
    <section id="beneficios" className='p-20 max-lg:p-8 bg-white'>
      <h2 className='text-black max-2xl:text-4xl text-[3.75rem] text-center'>
        ¿<span className='text-primary-color font-bold'>Qué Beneficios</span>{' '}
        ofrece Marca Blanca Creditos?
      </h2>
      <div className='flex flex-row my-12 max-md:justify-start max-lg:justify-center'>
        <div className='relative w-1/2 block max-lg:hidden lg:ml-[5rem]'>
          <div className='absolute -left-10 -top-4 bg-white rounded-[30rem] px-6 py-3 shadow-md'>
            <NextImage
              src='/images/feelpay-logo.png'
              alt='logo'
              width={200}
              height={76}
            />
          </div>
          <NextImage
            src='/images/group-one.png'
            alt='Beneficios'
            width={700}
            height={500}
          />
        </div>
        <div className='flex flex-col w-1/2 self-center'>
          <div className='flex flex-row items-center relative max-2xl:mb-12 mb-[5rem] lg:ml-[5rem]'>
            <NextImage
              className='absolute max-2xl:w-[6.9rem] w-[8.9rem]'
              src='/images/circle-dollar-icon.png'
              alt='logo'
              width={143}
              height={143}
            />
            <div className='bg-primary-color rounded-[30rem] max-2xl:px-14 px-20 py-5 ml-20'>
              <p className='text-white max-2xl:text-xs text-lg max-xl:w-[10rem] w-[14rem]'>Amortización cuota fija con capital e intereses.</p>
            </div>
          </div>
          <div className='flex flex-row items-center relative max-2xl:mb-12 mb-[5rem] lg:ml-[5rem]'>
            <NextImage
              className='absolute  max-2xl:w-[6.9rem] w-[8.9rem]'
              src='/images/circle-secure-icon.png'
              alt='logo'
              width={143}
              height={143}
            />
            <div className='bg-primary-color rounded-[30rem] max-2xl:px-14 px-20 py-5 ml-20'>
              <p className='text-white max-2xl:text-xs text-lg max-xl:w-[10rem] max-2xl:w-[18rem] w-[25rem]'>Seguro de vida deudor que cubre la obligación en caso de incapacidad total o permanente.</p>
            </div>
          </div>
          <div className='flex flex-row items-center relative max-2xl:mb-10 lg:ml-[5rem]'>
            <NextImage
              className='absolute max-2xl:w-[6.9rem] w-[8.9rem]'
              src='/images/circle-bank-icon.png'
              alt='logo'
              width={143}
              height={143}
            />
            <div className='bg-primary-color rounded-[30rem] max-2xl:px-14 px-20 py-5 ml-20'>
              <p className='text-white max-2xl:text-xs text-lg max-xl:w-[10rem] max-2xl:w-[14rem] w-[18rem]'>Las condiciones del tiempo y tasa del crédito fijas de principio a fin.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BenefitsBanner
