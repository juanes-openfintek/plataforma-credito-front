'use client'
import { useState } from 'react'
import formatDateAdmin from '../../../helpers/formatDateAdmin'
import { BankAccounts } from '../../../interfaces/bankAccounts.interface'
import SquareButton from '../../atoms/SquareButton/SquareButton'
import Modal from '../Modal/Modal'
import { Field } from 'formik'
import { censorCharacters } from '../../../helpers/censorCharacters'
import decryptCryptoData from '../../../helpers/decryptCryptoData'

interface AccountSelectionBlockProps {
  accountData: BankAccounts
  name: string
  value: string
  onClickEditHandler: () => void
  removeAccount: (id: string) => void
}
/**
 * This is the component for the account selection block
 * @param {string} accountNumber - The account number
 * @param {string} title - The title of the account
 * @param {string} dateCreated - The date the account was created
 * @returns AccountSelectionBlock
 */
const AccountSelectionBlock = ({
  accountData,
  name,
  value,
  onClickEditHandler,
  removeAccount,
}: AccountSelectionBlockProps) => {
  /**
   * This state is used to show the modal
   */
  const [showModal, setShowModal] = useState<boolean>(false)
  return (
    <>
      {accountData.isActive && (
        <div className='flex flex-row max-md:flex-col items-center mb-4 w-full border-b-2 border-primary-color py-4 pr-4 justify-between text-black'>
          <div
            className='flex flex-row items-center'
          >
            <Field
              id='default-checkbox'
              type='radio'
              name={name}
              value={accountData._id}
              className='w-4 h-4 text-white bg-white border-black rounded'
            />
            <div className='flex flex-col ml-6 text-[1.25rem] font-bold text-black'>
              <p>{accountData.accountEntity}</p>
              <p>{censorCharacters(decryptCryptoData(accountData.accountNumber))}</p>
            </div>
          </div>
          <div className='flex flex-row items-center'>
            <p className='w-auto text-[1.25rem] max-md:text-[1rem]'>
              Fecha de creación:{' '}
              <span className='font-bold'>
                {formatDateAdmin(accountData.createdAt, 'onlyDate')}
              </span>
            </p>
            <span className='icon-trash-can text-[2rem] md:mx-10 mx-4 cursor-pointer' onClick={() => setShowModal(true)} />
            <div className='w-[120px]'>
              <SquareButton text='Editar' onClickHandler={onClickEditHandler} />
            </div>
          </div>
          <Modal
            showModal={showModal}
            title='Eliminar cuenta'
            description={`<p>Estás a punto de eliminar la cuenta terminada en <strong>${accountData?.lastNumbers} ¿Estás segur@ de realizar esta acción?</strong></p>`}
            negativeButtonText='Volver'
            positiveButtonText='Eliminar cuenta'
            handleClickNegative={() => setShowModal(false)}
            handleClickPositive={() => { setShowModal(false); removeAccount(accountData._id) }}
            fillRedButton
          />
        </div>
      )}
    </>
  )
}

export default AccountSelectionBlock
