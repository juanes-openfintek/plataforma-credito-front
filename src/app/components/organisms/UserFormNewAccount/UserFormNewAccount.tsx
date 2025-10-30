import { useFormik } from 'formik'
import BreadcrumbLabel from '../../atoms/BreadcrumbLabel/BreadcrumbLabel'
import { useEffect, useState } from 'react'
import postNewFile from '../../../services/postNewFile'
import { BankAccounts } from '../../../interfaces/bankAccounts.interface'
import postAddAccount from '../../../services/postAddAccount'
import decryptCryptoData from '../../../helpers/decryptCryptoData'
import ThreeColumnInputs from '../../molecules/ThreeColumnInputs/ThreeColumnInputs'
import LoadDocument from '../../atoms/LoadDocument/LoadDocument'
import SquareButton from '../../atoms/SquareButton/SquareButton'
import putUpdateAccount from '../../../services/putUpdateAccount'
import getBanks from '../../../services/getBanks'
import { BankData } from '../../../interfaces/bankData.interface'
import formatTypeAccount from '../../../helpers/formatTypeAccount'

interface UserFormNewAccountProps {
  accountData: BankAccounts | undefined
  setShowForms: (value: boolean) => void
}

const UserFormNewAccount = ({
  accountData,
  setShowForms,
}: UserFormNewAccountProps) => {
  /**
   * State to manage the file to upload
   */
  const [loading, setLoading] = useState<boolean>(false)
  /**
   * Banks state
   */
  const [banks, setBanks] = useState<{ text: string, value: string}[]>([{ text: '-- Seleccione una opción --', value: '' }])
  /**
   * Banks type state
   */
  const [banksType, setBanksType] = useState<{ text: string, value: string}[]>([{ text: '-- Seleccione una opción --', value: '' }, { text: 'Ahorros', value: 'savings_account' }, { text: 'Corriente', value: 'checking_account' }, { text: 'Depósito electrónico', value: 'electronic_deposit' }])
  /**
   * Banks state
   */
  const [banksAllData, setBanksAllData] = useState<BankData[]>([])
  /**
   * State to manage the file to upload
   */
  const [file, setFile] = useState<any>()
  /**
   * A string that contains the error message.
   */
  const [errorMessage, setErrorMessage] = useState<string>('')
  /**
   * @description This function is used to send the file to the backend
   * @returns The response of the backend
   */
  const uploadFile = async () => {
    const bodyFormData = new FormData()
    bodyFormData.append('file', file)
    return postNewFile(bodyFormData)
  }
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
      setBanksAllData(banks.banks)
      parsedData.unshift({ text: '-- Seleccione una opción --', value: '' })
      setBanks(parsedData)
      loadData(banks.banks)
    }
    fetchBanks()
  }, [])
  /**
   * Formik instance to manage the forms
   */
  const formik = useFormik({
    initialValues: {
      typeAccount: accountData?.accountType || '',
      numberAccount: decryptCryptoData(accountData?.accountNumber ?? '') || '',
      nameBankAccount: accountData?.accountEntity || '',
    },
    onSubmit: async (values) => {
      setLoading(true)
      if (accountData) {
        const bank = banksAllData.find((bank) => bank.name === values.nameBankAccount)
        if (file) {
          await uploadFile().then((res: string) => {
            putUpdateAccount({
              id: accountData._id,
              accountEntity: values.nameBankAccount,
              accountNumber: values.numberAccount,
              accountType: values.typeAccount,
              detailAccount: bank!,
              urlCertificate: res
            }).then(() => {
              setShowForms(false)
            }).catch(() => {
              setLoading(false)
            })
          })
          return
        }
        putUpdateAccount({
          id: accountData._id,
          accountEntity: values.nameBankAccount,
          accountNumber: values.numberAccount,
          detailAccount: bank!,
          accountType: values.typeAccount,
        }).then(() => {
          setShowForms(false)
        }).catch(() => {
          setLoading(false)
        })
      } else {
        if (file?.name) {
          uploadFile().then((res: string) => {
            const bank = banksAllData.find((bank) => bank.name === values.nameBankAccount)
            postAddAccount({
              ...values,
              urlCertificate: res,
              detailAccount: bank!,
            }).then((res) => {
              if (res.statusCode) {
                setLoading(false)
                setErrorMessage('Ha ocurrido un error, vuelva a intentarlo')
                return
              }
              setShowForms(false)
            }).catch(() => {
              setLoading(false)
            })
          })
        } else {
          setErrorMessage('Debe cargar un archivo')
          setLoading(false)
        }
      }
    },
  })
  /**
   * useEffect to set the banks type
   */
  useEffect(() => {
    loadTypes(formik.values.nameBankAccount, banksAllData, '')
  }, [formik.values.nameBankAccount])
  /**
   * This function loads again the banks type
   * @param banksAllData Banks data
   */
  const loadData = (banksAllData: BankData[]) => {
    loadTypes(accountData?.accountEntity ?? '', banksAllData, accountData?.accountType ?? '')
  }
  /**
   * This function loads the banks type
   * @param entity is the entity of the bank
   * @param banksAllData Banks data
   * @param fieldValue is the value of the field
   */
  const loadTypes = (entity: string, banksAllData: BankData[], fieldValue: string) => {
    const bank = banksAllData.find((bank) => bank.name === entity)
    const types = bank?.supported_account_types.map((type) => {
      return {
        text: formatTypeAccount(type),
        value: type,
      }
    }) ?? []
    types.unshift({ text: '-- Seleccione una opción --', value: '' })
    setBanksType(types ?? [])
    formik.setFieldValue('typeAccount', fieldValue)
  }
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
    <section className='p-[1rem] xl:ml-[300px] xl:mr-[50px] max-lg:pt-14 text-primary-color'>
      <BreadcrumbLabel
        link='/usuario/perfil/cuentas-bancarias'
        text={accountData ? 'Editar cuenta' : 'Crear nueva cuenta'}
        leftArrow
        onClickHandler={() => setShowForms(false)}
      />
      {errorMessage && (
        <p className='text-center text-white bg-red-300 py-4 mb-6 rounded'>
          {errorMessage}
        </p>
      )}
      {!accountData && (
        <h2 className='text-[2.1875rem] font-bold'>
          Hola, estás a unos pocos pasos de tener tu cuenta en Marca Blanca Creditos
        </h2>
      )}
      {accountData && (
        <h2 className='text-[2.1875rem] font-bold'>
          Hola, edita tu cuenta de Marca Blanca Creditos en pocos pasos
        </h2>
      )}
      <h3 className='text-[1.875rem]'>
        Continua llenando los siguientes campos, recuerda que cada uno es
        obligatorio*
      </h3>
      <ThreeColumnInputs
        fields={bankInfo}
        border
        noLowerLine
        onHandleChange={formik.handleChange}
      />
      <h2 className='text-[2.1875rem] font-bold w-[70%]'>
        Para continuar, carga una foto en donde se evidencie el certificado del
        número de tu cuenta bancaria
      </h2>
      <h3 className='text-[1.875rem] mb-8'>
        Debe ser una foto o pantallazo en archivo .PDF .JPG .PNG, no mayor a 5MB
      </h3>
      <LoadDocument setFile={setFile} file={file} existingFile={accountData?.urlCertificate} />
      <div className='border-b-[1px] border-black mt-10' />
      <div className='w-[30%] max-md:w-[75%] h-[70px] mx-auto mt-10'>
        <SquareButton
          disable={loading}
          text={loading ? 'Guardando...' : 'Guardar cambios'}
          onClickHandler={() => {
            formik.handleSubmit()
          }}
        />
      </div>
    </section>
  )
}

export default UserFormNewAccount
