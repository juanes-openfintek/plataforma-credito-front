import { useFormik } from 'formik'
import ThreeColumnInputs from '../ThreeColumnInputs/ThreeColumnInputs'
import SquareButton from '../../atoms/SquareButton/SquareButton'
import React, { useEffect, useState } from 'react'
import { validateUserDataRegisterForm } from '../../../helpers/validationsForms'
import { useRegisterState } from '../../../context/registerContext'
import getBanks from '../../../services/getBanks'
import { BankData } from '../../../interfaces/bankData.interface'
import formatTypeAccount from '../../../helpers/formatTypeAccount'

interface PersonalDataRegisterProps {
  setPersonalVisibility: React.Dispatch<React.SetStateAction<boolean>>
}
/**
 * PersonalDataRegister is a component that renders the personal data register
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setPersonalVisibility - The setPersonalVisibility function
 * @param {React.Dispatch<React.SetStateAction<any>>} setPersonalData - The setPersonalData function
 * @example <PersonalDataRegister setPersonalVisibility={setPersonalVisibility} setPersonalData={setPersonalData} />
 * @returns The PersonalDataRegister component
 */
const PersonalDataRegister = ({
  setPersonalVisibility,
}: PersonalDataRegisterProps) => {
  const { registerData, bankAllData, saveUserData, saveBanks } =
    useRegisterState()
  /**
   * Banks state
   */
  const [banks, setBanks] = useState<{ text: string; value: string }[]>([
    { text: '-- Seleccione una opción --', value: '' },
  ])
  /**
   * Banks type state
   */
  const [banksType, setBanksType] = useState<{ text: string; value: string }[]>(
    [{ text: '-- Seleccione una opción --', value: '' }]
  )
  /**
   * useEffect to fetch the banks
   */
  useEffect(() => {
    const fetchBanks = async () => {
      const banks = await getBanks()
      const parsedData = banks.banks.map((bank: BankData) => {
        return {
          text: bank.name,
          value: bank.name,
        }
      })
      saveBanks(banks.banks)
      parsedData.unshift({ text: '-- Seleccione una opción --', value: '' })
      setBanks(parsedData)
    }
    fetchBanks()
  }, [])

  /**
   * Formik instance to manage the forms
   */
  const formik = useFormik({
    initialValues: {
      namePersonalInfo: registerData.name ?? '',
      lastNamePersonalInfo: registerData.lastName ?? '',
      phonePersonalInfo: registerData.phoneNumber ?? '',
      birthDatePersonalInfo: registerData.dateOfBirth ?? '',
      typeDocument: registerData.documentType ?? '',
      documentNumber: registerData.documentNumber ?? '',
      typeAccount: registerData.accountType ?? '',
      numberAccount: registerData.accountNumber ?? '',
      nameBankAccount: registerData.accountEntity ?? '',
    },
    validate: validateUserDataRegisterForm,
    onSubmit: (values) => {
      setPersonalVisibility(false)
      saveUserData(
        registerData.email,
        registerData.password,
        values.namePersonalInfo,
        values.lastNamePersonalInfo,
        values.phonePersonalInfo,
        values.birthDatePersonalInfo,
        values.typeDocument,
        values.documentNumber,
        values.typeAccount,
        values.numberAccount,
        values.nameBankAccount
      )
    },
  })
  /**
   * useEffect to set the banks type
   */
  useEffect(() => {
    const bank = bankAllData.find(
      (bank) => bank.name === formik.values.nameBankAccount
    )
    const types =
      bank?.supported_account_types.map((type) => {
        return {
          text: formatTypeAccount(type),
          value: type,
        }
      }) ?? []
    types.unshift({ text: '-- Seleccione una opción --', value: '' })
    setBanksType(types ?? [])
    // avoid reset the type account if the user has already selected one
    if (types.find((type) => type.value === formik.values.typeAccount)) {
      return
    }
    formik.setFieldValue('typeAccount', '')
  }, [formik.values.nameBankAccount])
  /**
   * Array of objects to manage the personal information inputs
   */
  const personalInfo = [
    {
      value: formik.values.namePersonalInfo,
      errors: formik.errors.namePersonalInfo,
      type: 'text',
      label: 'Nombres*',
      name: 'namePersonalInfo',
    },
    {
      value: formik.values.lastNamePersonalInfo,
      errors: formik.errors.lastNamePersonalInfo,
      type: 'text',
      label: 'Apellidos*',
      name: 'lastNamePersonalInfo',
    },
    {
      value: formik.values.phonePersonalInfo,
      errors: formik.errors.phonePersonalInfo,
      type: 'tel',
      label: 'Número de celular',
      name: 'phonePersonalInfo',
    },
    {
      value: formik.values.birthDatePersonalInfo,
      errors: formik.errors.birthDatePersonalInfo,
      type: 'date',
      placeholder: '10 / 10 / 1993',
      label: 'Fecha de nacimiento',
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
      label: 'Tipo de documento de identidad',
      name: 'typeDocument',
    },
    {
      value: formik.values.documentNumber,
      errors: formik.errors.documentNumber,
      type: 'text',
      label: 'Documento de identidad',
      name: 'documentNumber',
    },
  ]
  /**
   * Array of objects to manage the bank information inputs
   */
  const bankInfo = [
    {
      value: formik.values.nameBankAccount,
      errors: formik.errors.nameBankAccount,
      type: 'select',
      options: banks,
      label: 'Banco',
      name: 'nameBankAccount',
    },
    {
      value: formik.values.numberAccount,
      errors: formik.errors.numberAccount,
      type: 'text',
      label: 'Número de cuenta',
      name: 'numberAccount',
    },
    {
      value: formik.values.typeAccount,
      errors: formik.errors.typeAccount,
      type: 'select',
      options: banksType,
      label: 'Tipo de cuenta',
      name: 'typeAccount',
    },
  ]
  return (
    <section className='flex flex-col max-lg:px-10 h-screen text-primary-color p-16 justify-between'>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <h2 className='text-[2.1875rem] max-md:leading-[2rem] leading-[1.5625rem] font-bold mb-6'>
            Hola, estás a unos pocos pasos de tener tu cuenta en Marca Blanca Creditos
          </h2>
          <h3 className='text-[1.875rem] max-md:leading-[2rem] leading-[1.5625rem]'>
            Continua llenando los siguientes campos, recuerda que cada uno es
            obligatorio*
          </h3>
        </div>

        <div>
          <ThreeColumnInputs
            fields={personalInfo}
            title='Información personal'
            noLowerLine
            headerAlternative
            border
            onHandleChange={formik.handleChange}
          />
          <ThreeColumnInputs
            fields={bankInfo}
            title='Información bancaria'
            noLowerLine
            headerAlternative
            border
            onHandleChange={formik.handleChange}
          />
        </div>
        <div className='flex mx-auto mt-6 mb-12 max-md:w-[90%] w-[500px]'>
          <SquareButton
            text='Siguiente'
            onClickHandler={() => {
              formik.handleSubmit()
            }}
          />
        </div>
      </form>
    </section>
  )
}

export default PersonalDataRegister
