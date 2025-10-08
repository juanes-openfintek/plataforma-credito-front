import { useState } from 'react'
import { CreditData } from '../../../interfaces/creditData.interface'
import SquareButton from '../../atoms/SquareButton/SquareButton'
import AdminBankUserBlock from '../../molecules/AdminBankUserBlock/AdminBankUserBlock'
import AdminDataExpandedCreditBlock from '../../molecules/AdminDataExpandedCreditBlock/AdminDataExpandedCreditBlock'
import AdminDetailCreditUserBlock from '../../molecules/AdminDetailCreditUserBlock/AdminDetailCreditUserBlock'
import AdminUserMinimalCreditBlock from '../../molecules/AdminUserMinimalCreditBlock/AdminUserMinimalCreditBlock'
import Modal from '../../molecules/Modal/Modal'
import putUpdateCredit from '../../../services/putUpdateCredit'
import { CreditStatusesProperties } from '../../../constants/CreditStatusesProperties'
import postGenerateTickets from '../../../services/postGenerateTickets'

interface DisburseDetailConfirmProps {
  creditData: CreditData
  setShowForm: (position: boolean) => void
}

const DisburseDetailConfirm = ({
  creditData,
  setShowForm,
}: DisburseDetailConfirmProps) => {
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
   * A string that contains the error message.
   */
  const [errorMessage, setErrorMessage] = useState<string>('')
  /**
   * @description Change status credit
   * @param status - Status to change
   */
  const changeStatusCredit = async (status: string) => {
    setDisable(true)
    postGenerateTickets(creditData._id)
      .then(async () => {
        const response: any = await putUpdateCredit(creditData._id, status)
        if (response.status === 200) {
          setShowModal(false)
          setShowForm(false)
          setDisable(false)
          return
        }
        setDisable(false)
        setErrorMessage(
          'No se pudo realizar el desembolso, intentelo nuevamente'
        )
      })
      .catch(() => {
        setDisable(false)
        setErrorMessage(
          'No se pudo realizar el desembolso, intentelo nuevamente'
        )
      })
  }
  return (
    <>
      <section className='py-[1rem] xl:ml-[300px] xl:mr-[50px] max-lg:px-4 text-primary-color'>
        <p
          className='text-[1.25rem] font-bold my-8 cursor-pointer'
          onClick={() => setShowForm(false)}
        >
          {'< Volver'}
        </p>
        <p className='text-[1.25rem] font-semibold mb-4'>{`Crédito #${creditData.code}`}</p>
        {errorMessage && (
          <p className='text-center text-white bg-red-300 py-4 mb-6 rounded'>
            {errorMessage}
          </p>
        )}
        <AdminDetailCreditUserBlock creditUserData={creditData} withReference />
        <AdminDataExpandedCreditBlock
          dataCredit={creditData}
          title='Información del crédito'
        />
        <AdminUserMinimalCreditBlock creditUserData={creditData} />
        <AdminBankUserBlock creditUserData={creditData} />
        <div className='flex flex-row mx-auto mt-12 font-bold w-[470px] h-[50px] gap-8'>
          <SquareButton
            text='Atras'
            onClickHandler={() => setShowForm(false)}
          />
          <SquareButton
            text='Desembolsado'
            transparent
            onClickHandler={() => setShowModal(true)}
          />
        </div>
      </section>
      <Modal
        showModal={showModal}
        title='¿Está seguro que ya realizó el desembolso?'
        description='<p>Si ya realizó el pago, entonces confirme, sino, vuelva atrás y realícelo</p>'
        positiveButtonText='Atrás'
        negativeButtonText='Desembolso realizado'
        disable={disable}
        handleClickPositive={() => setShowModal(false)}
        handleClickNegative={() =>
          changeStatusCredit(CreditStatusesProperties[8].status)}
        downBorderButton
      />
    </>
  )
}

export default DisburseDetailConfirm
