import { convertNumberToCurrency } from '../../../helpers/calculationsHelpers'
import TagStatus from '../../atoms/TagStatus/TagStatus'
import formatDateAdmin from '../../../helpers/formatDateAdmin'
import { CreditData } from '../../../interfaces/creditData.interface'

/**
 * Props for the AdminCreditBlock component
 * @interface
 */
interface AdminCreditBlockProps {
  creditData?: CreditData
  handleShowForm: (id: number) => void
}

const AdminCreditBlock = ({
  creditData,
  handleShowForm,
}: AdminCreditBlockProps) => {
  return (
    <div className='grid grid-cols-8 max-lg:grid-cols-3 items-center py-3 text-center border-b-2 border-black text-black'>
      <p>{creditData?.code}</p>
      <p>{creditData?.name + ' ' + creditData?.lastname}</p>
      <TagStatus text={creditData?.status ?? ''} center />
      <p className='col-span-2 max-lg:hidden'>
        {formatDateAdmin(creditData?.created ?? '', 'admin')}
      </p>
      <p className='max-lg:hidden'>
        {convertNumberToCurrency(Number(creditData?.amount))}
      </p>
      <p className='max-lg:hidden'>{creditData?.account?.accountEntity}</p>
      <p
        className='text-primary-color cursor-pointer'
        onClick={() => handleShowForm(creditData?.code ?? 0)}
      >
        Ver
      </p>
    </div>
  )
}

export default AdminCreditBlock
