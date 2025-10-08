import { convertNumberToCurrency } from '../../../helpers/calculationsHelpers'

interface RangeCalculatorProps {
  formik: any
  row?: boolean
}
/**
 * RangeCalculator is a component that renders a range fields to calculate
 * @param {RangeCalculatorProps} props - The props of the component
 * @example <RangeCalculator formik={formik} />
 * @returns The RangeCalculator component
 */
const RangeCalculator = ({ formik, row }: RangeCalculatorProps) => {
  return (
    <form
      onSubmit={formik.handleSubmit}
      className={`${row ? 'flex flex-row max-lg:flex-col justify-between px-6 py-4 lg:px-12 lg:py-8' : ''} bg-light-color-one self-auto text-black rounded-2xl`}
    >
      <div className={`${row ? 'flex flex-col w-[40%] max-lg:w-full' : 'flex flex-col'}`}>
        <label
          htmlFor='price-range-text'
          className='font-bold max-2xl:text-xs text-[1.25rem]'
        >
          ¿Cuánto te prestamos?
        </label>
        <input
          className='bg-white w-full rounded-md text-black py-2 px-2 my-1'
          id='price-range-text'
          name='priceRange'
          type='text'
          readOnly
          placeholder={`Desde ${convertNumberToCurrency(Number(process.env.NEXT_PUBLIC_MIN_CREDIT))} hasta ${convertNumberToCurrency(Number(process.env.NEXT_PUBLIC_MAX_CREDIT))}`}
          onChange={formik.handleChange}
          value={formik.values.priceRange ? convertNumberToCurrency(formik.values.priceRange) : ''}
        />
        <input
          id='price-range-slider'
          type='range'
          name='priceRange'
          min={process.env.NEXT_PUBLIC_MIN_CREDIT}
          max={process.env.NEXT_PUBLIC_MAX_CREDIT}
          step={process.env.NEXT_PUBLIC_STEPS_CREDIT}
          onChange={formik.handleChange}
          value={formik.values.priceRange ? formik.values.priceRange : 0}
          className='w-full h-[2px] bg-light-color-two rounded-lg appearance-none cursor-pointer accent-primary-color my-4 2xl:mb-10'
        />

        {formik.errors.priceRange ? (
          <div className='text-error-color mb-6'>
            {formik.errors.priceRange}
          </div>
        ) : null}
      </div>

      <div className={`${row ? 'flex flex-col w-[40%] max-lg:w-full' : 'flex flex-col'}`}>
        <label
          htmlFor='days-range-text'
          className='font-bold max-2xl:text-xs text-[1.25rem]'
        >
          ¿En cuánto tiempo lo pagarás?
        </label>
        <input
          className='bg-white w-full rounded-md text-black py-2 px-2 my-1'
          id='days-range-text'
          name='daysRange'
          type='text'
          min='1'
          readOnly
          max={process.env.NEXT_PUBLIC_MAX_DAYS}
          placeholder={`De 1 a ${process.env.NEXT_PUBLIC_MAX_DAYS} días`}
          onChange={formik.handleChange}
          value={`${formik.values.daysRange}${formik.values.daysRange ? ' días' : ''}`}
        />
        <input
          id='days-range-slider'
          type='range'
          name='daysRange'
          min={1}
          max={Number(process.env.NEXT_PUBLIC_MAX_DAYS)}
          step={1}
          onChange={formik.handleChange}
          value={formik.values.daysRange ? formik.values.daysRange : 0}
          className='w-full h-[2px] bg-light-color-two rounded-lg appearance-none cursor-pointer accent-primary-color my-4 2xl:mb-10'
        />

        {formik.errors.daysRange ? (
          <div className='text-error-color mb-6'>{formik.errors.daysRange}</div>
        ) : null}
      </div>
    </form>
  )
}

export default RangeCalculator
