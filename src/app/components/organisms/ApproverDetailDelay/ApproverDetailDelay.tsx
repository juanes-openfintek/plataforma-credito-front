import { CreditData } from '../../../interfaces/creditData.interface'
import AdminDataCreditBlock from '../../molecules/AdminDataCreditBlock/AdminDataCreditBlock'
import AdminDataExpandedCreditBlock from '../../molecules/AdminDataExpandedCreditBlock/AdminDataExpandedCreditBlock'
import AdminUserCreditBlock from '../../molecules/AdminUserCreditBlock/AdminUserCreditBlock'
import TaxInfoBlock from '../../molecules/TaxInfoBlock/TaxInfoBlock'
import ApproverCreditDelayBlock from '../ApproverCreditDelayBlock/ApproverCreditDelayBlock'

interface ApproverDetailDelayProps {
  creditData: CreditData
  setShowForm: (position: boolean) => void
}

const ApproverDetailDelay = ({
  creditData,
  setShowForm,
}: ApproverDetailDelayProps) => {
  return (
    <section className='py-[1rem] xl:ml-[300px] xl:mr-[50px] max-lg:px-4 text-primary-color'>
      <p
        className='text-[1.25rem] font-bold my-8 cursor-pointer'
        onClick={() => setShowForm(false)}
      >
        {'< Créditos en mora'}
      </p>
      <ApproverCreditDelayBlock creditUserData={creditData} />
      <AdminDataCreditBlock creditUserData={creditData} />
      <AdminDataExpandedCreditBlock dataCredit={creditData} title='Información del crédito' />
      <TaxInfoBlock creditUserData={creditData} />
      <AdminUserCreditBlock creditUserData={creditData} />
    </section>
  )
}

export default ApproverDetailDelay
