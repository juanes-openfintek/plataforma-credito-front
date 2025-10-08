import { useFormik } from 'formik'
import { useCreditState } from '../../../context/creditContext'
import { useEffect } from 'react'
import RoundButton from '../../atoms/RoundButton/RoundButton'
import DetailCalculations from '../DetailCalculations/DetailCalculations'
import RangeCalculator from '../RangeCalculator/RangeCalculator'
import fetchTaxesPercentages from '../../../services/getTaxes'
import { validateCalculator } from '../../../helpers/validationsForms'
import { Taxes } from '../../../interfaces/taxes.interface'

/**
 * BasicCalculator is a component that renders a basic calculator with range and detail calculations
 * @example <BasicCalculator />
 * @returns The BasicCalculator component
 */
export const BasicCalculator = () => {
  /**
   * CreditContext instance
   */
  const { updateTaxesData, updateAmount, updateTime, updateShowForm } = useCreditState()
  /**
   * Formik instance to manage the forms
   */
  const formik = useFormik({
    initialValues: {
      priceRange: '',
      daysRange: '',
    },
    validate: validateCalculator,
    onSubmit: (values) => {
      updateShowForm(true)
      window.document.getElementById('firstTitle')?.scrollIntoView({ behavior: 'smooth' })
    },
  })
  /**
   * useEffect to fetch the taxes data
   */
  useEffect(() => {
    const fetchTaxes = async () => {
      const taxes: Taxes[] = await fetchTaxesPercentages();
      updateTaxesData(taxes);
    };
    fetchTaxes();
  }, []);
  /**
   * useEffect to update the amount value
   */
  useEffect(() => {
    updateAmount(Number(formik.values.priceRange))
  }, [formik.values.priceRange])
  /**
   * useEffect to update the time value
   */
  useEffect(() => {
    updateTime(Number(formik.values.daysRange))
  }, [formik.values.daysRange])

  return (
    <div className='bg-light-color-one self-auto px-6 py-4 lg:px-12 lg:py-8 text-black max-w-2xl rounded-2xl'>
      <RangeCalculator formik={formik} />
      <DetailCalculations />

      <div className='flex mt-6 mx-auto w-[200px] max-lg:w-[250px]'>
        <RoundButton
          text='Solicita tu crédito'
          lightStyle
          onClickHandler={() => {
            formik.handleSubmit()
          }}
        />
      </div>
    </div>
  )
}

export default BasicCalculator
