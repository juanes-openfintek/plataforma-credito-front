import { useState } from 'react'
import { CreditData } from '../../../interfaces/creditData.interface'
import SquareButton from '../../atoms/SquareButton/SquareButton'
import AdminBankUserBlock from '../../molecules/AdminBankUserBlock/AdminBankUserBlock'
import AdminDataCreditBlock from '../../molecules/AdminDataCreditBlock/AdminDataCreditBlock'
import AdminDetailCreditUserBlock from '../../molecules/AdminDetailCreditUserBlock/AdminDetailCreditUserBlock'
import AdminUserMinimalCreditBlock from '../../molecules/AdminUserMinimalCreditBlock/AdminUserMinimalCreditBlock'
import Modal from '../../molecules/Modal/Modal'
import putUpdateCredit from '../../../services/putUpdateCredit'
import { CreditStatusesProperties } from '../../../constants/CreditStatusesProperties'

interface DisburseDetailValidatedProps {
  creditData: CreditData
  setShowForm: (position: boolean) => void
}

const DisburseDetailValidated = ({
  creditData,
  setShowForm,
}: DisburseDetailValidatedProps) => {
  /**
   * Defines a state variable to control the visibility of a modal.
   * @typeParam boolean - The type of the state variable.
   * @defaultValue false - The initial value of the state variable.
   */
  const [showModal, setShowModal] = useState(false)
  /**
   * @description State to disable button
   */
  const [disable, setDisable] = useState(false)
  /**
   * @description Change status credit
   * @param status - Status to change
   */
  const changeStatusCredit = async (status: string) => {
    setDisable(true)
    const response: any = await putUpdateCredit(creditData._id, status)
    setDisable(false)
    if (response.status === 200) {
      setShowModal(true)
    }
  }
  return (
    <>
      <section className='py-[1rem] xl:ml-[300px] xl:mr-[50px] max-lg:px-4 text-primary-color'>
        <div className='flex flex-row justify-between my-8'>
          <p
            className='text-[1.25rem] font-bold cursor-pointer'
            onClick={() => setShowForm(false)}
          >
            {'< Volver'}
          </p>
          <p className='text-[1.5625rem] font-bold text-success-color'>
            Crédito Validado
          </p>
        </div>
        <p className='text-[1.25rem] font-semibold mb-4'>{`Crédito #${creditData.code}`}</p>
        <AdminDetailCreditUserBlock creditUserData={creditData} />
        <AdminDataCreditBlock creditUserData={creditData} />
        <AdminUserMinimalCreditBlock creditUserData={creditData} />
        <AdminBankUserBlock creditUserData={creditData} />
        <div className='mx-auto mt-12 font-bold w-[235px] h-[70px]'>
          <SquareButton
            text='Generar crédito'
            onClickHandler={() => changeStatusCredit(CreditStatusesProperties[5].status)}
            disable={disable}
          />
        </div>
      </section>
      <Modal
        showModal={showModal}
        title='Se ha generado el # de crédito'
        description={`<p style="text-align: center">${'#' + creditData.code}</p>`}
        negativeButtonText='Atrás'
        positiveButtonText='Siguiente'
        invertedButtons
        handleClickPositive={() => {
          setShowModal(false)
          setShowForm(false)
        }}
        handleClickNegative={() => {
          setShowModal(false)
          setShowForm(false)
        }}
      />
    </>
  )
}

export default DisburseDetailValidated
