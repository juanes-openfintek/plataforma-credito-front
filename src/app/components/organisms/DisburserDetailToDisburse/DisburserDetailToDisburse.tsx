import { useState } from 'react'
import { CreditData } from '../../../interfaces/creditData.interface'
import SquareButton from '../../atoms/SquareButton/SquareButton'
import AdminBankUserBlock from '../../molecules/AdminBankUserBlock/AdminBankUserBlock'
import AdminDataCreditBlock from '../../molecules/AdminDataCreditBlock/AdminDataCreditBlock'
import AdminDetailCreditUserBlock from '../../molecules/AdminDetailCreditUserBlock/AdminDetailCreditUserBlock'
import AdminUserMinimalCreditBlock from '../../molecules/AdminUserMinimalCreditBlock/AdminUserMinimalCreditBlock'
import AdminValidateUserAccount from '../../molecules/AdminValidateUserAccount/AdminValidateUserAccount'
import TaxInfoBlock from '../../molecules/TaxInfoBlock/TaxInfoBlock'
import putUpdateCredit from '../../../services/putUpdateCredit'
import { CreditStatusesProperties } from '../../../constants/CreditStatusesProperties'

interface DisburserDetailToDisburseProps {
  creditData: CreditData
  setShowForm: (position: boolean) => void
}

const DisburserDetailToDisburse = ({
  creditData,
  setShowForm,
}: DisburserDetailToDisburseProps) => {
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
      setShowForm(false)
    }
  }
  return (
    <section className='py-[1rem] xl:ml-[300px] xl:mr-[50px] max-lg:px-4 text-primary-color'>
      <p
        className='text-[1.25rem] font-bold my-8 cursor-pointer'
        onClick={() => setShowForm(false)}
      >
        {'< Volver'}
      </p>
      <p className='text-[1.25rem] font-semibold mb-4'>{`Crédito #${creditData.code}`}</p>
      <AdminDetailCreditUserBlock creditUserData={creditData} />
      <AdminDataCreditBlock creditUserData={creditData} />
      <TaxInfoBlock creditUserData={creditData} />
      <AdminUserMinimalCreditBlock creditUserData={creditData} />
      <AdminBankUserBlock creditUserData={creditData} />
      <AdminValidateUserAccount documentUrl={creditData?.account?.urlCertificate} />
      <div className='flex flex-row mx-auto mt-12 font-bold w-[470px] h-[70px] gap-8'>
        <SquareButton text='No validar' transparent disable={disable} onClickHandler={() => setShowForm(false)} />
        <SquareButton text='Validar identidad' onClickHandler={() => changeStatusCredit(CreditStatusesProperties[4].status)} disable={disable} />
      </div>
    </section>
  )
}

export default DisburserDetailToDisburse
