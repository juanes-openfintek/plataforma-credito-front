import { convertNumberToCurrency } from '../../../helpers/calculationsHelpers'
import formatDateAdmin from '../../../helpers/formatDateAdmin'
import { CreditData } from '../../../interfaces/creditData.interface'

/**
 * Props for the ApproverCreditDisburseBlock component
 * @interface
 */
interface ApproverCreditDisburseBlockProps {
  creditData?: CreditData
  handleShowForm: (id: number) => void
}

const ApproverCreditDisburseBlock = ({
  creditData,
  handleShowForm,
}: ApproverCreditDisburseBlockProps) => {
  return (
    <div className='grid grid-cols-7 max-lg:grid-cols-3 items-center py-3 text-center border-b-2 border-black text-black'>
      <p>{creditData?.code}</p>
      <p>{creditData?.name + ' ' + creditData?.lastname}</p>
      <p className='max-lg:hidden'>
        {formatDateAdmin(creditData?.updatedAt ?? '', 'onlyDate')}
      </p>
      <p className='max-lg:hidden'>
        {formatDateAdmin(creditData?.maxDate ?? '', 'onlyDate')}
      </p>
      <p className='max-lg:hidden'>{convertNumberToCurrency(Number(creditData?.amount))}</p>
      <p className='max-lg:hidden'>{creditData?.account?.accountEntity}</p>
      <span className='icon-eye text-primary-color m-auto cursor-pointer' onClick={() => handleShowForm(creditData?.code ?? 0)} />
    </div>
  )
}

export default ApproverCreditDisburseBlock
