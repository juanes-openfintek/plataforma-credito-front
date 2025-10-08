import { convertNumberToCurrency } from '../../../helpers/calculationsHelpers'
import formatDateAdmin from '../../../helpers/formatDateAdmin'
import { CreditData } from '../../../interfaces/creditData.interface'

/**
 * Props for the ApproverCreditWaitBlock component
 * @interface
 */
interface ApproverCreditWaitBlockProps {
  creditData?: CreditData
  handleShowForm: (id: number) => void
}

const ApproverCreditWaitBlock = ({
  creditData,
  handleShowForm,
}: ApproverCreditWaitBlockProps) => {
  return (
    <div className='grid grid-cols-6 max-lg:grid-cols-3 items-center py-3 text-center border-b-2 border-black text-black'>
      <p>{creditData?.code}</p>
      <p>{creditData?.name + ' ' + creditData?.lastname}</p>
      <p className='text-[0.90rem] max-lg:hidden'>
        {formatDateAdmin(creditData?.created ?? '', 'admin')}
      </p>
      <p className='max-lg:hidden'>
        {convertNumberToCurrency(Number(creditData?.amount))}
      </p>
      <p className='max-lg:hidden'>{creditData?.account?.accountEntity}</p>
      <p
        className='text-primary-color cursor-pointer max-md:text-[0.75rem]'
        onClick={() => handleShowForm(creditData?.code ?? 0)}
      >
        Aprobar/desaprobar
      </p>
    </div>
  )
}

export default ApproverCreditWaitBlock
