import { useState } from 'react'
import { CreditData } from '../../../interfaces/creditData.interface'
import AdminDataCreditBlock from '../../molecules/AdminDataCreditBlock/AdminDataCreditBlock'
import AdminDataExpandedCreditBlock from '../../molecules/AdminDataExpandedCreditBlock/AdminDataExpandedCreditBlock'
import AdminUserCreditBlock from '../../molecules/AdminUserCreditBlock/AdminUserCreditBlock'
import HeaderDetailApprover from '../../molecules/HeaderDetailApprover/HeaderDetailApprover'
import Modal from '../../molecules/Modal/Modal'
import TaxInfoBlock from '../../molecules/TaxInfoBlock/TaxInfoBlock'
import putUpdateCredit from '../../../services/putUpdateCredit'
import { CreditStatusesProperties } from '../../../constants/CreditStatusesProperties'
import encryptData from '../../../helpers/encryptData'
import axios from 'axios'
import useDecryptedSession from '../../../hooks/useDecryptedSession'

interface ApproverDetailWaitProps {
  creditData: CreditData
  setShowForm: (value: boolean) => void
}

const ApproverDetailWait = ({
  creditData,
  setShowForm,
}: ApproverDetailWaitProps) => {
  /**
   * Defines a state variable to control the visibility of a modal.
   * @typeParam boolean - The type of the state variable.
   * @defaultValue false - The initial value of the state variable.
   */
  const [showModalApprove, setShowModalApprove] = useState(false)
  const [showModalReject, setShowModalReject] = useState(false)
  const [disable, setDisable] = useState(false)
  /**
   * userData is the data of the user
   */
  const userData: any = useDecryptedSession()
  /**
   * changeStatusCredit is a function that changes the status of the credit
   * @param status is the status of the credit
   */
  const changeStatusCredit = async (status: string) => {
    setDisable(true)
    if (!creditData?.user?.email) {
      const commissionUser: string = userData.commission;
      const identificacionNumberUser: string = userData.identificationNumber;
      if (status === CreditStatusesProperties[1].status) {
        const response: any = await axios.post('/api/approver/approve', {
          token: encryptData({
            id: creditData?._id,
            status,
            name: creditData?.name,
            emailToSend: creditData?.email,
            commission: commissionUser,
            identificationNumber: identificacionNumberUser,
            token: userData?.token,
          }),
        })
        setDisable(false)
        if (response.status >= 200 && response.status < 300) {
          setShowModalApprove(false)
          setShowModalReject(false)
          setShowForm(false)
        }
        return
      }
      if (status === CreditStatusesProperties[2].status) {
        const response: any = await axios.post('/api/approver/denied', {
          token: encryptData({
            id: creditData?._id,
            status,
            name: creditData?.name,
            emailToSend: creditData?.email,
            commission: commissionUser,
            identificationNumber: identificacionNumberUser,
            token: userData?.token,
          }),
        })
        setDisable(false)
        if (response.status >= 200 && response.status < 300) {
          setShowModalApprove(false)
          setShowModalReject(false)
          setShowForm(false)
        }
        return
      }
    }
    const response: any = await putUpdateCredit(creditData._id, status)
    setDisable(false)
    if (response.status === 200) {
      setShowModalApprove(false)
      setShowModalReject(false)
      setShowForm(false)
    }
  }
  return (
    <section className='py-[1rem]'>
      <HeaderDetailApprover
        creditData={creditData}
        onHandleClick={() => setShowForm(false)}
        onHandleApproveClick={() => setShowModalApprove(true)}
        onHandleRejectClick={() => setShowModalReject(true)}
      />
      <section className='xl:ml-[300px] xl:mr-[50px] max-lg:px-4 text-primary-color'>
        <AdminDataCreditBlock creditUserData={creditData} />
        <TaxInfoBlock creditUserData={creditData} />
        <AdminUserCreditBlock creditUserData={creditData} />
        <AdminDataExpandedCreditBlock
          dataCredit={creditData}
          title='Información del crédito'
        />
      </section>
      <Modal
        showModal={showModalApprove}
        title='Aprobación de crédito'
        description='<p>Estás a punto de aprobar este crédito. <strong>¿Estás segur@ de realizar esta acción?</strong></p>'
        negativeButtonText='Volver'
        positiveButtonText='Aprobar crédito'
        disable={disable}
        handleClickNegative={() => setShowModalApprove(false)}
        handleClickPositive={() =>
          changeStatusCredit(CreditStatusesProperties[1].status)}
        invertedButtons
      />
      <Modal
        showModal={showModalReject}
        title='Rechazo de crédito'
        description='<p>Estás a punto de rechazar este crédito. <strong>¿Estás segur@ de realizar esta acción?</strong></p>'
        negativeButtonText='Volver'
        positiveButtonText='Rechazar crédito'
        disable={disable}
        handleClickNegative={() => setShowModalReject(false)}
        handleClickPositive={() =>
          changeStatusCredit(CreditStatusesProperties[2].status)}
        fillRedButton
      />
    </section>
  )
}

export default ApproverDetailWait
