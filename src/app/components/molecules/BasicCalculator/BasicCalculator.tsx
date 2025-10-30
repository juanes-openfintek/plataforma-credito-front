import { useFormik } from 'formik'
import { useCreditState } from '../../../context/creditContext'
import { useEffect, useState } from 'react'
import RoundButton from '../../atoms/RoundButton/RoundButton'
import DetailCalculations from '../DetailCalculations/DetailCalculations'
import RangeCalculator from '../RangeCalculator/RangeCalculator'
import fetchTaxesPercentages from '../../../services/getTaxes'
import { validateCalculator } from '../../../helpers/validationsForms'
import { Taxes } from '../../../interfaces/taxes.interface'
import CreditPreApprovalFlow from '../../organisms/CreditPreApprovalFlow/CreditPreApprovalFlow'

/**
 * BasicCalculator is a component that renders a basic calculator with range and detail calculations
 * @example <BasicCalculator />
 * @returns The BasicCalculator component
 */
export const BasicCalculator = () => {
  /**
   * CreditContext instance
   */
  const { updateTaxesData, updateAmount, updateTime, creditTaxes, amount, time } = useCreditState()
  /**
   * State to control the credit pre-approval flow modal
   */
  const [showPreApprovalFlow, setShowPreApprovalFlow] = useState(false)
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
      // Open the pre-approval flow modal instead of showing the old form
      setShowPreApprovalFlow(true)
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
    <>
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

      {/* Credit Pre-Approval Flow Modal */}
      {showPreApprovalFlow && (
        <CreditPreApprovalFlow
          amount={amount}
          days={time}
          onComplete={(creditData) => {
            // Close the modal after completion
            setShowPreApprovalFlow(false)
          }}
          onCancel={() => {
            setShowPreApprovalFlow(false)
          }}
        />
      )}
    </>
  )
}

export default BasicCalculator
