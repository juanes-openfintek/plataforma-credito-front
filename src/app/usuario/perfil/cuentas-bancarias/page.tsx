'use client'
import { useEffect, useState } from 'react'
import { BankAccounts } from '../../../interfaces/bankAccounts.interface'
import getAccounts from '../../../services/getAccounts'
import BreadcrumbLabel from '../../../components/atoms/BreadcrumbLabel/BreadcrumbLabel'
import UserFormNewAccount from '../../../components/organisms/UserFormNewAccount/UserFormNewAccount'
import BankAccountInfoBlock from '../../../components/molecules/BankAccountInfoBlock/BankAccountInfoBlock'
import AccountSelectionBlock from '../../../components/molecules/AccountSelectionBlock/AccountSelectionBlock'
import SquareButton from '../../../components/atoms/SquareButton/SquareButton'
import { FormikProvider, useFormik } from 'formik'
import postSetDefaultAccount from '../../../services/postSetDefaultAccount'
import postDisableAccount from '../../../services/postDisableAccount'

/**
 * This is the page for the bank accounts of the user
 * @returns BankAccountsPage
 */
const BankAccountsPage = () => {
  /**
   * This state is used to handle the loading state of the page
   */
  const [isLoading, setIsLoading] = useState<boolean>(false)
  /**
   * This state is used to handle the bank accounts
   */
  const [bankAccounts, setBankAccounts] = useState<BankAccounts[]>([])
  /**
   * This state is used to handle the default account
   */
  const [defaultAccount, setDefaultdAccount] = useState<
    BankAccounts | undefined
  >()
  /**
   * This state is used to handle the edition of an account
   */
  const [selectedAccount, setSelectedAccount] = useState<
    BankAccounts | undefined
  >()
  /**
   * This state is used to show the forms
   */
  const [showForms, setShowForms] = useState<boolean>(false)
  /**
   * This is the formik hook to handle the form
   */
  const formik = useFormik({
    initialValues: {
      selectedAccount: '',
    },
    onSubmit: async (values) => {
      setIsLoading(true)
      handleSelectAccount(values.selectedAccount).then(async () => {
        setIsLoading(false)
      })
    },
  })

  /**
   * This effect is used to fetch the accounts
   */
  useEffect(() => {
    const fetchAccounts = async () => {
      setBankAccounts(await getAccounts())
    }
    if (!showForms) {
      fetchAccounts()
    }
  }, [showForms])
  /**
   * This effect is used to set the default account
   */
  useEffect(() => {
    const accountSelected = bankAccounts.find((account) => {
      return account.default === true
    })
    setDefaultdAccount(accountSelected)
    formik.setFieldValue('selectedAccount', accountSelected?._id || '')
  }, [bankAccounts])

  /**
   * Function to update the selected account
   * @param account - Account number
   */
  const handleSelectAccount = async (idAccount: string) => {
    await postSetDefaultAccount(idAccount)
    setBankAccounts(await getAccounts())
  }
  /**
   * Function to handle the edition of an account
   * @param account - Account to edit
   */
  const handleShowForm = (account: any) => {
    if (account) {
      setSelectedAccount(account)
    } else {
      setSelectedAccount(undefined)
    }
    setShowForms(true)
  }
  /**
   * Function to remove an account
   * @param id - Account id
   */
  const removeAccount = async (idAccount: string) => {
    await postDisableAccount(idAccount)
    setBankAccounts(await getAccounts())
  }

  return (
    <main>
      {!showForms && (
        <section className='p-[1rem] xl:ml-[300px] xl:mr-[50px] max-lg:pt-14 text-primary-color font-poppins'>
          <BreadcrumbLabel
            link='/usuario/perfil'
            text='Cuenta bancaria'
            leftArrow
          />
          {defaultAccount && (
            <BankAccountInfoBlock
              title={defaultAccount?.accountEntity ?? ''}
              accountNumber={defaultAccount?.accountNumber ?? ''}
            />
          )}
          <div className='mt-8'>
            <FormikProvider value={formik}>
              {bankAccounts.map((bankAccount, index) => (
                <AccountSelectionBlock
                  key={index}
                  accountData={bankAccount}
                  name='selectedAccount'
                  value={formik.values.selectedAccount}
                  onClickEditHandler={() => handleShowForm(bankAccount)}
                  removeAccount={removeAccount}
                />
              ))}
            </FormikProvider>
          </div>
          <div className='flex flex-row w-[50%] max-md:w-[90%] gap-10 m-auto mt-14'>
            <SquareButton
              text='Agregar cuenta'
              transparent
              onClickHandler={() => handleShowForm(undefined)}
            />
            <SquareButton
              text={isLoading ? 'Guardando cambios...' : 'Guardar cambios'}
              onClickHandler={() => formik.handleSubmit()}
              disable={isLoading}
            />
          </div>
        </section>
      )}
      {showForms && (
        <UserFormNewAccount
          accountData={selectedAccount}
          setShowForms={setShowForms}
        />
      )}
    </main>
  )
}

export default BankAccountsPage
