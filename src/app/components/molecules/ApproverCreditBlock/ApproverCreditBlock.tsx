import { convertNumberToCurrency } from '../../../helpers/calculationsHelpers'
import TagStatus from '../../atoms/TagStatus/TagStatus'
import formatDateAdmin from '../../../helpers/formatDateAdmin'
import { CreditData } from '../../../interfaces/creditData.interface'

/**
 * Props for the ApproverCreditBlockBlock component
 * @interface
 */
interface ApproverCreditBlockProps {
  creditData?: CreditData
}

const ApproverCreditBlock = ({
  creditData,
}: ApproverCreditBlockProps) => {
  return (
    <div className='grid grid-cols-6 max-lg:grid-cols-3 items-center py-3 text-center border-b-2 border-black text-black'>
      <p>{creditData?.code}</p>
      <p>{creditData?.name + ' ' + creditData?.lastname}</p>
      <TagStatus text={creditData?.status ?? ''} center />
      <p className='text-[0.90rem] max-lg:hidden'>{formatDateAdmin(creditData?.created ?? '', 'admin')}</p>
      <p className='max-lg:hidden'>{convertNumberToCurrency(Number(creditData?.amount))}</p>
      <p className='max-lg:hidden'>{creditData?.account?.accountEntity}</p>
    </div>
  )
}

export default ApproverCreditBlock
