'use client'
import { Field, FormikProvider, useFormik } from 'formik'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ThreeColumnInputs from '../../molecules/ThreeColumnInputs/ThreeColumnInputs'
import SquareButton from '../../atoms/SquareButton/SquareButton'
import DetailCalculations from '../../molecules/DetailCalculations/DetailCalculations'
import { useCreditState } from '../../../context/creditContext'
import { validateCreditForms } from '../../../helpers/validationsForms'
import postCredit from '../../../services/postCredit'
import { CreditStatusesProperties } from '../../../constants/CreditStatusesProperties'
import CreditPreApprovalFlow from '../CreditPreApprovalFlow/CreditPreApprovalFlow'

/**
 * UserDataForms is a component that renders the user data forms
 * @example <UserDataForms />
 * @returns The UserDataForms component
 */
const UserDataForms = () => {
  /**
   * CreditContext instance
   */
  const { showForm, creditTaxes, amount, time } = useCreditState()
  /**
   * loading is the loading state of the request
   */
  const [loading, setLoading] = useState(false)
  /**
   * Error message of the request
   */
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  /**
   * State to control the credit pre-approval flow modal
   */
  const [showPreApprovalFlow, setShowPreApprovalFlow] = useState(false)
  /**
   * router is the router of the page
   */
  const router = useRouter()
  /**
   * Formik instance to manage the forms
   */
  const formik = useFormik({
    initialValues: {
      firstNamePersonalInfo: '',
      middleNamePersonalInfo: '',
      lastNamePersonalInfo: '',
      secondLastNamePersonalInfo: '',
      phonePersonalInfo: '',
      emailPersonalInfo: '',
      birthDatePersonalInfo: '',
      typeDocument: '',
      documentNumber: '',
      ecoActivityWorkInfo: '',
      nameCompanyWorkInfo: '',
      telCompanyWorkInfo: '',
      addressCompanyWorkInfo: '',
      jobTitleWorkInfo: '',
      contractKindWorkInfo: '',
      initialWorkDateWorkInfo: '',
      monthIngressFinancialInfo: '',
      monthEgressFinancialInfo: '',
      creditExperienceFinancialInfo: '',
      disbursementFinancialInfo: '',
      completeNameReference: '',
      relationshipReference: '',
      departmentReference: '',
      municipalityReference: '',
      phoneReference: '',
      taxes: '',
      amount: 0,
      quotasNumber: 0,
      personalDataCheck: false,
      termsDataCheck: false,
      acceptanceValueCheck: false,
    },
    validate: validateCreditForms,
    onSubmit: async (values) => {
      setLoading(true)
      if (creditTaxes) {
        const tax = creditTaxes?.find((taxes) => {
          return (
            amount >= taxes.minAmount && amount <= taxes.maxAmount
          )
        })
        values.taxes = tax?.id ?? creditTaxes[0]?.id
      }
      values.amount = amount
      values.quotasNumber = Math.ceil(time / 30)
      const result = await postCredit(values)
      if (result === CreditStatusesProperties[0].status) {
        router.push(`/registro?email=${values.emailPersonalInfo}`)
      } else {
        setErrorMessage('Ha ocurrido un error, intentalo de nuevo')
        setLoading(false)
      }
    },
  })
  /**
   * Array of objects to manage the personal information inputs
   */
  const personalInfo = [
    {
      value: formik.values.firstNamePersonalInfo,
      errors: formik.errors.firstNamePersonalInfo,
      type: 'text',
      label: 'Primer nombre*',
      name: 'firstNamePersonalInfo',
    },
    {
      value: formik.values.middleNamePersonalInfo,
      errors: formik.errors.middleNamePersonalInfo,
      type: 'text',
      label: 'Segundo nombre',
      name: 'middleNamePersonalInfo',
    },
    {
      value: formik.values.lastNamePersonalInfo,
      errors: formik.errors.lastNamePersonalInfo,
      type: 'text',
      label: 'Primer apellido*',
      name: 'lastNamePersonalInfo',
    },
    {
      value: formik.values.secondLastNamePersonalInfo,
      errors: formik.errors.secondLastNamePersonalInfo,
      type: 'text',
      label: 'Segundo apellido*',
      name: 'secondLastNamePersonalInfo',
    },
    {
      value: formik.values.phonePersonalInfo,
      errors: formik.errors.phonePersonalInfo,
      type: 'text',
      label: 'Número de celular*',
      name: 'phonePersonalInfo',
    },
    {
      value: formik.values.emailPersonalInfo,
      errors: formik.errors.emailPersonalInfo,
      type: 'text',
      label: 'Correo electrónico*',
      name: 'emailPersonalInfo',
    },
    {
      value: formik.values.birthDatePersonalInfo,
      errors: formik.errors.birthDatePersonalInfo,
      type: 'date',
      placeholder: '10 / 10 / 1993',
      label: 'Fecha de nacimiento*',
      name: 'birthDatePersonalInfo',
    },
    {
      value: formik.values.typeDocument,
      errors: formik.errors.typeDocument,
      type: 'select',
      options: [
        { text: '-- Seleccione una opción --', value: '' },
        { text: 'CC', value: 'CC' },
        { text: 'CE', value: 'CE' },
      ],
      label: 'Tipo de documento de identidad*',
      name: 'typeDocument',
    },
    {
      value: formik.values.documentNumber,
      errors: formik.errors.documentNumber,
      type: 'text',
      label: 'Documento de identidad*',
      name: 'documentNumber',
    },
  ]
  const workInfo = [
    {
      value: formik.values.ecoActivityWorkInfo,
      errors: formik.errors.ecoActivityWorkInfo,
      type: 'text',
      label: 'Actividad económica*',
      name: 'ecoActivityWorkInfo',
    },
    {
      value: formik.values.nameCompanyWorkInfo,
      errors: formik.errors.nameCompanyWorkInfo,
      type: 'text',
      label: 'Nombre de la empresa*',
      name: 'nameCompanyWorkInfo',
    },
    {
      value: formik.values.telCompanyWorkInfo,
      errors: formik.errors.telCompanyWorkInfo,
      type: 'text',
      label: 'Teléfono de la empresa*',
      name: 'telCompanyWorkInfo',
    },
    {
      value: formik.values.addressCompanyWorkInfo,
      errors: formik.errors.addressCompanyWorkInfo,
      type: 'text',
      label: 'Dirección de la empresa*',
      name: 'addressCompanyWorkInfo',
    },
    {
      value: formik.values.jobTitleWorkInfo,
      errors: formik.errors.jobTitleWorkInfo,
      type: 'text',
      label: 'Cargo*',
      name: 'jobTitleWorkInfo',
    },
    {
      value: formik.values.contractKindWorkInfo,
      errors: formik.errors.contractKindWorkInfo,
      type: 'select',
      options: [
        { text: '-- Seleccione una opción --', value: '' },
        { text: 'Contrato laboral', value: 'Contrato laboral' },
        { text: 'Contrato de prestación de servicios', value: 'Contrato de prestación de servicios' },
      ],
      label: 'Tipo de contrato*',
      name: 'contractKindWorkInfo',
    },
    {
      value: formik.values.initialWorkDateWorkInfo,
      errors: formik.errors.initialWorkDateWorkInfo,
      type: 'date',
      placeholder: '10 / 10 / 1993',
      label: 'Fecha de vinculación laboral*',
      name: 'initialWorkDateWorkInfo',
    },
  ]
  const financialInfo = [
    {
      value: formik.values.monthIngressFinancialInfo,
      errors: formik.errors.monthIngressFinancialInfo,
      type: 'text',
      label: 'Ingresos mensuales*',
      name: 'monthIngressFinancialInfo',
    },
    {
      value: formik.values.monthEgressFinancialInfo,
      errors: formik.errors.monthEgressFinancialInfo,
      type: 'text',
      label: 'Egresos mensuales*',
      name: 'monthEgressFinancialInfo',
    },
    {
      value: formik.values.creditExperienceFinancialInfo,
      errors: formik.errors.creditExperienceFinancialInfo,
      type: 'text',
      label: 'Experiencia crediticia*',
      name: 'creditExperienceFinancialInfo',
    },
    {
      value: formik.values.disbursementFinancialInfo,
      errors: formik.errors.disbursementFinancialInfo,
      type: 'select',
      options: [
        { text: '-- Seleccione una opción --', value: '' },
        { text: 'Transferencia', value: 'Transferencia' },
        { text: 'Efectivo', value: 'Efectivo' },
      ],
      label: 'Forma de desembolso*',
      name: 'disbursementFinancialInfo',
    },
  ]
  const referencesInfo = [
    {
      value: formik.values.completeNameReference,
      errors: formik.errors.completeNameReference,
      type: 'text',
      label: 'Nombres y apellidos*',
      name: 'completeNameReference',
    },
    {
      value: formik.values.relationshipReference,
      errors: formik.errors.relationshipReference,
      type: 'text',
      label: 'Parentesco*',
      name: 'relationshipReference',
    },
    {
      value: formik.values.departmentReference,
      errors: formik.errors.departmentReference,
      type: 'text',
      label: 'Departamento de residencia*',
      name: 'departmentReference',
    },
    {
      value: formik.values.municipalityReference,
      errors: formik.errors.municipalityReference,
      type: 'text',
      label: 'Municipio de residencia*',
      name: 'municipalityReference',
    },
    {
      value: formik.values.phoneReference,
      errors: formik.errors.phoneReference,
      type: 'text',
      label: 'Número de teléfono*',
      name: 'phoneReference',
    },
  ]
  return (
    <>
      {showForm && (
        <FormikProvider value={formik}>
          <section className='bg-white px-10 lg:px-28 '>
            <h2 className='text-2xl font-bold text-black bg-white'>
              Para continuar con la solicitud, llena el siguiente formulario
            </h2>
            <h3 className='bg-white text-black mb-10' id='firstTitle'>
              Recuerda que todos los campos son obligatorios*
            </h3>
            <form
              onSubmit={formik.handleSubmit}
              className='bg-light-color-one px-6 lg:px-20 py-4 w-full rounded-2xl'
            >
              <ThreeColumnInputs
                fields={personalInfo}
                title='Información personal'
                idTitle='personalInfo'
                onHandleChange={formik.handleChange}
              />
              <ThreeColumnInputs
                fields={workInfo}
                title='Información laboral'
                idTitle='workInfo'
                onHandleChange={formik.handleChange}
              />
              <ThreeColumnInputs
                fields={financialInfo}
                title='Información financiera'
                idTitle='financialInfo'
                onHandleChange={formik.handleChange}
              />
              <ThreeColumnInputs
                fields={referencesInfo}
                title='Referencias'
                idTitle='referencesInfo'
                onHandleChange={formik.handleChange}
              />
              <div className='grid justify-center mt-[100px] text-black'>
                <div className='flex items-center mb-4'>
                  <Field
                    id='personalDataChecka'
                    name='personalDataCheck'
                    type='checkbox'
                    className='w-4 h-4 text-white bg-white border-black rounded'
                  />
                  <label
                    htmlFor='personalDataCheck'
                    className='ml-2 text-sm font-medium'
                  >
                    He leído y autorizo el{' '}
                    <a className='text-primary-color underline' target='_blank' href='/politica-de-privacidad-tratamiento-de-datos'>
                      tratamiento de mis datos personales
                    </a>
                    .
                  </label>
                </div>
                {formik.errors.personalDataCheck ? (
                  <div className='text-error-color mb-6'>
                    {formik.errors.personalDataCheck}
                  </div>
                ) : null}
                <div className='flex items-center mb-4'>
                  <Field
                    id='termsDataCheck'
                    name='termsDataCheck'
                    type='checkbox'
                    className='w-4 h-4 text-white bg-white border-black rounded'
                  />
                  <label
                    htmlFor='default-checkbox'
                    className='ml-2 text-sm font-medium'
                  >
                    Acepto los{' '}
                    <a className='text-primary-color underline' target='_blank' href='/terminos-condiciones'>
                      términos y condiciones
                    </a>{' '}
                    de Marca Blanca Creditos.
                  </label>
                </div>
                {formik.errors.termsDataCheck ? (
                  <div className='text-error-color mb-6'>
                    {formik.errors.termsDataCheck}
                  </div>
                ) : null}
                <div className='flex items-center mb-4'>
                  <Field
                    id='default-checkbox'
                    type='checkbox'
                    name='acceptanceValueCheck'
                    className='w-4 h-4 text-white bg-white border-black rounded'
                  />
                  <label
                    htmlFor='default-checkbox'
                    className='ml-2 text-sm font-medium'
                  >
                    Acepto el valor total a solicitar.
                  </label>
                </div>
                {formik.errors.acceptanceValueCheck ? (
                  <div className='text-error-color mb-6'>
                    {formik.errors.acceptanceValueCheck}
                  </div>
                ) : null}
                <DetailCalculations />
              </div>

              <div className='mx-auto mt-6 mb-12 w-[250px]'>
                <SquareButton
                  text='Solicita tu crédito'
                  accent
                  disable={loading}
                  onClickHandler={() => {
                    // Open the pre-approval flow with calculator values
                    setShowPreApprovalFlow(true)
                  }}
                />
              </div>
              {errorMessage && (<p className='text-center text-white bg-red-300 py-2 mb-6 rounded'>{errorMessage}</p>)}
            </form>
          </section>
        </FormikProvider>
      )}

      {/* Credit Pre-Approval Flow Modal */}
      {showPreApprovalFlow && (
        <CreditPreApprovalFlow
          email={formik.values.emailPersonalInfo || ''}
          amount={amount}
          days={time}
          onComplete={async (creditData) => {
            // Handle the completed credit application
            setShowPreApprovalFlow(false)
            setLoading(true)

            // Prepare data for submission
            const finalData = {
              ...formik.values,
              amount,
              quotasNumber: Math.ceil(time / 30),
            }

            // Get the correct tax based on amount
            if (creditTaxes) {
              const tax = creditTaxes?.find((taxes) => {
                return amount >= taxes.minAmount && amount <= taxes.maxAmount
              })
              finalData.taxes = tax?.id ?? creditTaxes[0]?.id
            }

            // Submit the credit application
            const result = await postCredit(finalData)
            if (result === CreditStatusesProperties[0].status) {
              router.push(`/usuario/onboarding?email=${formik.values.emailPersonalInfo}`)
            } else {
              setErrorMessage('Ha ocurrido un error, intentalo de nuevo')
              setLoading(false)
            }
          }}
          onCancel={() => {
            setShowPreApprovalFlow(false)
          }}
        />
      )}
    </>
  )
}

export default UserDataForms
