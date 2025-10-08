'use client'
import { useFormik } from 'formik'
import SquareButton from '../../atoms/SquareButton/SquareButton'
import ThreeColumnInputs from '../../molecules/ThreeColumnInputs/ThreeColumnInputs'
import Modal from '../../molecules/Modal/Modal'
import { useEffect, useState } from 'react'
import { Taxes } from '../../../interfaces/taxes.interface'
import postTaxes from '../../../services/postTaxes'
import { validateTaxForm } from '../../../helpers/validationsForms'
import putTaxes from '../../../services/putTaxes'
import deleteTaxes from '../../../services/deleteTaxes'

interface AdminDetailTaxProps {
  tax: Taxes | null
  taxesList: Taxes[]
  setShowForm: (showForm: boolean) => void
}

const AdminDetailTax = ({
  tax,
  taxesList,
  setShowForm,
}: AdminDetailTaxProps) => {
  /**
   * Component for displaying and editing tax details in the admin panel.
   * @returns JSX.Element
   */
  const [showModal, setShowModal] = useState<boolean>(false)
  /**
   * A string that contains the error message.
   */
  const [errorMessage, setErrorMessage] = useState<string>('')
  /**
   * A boolean that shows or hides the form.
   */
  const [loading, setLoading] = useState<boolean>(false)
  /**
   * Formik instance to manage the forms
   */
  const formik = useFormik({
    initialValues: {
      minAmount: 0,
      maxAmount: 0,
      eaPercentage: 0,
      emPercentage: 0,
      ivaPercentage: 0,
      interestPercentage: 0,
      insurancePercentage: 0,
      administrationPercentage: 0,
    },
    validate: validateTaxForm,
    onSubmit: async (values) => {
      if (
        taxesList.some(
          (tax) =>
            Number(tax.minAmount) <= Number(values.minAmount) &&
            Number(values.minAmount) <= Number(tax.maxAmount)
        )
      ) {
        setErrorMessage(
          'Ya existe un rango que cubre el valor mínimo ingresado'
        )
        return
      }
      if (
        taxesList.some(
          (tax) =>
            Number(tax.minAmount) <= Number(values.maxAmount) &&
            Number(values.maxAmount) <= Number(tax.maxAmount)
        )
      ) {
        setErrorMessage(
          'Ya existe un rango que cubre el valor máximo ingresado'
        )
        return
      }
      setLoading(true)
      setErrorMessage('')
      if (tax) {
        putTaxes(values, tax.id)
          .then((res) => {
            if (res?.error) {
              setLoading(false)
              setErrorMessage(res.message[0])
              return
            }
            setShowForm(false)
            setLoading(false)
          })
          .catch((error) => {
            setLoading(false)
            setErrorMessage(error.message[0])
          })
      } else {
        postTaxes(values)
          .then((res) => {
            if (res?.error) {
              setLoading(false)
              setErrorMessage(res.message[0])
              return
            }
            setShowForm(false)
            setLoading(false)
          })
          .catch((error) => {
            setLoading(false)
            setErrorMessage(error.message[0])
          })
      }
    },
  })
  /**
   * An array of objects containing personal information for tax details.
   * @typedef {Object} PersonalInfo
   * @property {string} value - The value of the personal information.
   * @property {string} errors - The errors associated with the personal information.
   * @property {string} type - The type of the personal information.
   * @property {string} label - The label of the personal information.
   * @property {string} name - The name of the personal information.
   */

  /**
   * An array of objects containing personal information for tax details.
   * @type {PersonalInfo[]}
   */
  const personalInfo = [
    {
      value: formik.values.minAmount.toString(),
      errors: formik.errors.minAmount,
      type: 'number',
      label: 'Rango mínimo*',
      name: 'minAmount',
    },
    {
      value: formik.values.maxAmount.toString(),
      errors: formik.errors.maxAmount,
      type: 'number',
      label: 'Rango máximo*',
      name: 'maxAmount',
    },
    {
      value: formik.values.emPercentage.toString(),
      errors: formik.errors.emPercentage,
      type: 'number',
      label: 'Tasa E.M*',
      name: 'emPercentage',
    },
    {
      value: formik.values.eaPercentage.toString(),
      errors: formik.errors.eaPercentage,
      type: 'number',
      label: 'Tasa E.A*',
      name: 'eaPercentage',
    },
    {
      value: formik.values.interestPercentage.toString(),
      errors: formik.errors.interestPercentage,
      type: 'number',
      label: 'Tasa de mora*',
      name: 'interestPercentage',
    },
    {
      value: formik.values.insurancePercentage.toString(),
      errors: formik.errors.insurancePercentage,
      type: 'number',
      label: 'Seguro*',
      name: 'insurancePercentage',
    },
    {
      value: formik.values.administrationPercentage.toString(),
      errors: formik.errors.administrationPercentage,
      type: 'number',
      label: 'Administración*',
      name: 'administrationPercentage',
    },
    {
      value: formik.values.ivaPercentage.toString(),
      errors: formik.errors.ivaPercentage,
      type: 'number',
      label: 'IVA*',
      name: 'ivaPercentage',
    },
  ]
  /**
   * useEffect to set the values of the formik form when the tax changes.
   */
  useEffect(() => {
    if (tax) {
      taxesList.splice(taxesList.indexOf(tax), 1)
      formik.setValues({
        minAmount: tax.minAmount ? tax.minAmount : 0,
        maxAmount: tax.maxAmount ? tax.maxAmount : 0,
        emPercentage: tax.emPercentage ? tax.emPercentage : 0,
        eaPercentage: tax.eaPercentage ? tax.eaPercentage : 0,
        interestPercentage: tax.interestPercentage ? tax.interestPercentage : 0,
        insurancePercentage: tax.insurancePercentage
          ? tax.insurancePercentage
          : 0,
        administrationPercentage: tax.administrationPercentage
          ? tax.administrationPercentage
          : 0,
        ivaPercentage: tax.ivaPercentage ? tax.ivaPercentage : 0,
      })
    } else {
      formik.resetForm()
    }
  }, [tax])
  /**
   * Function to handle the deletion of a tax.
   * @param idTax - The id of the tax to be deleted.
   */
  const handleDelete = async (idTax: string) => {
    setLoading(true)
    await deleteTaxes(idTax)
    setLoading(false)
    setShowForm(false)
  }

  return (
    <section>
      <div className='flex flex-row justify-between my-12'>
        <h3 className='font-semibold text-[1.5625rem]'>Editar tasa</h3>
        {tax && (
          <div className='w-[200px]'>
            <SquareButton
              text='Eliminar tasa'
              error
              onClickHandler={() => setShowModal(true)}
            />
          </div>
        )}
      </div>
      {errorMessage && (
        <p className='text-center text-white bg-red-300 py-4 mb-6 rounded'>
          {errorMessage}
        </p>
      )}
      <form
        onSubmit={formik.handleSubmit}
        className='bg-light-color-one px-6 lg:px-14 w-full rounded-2xl'
      >
        <ThreeColumnInputs
          fields={personalInfo}
          title='Información de tasa'
          noLowerLine
          onHandleChange={formik.handleChange}
        />
      </form>
      <div className='flex flex-row md:w-[30%] m-auto mt-8 gap-8'>
        <SquareButton
          text='Cancelar'
          gray
          disable={loading}
          onClickHandler={() => setShowForm(false)}
        />
        <SquareButton
          text={tax ? 'Guardar cambios' : 'Crear'}
          disable={loading}
          onClickHandler={() => formik.handleSubmit()}
        />
      </div>
      <Modal
        showModal={showModal}
        title='Eliminar tasa'
        description={`<p>Estás a punto de eliminar la tasa de <strong>${formik.values.minAmount} - ${formik.values.maxAmount}</strong> ¿Estás segur@ de realizar esta acción?</p>`}
        negativeButtonText='Volver'
        positiveButtonText='Eliminar tasa'
        disable={loading}
        handleClickNegative={() => setShowModal(false)}
        handleClickPositive={() => handleDelete(tax?.id.toString() || '')}
        fillRedButton
      />
    </section>
  )
}

export default AdminDetailTax
