import { convertNumberToCurrency } from '../../../helpers/calculationsHelpers'
import { CreditData } from '../../../interfaces/creditData.interface'

/**
 * Props for the ApproverCreditDelayBlock component
 * @interface
 */
interface ApproverCreditDelayBlockProps {
  creditData?: CreditData
  handleShowForm: (id: number) => void
}

const ApproverCreditDelayBlock = ({
  creditData,
  handleShowForm,
}: ApproverCreditDelayBlockProps) => {
  return (
    <div className='grid grid-cols-7 max-lg:grid-cols-3 items-center py-3 text-center border-b-2 border-black text-black'>
      <p>{creditData?.code}</p>
      <p>{creditData?.name + ' ' + creditData?.lastname}</p>
      <p className='text-[0.90rem] max-lg:hidden'>
        ---
      </p>
      <p className='max-lg:hidden'>
        ---
      </p>
      <p className='max-lg:hidden'>---</p>
      <p className='max-lg:hidden'>{convertNumberToCurrency(Number(creditData?.amount))}</p>
      <span className='icon-eye text-primary-color m-auto cursor-pointer' onClick={() => handleShowForm(creditData?.code ?? 0)} />
    </div>
  )
}

export default ApproverCreditDelayBlock
