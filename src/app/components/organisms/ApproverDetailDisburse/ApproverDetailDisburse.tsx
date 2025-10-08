import { CreditData } from '../../../interfaces/creditData.interface'
import AdminUserShortCreditBlock from '../../molecules/AdminUserShortCreditBlock/AdminUserShortCreditBlock'

interface ApproverDetailDisburseProps {
  creditData: CreditData
  setShowForm: (position: boolean) => void
}

const ApproverDetailDisburse = ({
  creditData,
  setShowForm,
}: ApproverDetailDisburseProps) => {
  return (
    <section className='py-[1rem] xl:ml-[300px] xl:mr-[50px] max-lg:px-4 text-primary-color'>
      <p
        className='text-[1.25rem] font-bold my-8 cursor-pointer'
        onClick={() => setShowForm(false)}
      >
        {'< Créditos activos'}
      </p>
      <AdminUserShortCreditBlock creditUserData={creditData} />
    </section>
  )
}

export default ApproverDetailDisburse
