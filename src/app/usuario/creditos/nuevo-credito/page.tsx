'use client'
import { Field, FormikProvider, useFormik } from 'formik'
import RangeCalculator from '../../../components/molecules/RangeCalculator/RangeCalculator'
import {
  validateCalculator,
  validateCreditForms,
} from '../../../helpers/validationsForms'
import DetailCalculations from '../../../components/molecules/DetailCalculations/DetailCalculations'
import SquareButton from '../../../components/atoms/SquareButton/SquareButton'
import ThreeColumnInputs from '../../../components/molecules/ThreeColumnInputs/ThreeColumnInputs'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import postCredit from '../../../services/postCredit'
import { useCreditState } from '../../../context/creditContext'
import fetchTaxesPercentages from '../../../services/getTaxes'
import { Taxes } from '../../../interfaces/taxes.interface'
import BreadcrumbLabel from '../../../components/atoms/BreadcrumbLabel/BreadcrumbLabel'
import { CreditStatusesProperties } from '../../../constants/CreditStatusesProperties'
import useDecryptedSession from '../../../hooks/useDecryptedSession'
import { UserDataToken } from '../../../interfaces/userDataToken.interface'

/**
 * NewCredits is a component that renders the new credits page
 * @returns The NewCredits component
 */
export default function NewCredits() {
  /**
   * CreditContext instance
   */
  const { updateTaxesData, updateAmount, updateTime, amount, time, creditTaxes } = useCreditState()
  /**
   * loading is the loading state of the request
   */
  const [loading, setLoading] = useState(false)
  /**
   * Error message of the request
   */
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  /**
   * router is the router of the page
   */
  const router = useRouter()
  /**
   * userData is the user data
   */
  const userData: UserDataToken = useDecryptedSession()
  /**
   * Formik instance to manage the forms for calculator
   */
  const formikCalculator = useFormik({
    initialValues: {
      priceRange: '',
      daysRange: '',
    },
    validate: validateCalculator,
    onSubmit: () => {},
  })
  /**
   * Formik instance to manage the forms
   */
  const formikUserData = useFormik({
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
    validate: (values) => validateCreditForms(values, true),
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
      if (amount === 0) {
        setErrorMessage('Ingrese un monto válido a solicitar')
        window.document
          .getElementById('error-message')
          ?.scrollIntoView({ behavior: 'smooth' })
        setLoading(false)
        return
      }
      if (time === 0) {
        setErrorMessage('Ingrese un periodo de tiempo valido a solicitar para pago')
        window.document
          .getElementById('error-message')
          ?.scrollIntoView({ behavior: 'smooth' })
        setLoading(false)
        return
      }
      values.amount = amount
      values.quotasNumber = Math.ceil(time / 30)
      values.firstNamePersonalInfo = userData?.name
      values.middleNamePersonalInfo = userData?.secondName
      values.lastNamePersonalInfo = userData?.lastname
      values.secondLastNamePersonalInfo = userData?.secondLastname
      values.phonePersonalInfo = userData?.phoneNumber
      values.emailPersonalInfo = userData?.email
      values.birthDatePersonalInfo = userData?.birthdate
      values.typeDocument = userData?.documentType
      values.documentNumber = userData?.documentNumber
      const result = await postCredit(values)
      if (result === CreditStatusesProperties[0].status) {
        router.push('/usuario/creditos')
        return
      }
      if (result.message === 'account/account-not-found') {
        setErrorMessage('Primero debes vincular una cuenta bancaria a tu cuenta de usuario, puedes hacer esto en la sección de perfil.')
        setLoading(false)
        return
      }
      setErrorMessage('Ha ocurrido un error, intentalo de nuevo')
      setLoading(false)
    },
  })

  /**
   * useEffect to fetch the taxes data
   */
  useEffect(() => {
    const fetchTaxes = async () => {
      const taxes: Taxes[] = await fetchTaxesPercentages()
      updateTaxesData(taxes)
    }
    fetchTaxes()
  }, [])
  /**
   * useEffect to update the amount value
   */
  useEffect(() => {
    updateAmount(Number(formikCalculator.values.priceRange))
  }, [formikCalculator.values.priceRange])
  /**
   * useEffect to update the time value
   */
  useEffect(() => {
    updateTime(Number(formikCalculator.values.daysRange))
  }, [formikCalculator.values.daysRange])

  /**
   * Array of objects to manage the personal information inputs
   */
  const personalInfo = [
    {
      value: userData?.name,
      errors: formikUserData.errors.firstNamePersonalInfo,
      type: 'text',
      label: 'Primer nombre*',
      readonly: true,
      name: 'firstNamePersonalInfo',
    },
    {
      value: userData?.secondName,
      errors: formikUserData.errors.middleNamePersonalInfo,
      type: 'text',
      label: 'Segundo nombre',
      readonly: true,
      name: 'middleNamePersonalInfo',
    },
    {
      value: userData?.lastname,
      errors: formikUserData.errors.lastNamePersonalInfo,
      type: 'text',
      label: 'Primer apellido*',
      readonly: true,
      name: 'lastNamePersonalInfo',
    },
    {
      value: userData?.secondLastname,
      errors: formikUserData.errors.secondLastNamePersonalInfo,
      type: 'text',
      label: 'Segundo apellido*',
      readonly: true,
      name: 'secondLastNamePersonalInfo',
    },
    {
      value: userData?.phoneNumber,
      errors: formikUserData.errors.phonePersonalInfo,
      type: 'text',
      label: 'Número de celular*',
      readonly: true,
      name: 'phonePersonalInfo',
    },
    {
      value: userData?.email,
      errors: formikUserData.errors.emailPersonalInfo,
      type: 'text',
      label: 'Correo electrónico*',
      readonly: true,
      name: 'emailPersonalInfo',
    },
    {
      value: userData?.birthdate?.split('T')[0],
      errors: formikUserData.errors.birthDatePersonalInfo,
      type: 'date',
      placeholder: '10 / 10 / 1993',
      label: 'Fecha de nacimiento*',
      readonly: true,
      name: 'birthDatePersonalInfo',
    },
    {
      value: userData?.documentType,
      errors: formikUserData.errors.typeDocument,
      type: 'select',
      options: [
        { text: '-- Seleccione una opción --', value: '' },
        { text: 'CC', value: 'CC' },
        { text: 'CE', value: 'CE' },
      ],
      readonly: true,
      label: 'Tipo de documento de identidad*',
      name: 'typeDocument',
    },
    {
      value: userData?.documentNumber,
      errors: formikUserData.errors.documentNumber,
      type: 'text',
      label: 'Documento de identidad*',
      readonly: true,
      name: 'documentNumber',
    },
  ]
  /**
   * Array of objects to manage the work information inputs
   */
  const workInfo = [
    {
      value: formikUserData.values.ecoActivityWorkInfo,
      errors: formikUserData.errors.ecoActivityWorkInfo,
      type: 'text',
      label: 'Actividad económica*',
      name: 'ecoActivityWorkInfo',
    },
    {
      value: formikUserData.values.nameCompanyWorkInfo,
      errors: formikUserData.errors.nameCompanyWorkInfo,
      type: 'text',
      label: 'Nombre de la empresa*',
      name: 'nameCompanyWorkInfo',
    },
    {
      value: formikUserData.values.telCompanyWorkInfo,
      errors: formikUserData.errors.telCompanyWorkInfo,
      type: 'text',
      label: 'Teléfono de la empresa*',
      name: 'telCompanyWorkInfo',
    },
    {
      value: formikUserData.values.addressCompanyWorkInfo,
      errors: formikUserData.errors.addressCompanyWorkInfo,
      type: 'text',
      label: 'Dirección de la empresa*',
      name: 'addressCompanyWorkInfo',
    },
    {
      value: formikUserData.values.jobTitleWorkInfo,
      errors: formikUserData.errors.jobTitleWorkInfo,
      type: 'text',
      label: 'Cargo*',
      name: 'jobTitleWorkInfo',
    },
    {
      value: formikUserData.values.contractKindWorkInfo,
      errors: formikUserData.errors.contractKindWorkInfo,
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
      value: formikUserData.values.initialWorkDateWorkInfo,
      errors: formikUserData.errors.initialWorkDateWorkInfo,
      type: 'date',
      placeholder: '10 / 10 / 1993',
      label: 'Fecha de vinculación laboral*',
      name: 'initialWorkDateWorkInfo',
    },
  ]
  /**
   * Array of objects to manage the financial information inputs
   */
  const financialInfo = [
    {
      value: formikUserData.values.monthIngressFinancialInfo,
      errors: formikUserData.errors.monthIngressFinancialInfo,
      type: 'text',
      label: 'Ingresos mensuales*',
      name: 'monthIngressFinancialInfo',
    },
    {
      value: formikUserData.values.monthEgressFinancialInfo,
      errors: formikUserData.errors.monthEgressFinancialInfo,
      type: 'text',
      label: 'Egresos mensuales*',
      name: 'monthEgressFinancialInfo',
    },
    {
      value: formikUserData.values.creditExperienceFinancialInfo,
      errors: formikUserData.errors.creditExperienceFinancialInfo,
      type: 'text',
      label: 'Experiencia crediticia*',
      name: 'creditExperienceFinancialInfo',
    },
    {
      value: formikUserData.values.disbursementFinancialInfo,
      errors: formikUserData.errors.disbursementFinancialInfo,
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
  /**
   * Array of objects to manage the references inputs
   */
  const referencesInfo = [
    {
      value: formikUserData.values.completeNameReference,
      errors: formikUserData.errors.completeNameReference,
      type: 'text',
      label: 'Nombres y apellidos*',
      name: 'completeNameReference',
    },
    {
      value: formikUserData.values.relationshipReference,
      errors: formikUserData.errors.relationshipReference,
      type: 'text',
      label: 'Parentesco*',
      name: 'relationshipReference',
    },
    {
      value: formikUserData.values.departmentReference,
      errors: formikUserData.errors.departmentReference,
      type: 'text',
      label: 'Departamento de residencia*',
      name: 'departmentReference',
    },
    {
      value: formikUserData.values.municipalityReference,
      errors: formikUserData.errors.municipalityReference,
      type: 'text',
      label: 'Municipio de residencia*',
      name: 'municipalityReference',
    },
    {
      value: formikUserData.values.phoneReference,
      errors: formikUserData.errors.phoneReference,
      type: 'text',
      label: 'Número de teléfono*',
      name: 'phoneReference',
    },
  ]
  return (
    <main>
      <section className='p-[1rem] xl:ml-[300px] xl:mr-[50px] max-lg:pt-14'>
        <BreadcrumbLabel text='Nuevo crédito' />
        <div className='mb-4' />
        {errorMessage && (
          <p id='error-message' className='text-center text-white bg-red-300 py-2 mb-6 rounded'>
            {errorMessage}
          </p>
        )}
        <RangeCalculator formik={formikCalculator} row />

        <div className='my-10 w-[40rem] max-lg:w-[70%] mx-auto'>
          <DetailCalculations />
        </div>
        <FormikProvider value={formikUserData}>
          <form
            onSubmit={formikUserData.handleSubmit}
            className='bg-light-color-one px-6 lg:px-10 py-4 w-full rounded-2xl'
          >
            <ThreeColumnInputs
              fields={personalInfo}
              title='Información personal'
              idTitle='personalInfo'
              onHandleChange={formikUserData.handleChange}
            />
            <ThreeColumnInputs
              fields={workInfo}
              title='Información laboral'
              idTitle='workInfo'
              onHandleChange={formikUserData.handleChange}
            />
            <ThreeColumnInputs
              fields={financialInfo}
              title='Información financiera'
              idTitle='financialInfo'
              onHandleChange={formikUserData.handleChange}
            />
            <ThreeColumnInputs
              fields={referencesInfo}
              title='Referencias'
              idTitle='referencesInfo'
              onHandleChange={formikUserData.handleChange}
            />
            <div className='grid justify-center mt-[100px] text-black w-[30rem] max-lg:w-[90%] mx-auto'>
              <div className='flex items-center mb-4 w-[30rem] max-lg:w-[90%]'>
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
              {formikUserData.errors.personalDataCheck ? (
                <div className='text-error-color mb-6'>
                  {formikUserData.errors.personalDataCheck}
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
              {formikUserData.errors.termsDataCheck ? (
                <div className='text-error-color mb-6'>
                  {formikUserData.errors.termsDataCheck}
                </div>
              ) : null}
              <div className='flex items-center mb-8'>
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
              {formikUserData.errors.acceptanceValueCheck ? (
                <div className='text-error-color mb-6'>
                  {formikUserData.errors.acceptanceValueCheck}
                </div>
              ) : null}
              <DetailCalculations />
            </div>

            <div className='mx-auto mt-6 mb-12 w-[200px] h-[70px] font-semibold'>
              <SquareButton
                text='Solicita tu crédito'
                disable={loading}
                onClickHandler={() => {
                  formikUserData.handleSubmit()
                }}
              />
            </div>
            {errorMessage && (
              <p className='text-center text-white bg-red-300 py-2 mb-6 rounded'>
                {errorMessage}
              </p>
            )}
          </form>
        </FormikProvider>
      </section>
    </main>
  )
}
