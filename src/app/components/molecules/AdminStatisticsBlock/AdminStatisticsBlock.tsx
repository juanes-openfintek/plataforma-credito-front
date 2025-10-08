import { convertNumberToCurrency } from '../../../helpers/calculationsHelpers'
import formatDateAdmin from '../../../helpers/formatDateAdmin'

/**
 * Props for the AdminStatisticsBlock component
 * @interface
 */
interface AdminStatisticsBlockProps {
  creditData: any
}

const AdminStatisticsBlock = ({
  creditData
}: AdminStatisticsBlockProps) => {
  return (
    <div className='grid grid-cols-7 max-lg:grid-cols-3 items-center py-3 text-center border-b-2 border-black text-black'>
      <p>{creditData.code}</p>
      <p>{creditData.name + ' ' + creditData.lastname}</p>
      <p className='max-lg:hidden'>{formatDateAdmin(creditData.created, 'basic')}</p>
      <p>{convertNumberToCurrency(creditData?.subscriber?.total)}</p>
      <p className='max-lg:hidden'>{convertNumberToCurrency(creditData?.subscriber?.remaining)}</p>
      <div>
        <p className='max-lg:hidden'>{convertNumberToCurrency(creditData?.subscriber?.totalPaid)}</p>
        <div className='bg-light-color-two h-1 rounded-full w-[60%] m-auto'>
          <div
            className='bg-primary-color h-1 rounded-full'
            style={{ width: `${creditData?.subscriber?.percentage}%` }}
          />
        </div>
      </div>
      <p className='max-lg:hidden'>{creditData?.account?.accountEntity}</p>
    </div>
  )
}

export default AdminStatisticsBlock
