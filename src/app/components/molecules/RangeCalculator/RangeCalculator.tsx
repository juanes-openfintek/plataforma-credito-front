import { convertNumberToCurrency } from '../../../helpers/calculationsHelpers'
import { useState } from 'react'

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
  const [inputValue, setInputValue] = useState('')

  /**
   * Maneja el cambio en el input de texto del monto
   */
  const handleAmountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remover todo excepto números
    const value = e.target.value.replace(/\D/g, '')
    setInputValue(value)

    if (value) {
      const numericValue = parseInt(value)
      const minCredit = Number(process.env.NEXT_PUBLIC_MIN_CREDIT)
      const maxCredit = Number(process.env.NEXT_PUBLIC_MAX_CREDIT)

      // Limitar el valor entre min y max
      if (numericValue >= minCredit && numericValue <= maxCredit) {
        formik.setFieldValue('priceRange', numericValue)
      }
    }
  }

  /**
   * Maneja cuando el input pierde el foco
   */
  const handleAmountBlur = () => {
    if (inputValue) {
      const numericValue = parseInt(inputValue)
      const minCredit = Number(process.env.NEXT_PUBLIC_MIN_CREDIT)
      const maxCredit = Number(process.env.NEXT_PUBLIC_MAX_CREDIT)

      // Ajustar al mínimo o máximo si está fuera del rango
      if (numericValue < minCredit) {
        formik.setFieldValue('priceRange', minCredit)
        setInputValue(minCredit.toString())
      } else if (numericValue > maxCredit) {
        formik.setFieldValue('priceRange', maxCredit)
        setInputValue(maxCredit.toString())
      } else {
        // Redondear al múltiplo de 50,000 más cercano
        const rounded = Math.round(numericValue / 50000) * 50000
        formik.setFieldValue('priceRange', rounded)
        setInputValue(rounded.toString())
      }
    }
    setInputValue('')
  }

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
        <div className='relative'>
          <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 font-medium'>$</span>
          <input
            className='bg-white w-full rounded-md text-black py-2 pl-8 pr-2 my-1 focus:outline-none focus:ring-2 focus:ring-primary-color transition-all'
            id='price-range-text'
            name='priceRangeInput'
            type='text'
            placeholder={`Desde ${convertNumberToCurrency(Number(process.env.NEXT_PUBLIC_MIN_CREDIT))} hasta ${convertNumberToCurrency(Number(process.env.NEXT_PUBLIC_MAX_CREDIT))}`}
            onChange={handleAmountInputChange}
            onBlur={handleAmountBlur}
            value={inputValue || (formik.values.priceRange ? convertNumberToCurrency(formik.values.priceRange) : '')}
          />
        </div>
        <input
          id='price-range-slider'
          type='range'
          name='priceRange'
          min={process.env.NEXT_PUBLIC_MIN_CREDIT}
          max={process.env.NEXT_PUBLIC_MAX_CREDIT}
          step={50000}
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
          max={72}
          placeholder='De 1 a 72 meses'
          onChange={formik.handleChange}
          value={`${formik.values.daysRange}${formik.values.daysRange ? ' meses' : ''}`}
        />
        <input
          id='days-range-slider'
          type='range'
          name='daysRange'
          min={1}
          max={72}
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
