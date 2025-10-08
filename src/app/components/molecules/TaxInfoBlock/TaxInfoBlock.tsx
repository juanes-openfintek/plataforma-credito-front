import { useFormik } from 'formik'
import ThreeColumnInputs from '../ThreeColumnInputs/ThreeColumnInputs'
import { CreditData } from '../../../interfaces/creditData.interface'

interface AdminDataCreditBlockProps {
  creditUserData: CreditData
}

const TaxInfoBlock = ({
  creditUserData,
}: AdminDataCreditBlockProps) => {
  /**
   * Formik instance to manage the forms
   */
  const formik = useFormik({
    initialValues: {
      emTax: creditUserData.taxes?.rateEffectiveMonthly.toString() + '%' || '0%',
      eaTax: creditUserData.taxes?.rateEffectiveAnnual.toString() + '%' || '0%',
      moraTax: creditUserData.taxes?.rateDefault.toString() + '%' || '0%',
    },
    onSubmit: (values) => {},
  })
  /**
   * Array of objects to manage the bank information inputs
   */
  const TaxInfo = [
    {
      value: formik.values.emTax,
      errors: formik.errors.emTax,
      type: 'text',
      readonly: true,
      label: 'Tasa EM actual',
      name: 'emTax',
    },
    {
      value: formik.values.eaTax,
      errors: formik.errors.eaTax,
      type: 'text',
      readonly: true,
      label: 'Tasa EA actual',
      name: 'eaTax',
    },
    {
      value: formik.values.moraTax,
      errors: formik.errors.moraTax,
      type: 'text',
      readonly: true,
      label: 'Tasa mora actual',
      name: 'moraTax',
    },
  ]
  return (
    <>
      <h2 className='text-[1.5625rem] font-semibold my-4 mt-12'>Tasa</h2>
      <div className='bg-light-color-one px-16 rounded-2xl'>
        <ThreeColumnInputs
          fields={TaxInfo}
          noLowerLine
          onHandleChange={formik.handleChange}
        />
      </div>
    </>
  )
}

export default TaxInfoBlock
