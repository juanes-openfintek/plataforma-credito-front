'use client'
import { useFormik } from 'formik'
import UserInfoBlock from '../../../components/molecules/UserInfoBlock/UserInfoBlock'
import ThreeColumnInputs from '../../../components/molecules/ThreeColumnInputs/ThreeColumnInputs'
import SquareButton from '../../../components/atoms/SquareButton/SquareButton'
import { validatePersonaData } from '../../../helpers/validationsForms'
import BreadcrumbLabel from '../../../components/atoms/BreadcrumbLabel/BreadcrumbLabel'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import putUpdateUserData from '../../../services/putUpdateUserData'
import useDecryptedSession from '../../../hooks/useDecryptedSession'

const UpdateDataPage = () => {
  /**
   * update is the function to update the session in NextAuth
   */
  const { update } = useSession()
  /**
   * userData is the data of the user
   */
  const userData: any = useDecryptedSession()
  /**
   * loading is the state of the loading
   */
  const [loading, setLoading] = useState(false)
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
    },
    validate: validatePersonaData,
    onSubmit: async (values) => {
      setLoading(true)
      await putUpdateUserData(
        {
          name: values.firstNamePersonalInfo,
          lastname: values.lastNamePersonalInfo,
          secondLastname: values.secondLastNamePersonalInfo,
          secondName: values.middleNamePersonalInfo,
          phoneNumber: values.phonePersonalInfo,
          dateOfBirth: values.birthDatePersonalInfo,
          documentType: values.typeDocument,
          documentNumber: values.documentNumber,
        }
      )
        .then((res) => {
          setLoading(false)
          update({
            name: values.firstNamePersonalInfo,
            lastname: values.lastNamePersonalInfo,
            secondLastname: values.secondLastNamePersonalInfo,
            secondName: values.middleNamePersonalInfo,
            phoneNumber: values.phonePersonalInfo,
            email: values.emailPersonalInfo,
            dateOfBirth: values.birthDatePersonalInfo,
            documentType: values.typeDocument,
            documentNumber: values.documentNumber,
          })
        })
        .catch(() => setLoading(false))
    },
  })
  useEffect(() => {
    if (userData) {
      formik.setFieldValue('firstNamePersonalInfo', userData?.name)
      formik.setFieldValue('middleNamePersonalInfo', userData?.secondName)
      formik.setFieldValue('lastNamePersonalInfo', userData?.lastname)
      formik.setFieldValue(
        'secondLastNamePersonalInfo',
        userData?.secondLastname
      )
      formik.setFieldValue('phonePersonalInfo', userData?.phoneNumber)
      formik.setFieldValue('emailPersonalInfo', userData?.email)
      formik.setFieldValue(
        'birthDatePersonalInfo',
        userData?.birthdate?.split('T')[0]
      )
      formik.setFieldValue('typeDocument', userData?.documentType)
      formik.setFieldValue('documentNumber', userData?.documentNumber)
    }
    setTimeout(() => {
      formik.setErrors({})
    }, 200)
  }, [userData])

  /**
   * Array of objects to manage the user inputs
   */
  /**
   * An array of objects representing personal information fields.
   * @typedef {Object} PersonalInfoField
   * @property {string} value - The current value of the field.
   * @property {string} errors - The error message associated with the field, if any.
   * @property {string} type - The type of input field (text, date, select, etc.).
   * @property {string} label - The label for the input field.
   * @property {string} name - The name of the input field.
   * @property {string[]} [options] - An array of options for select fields.
   */

  /**
   * An array of objects representing personal information fields.
   * @type {PersonalInfoField[]}
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
      label: 'Segundo apellido',
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
      label: 'Correo electrónico registrado*',
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
  return (
    <main>
      <section className='p-[1rem] xl:ml-[300px] xl:mr-[50px] max-lg:pt-14 text-primary-color'>
        <BreadcrumbLabel
          link='/usuario/perfil'
          text='Datos personales'
          leftArrow
        />
        <UserInfoBlock
          name={userData?.name}
          lastname={userData?.lastname}
          documentNumber={userData?.documentNumber}
        />
        <ThreeColumnInputs
          fields={personalInfo}
          headerAlternative
          border
          noLowerLine
          onHandleChange={formik.handleChange}
        />
        <div className='w-[30%] max-md:w-[75%] h-[70px] mx-auto md:mt-10'>
          <SquareButton
            disable={loading}
            text={loading ? 'Guardando...' : 'Guardar cambios'}
            onClickHandler={() => {
              formik.handleSubmit()
            }}
          />
        </div>
      </section>
    </main>
  )
}

export default UpdateDataPage
