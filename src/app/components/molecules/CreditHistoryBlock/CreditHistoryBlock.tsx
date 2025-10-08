import { CreditStatusesProperties } from '../../../constants/CreditStatusesProperties'
import { calculateAllInterest, convertNumberToCurrency } from '../../../helpers/calculationsHelpers'
import formatDateAdmin from '../../../helpers/formatDateAdmin'
import { CreditData } from '../../../interfaces/creditData.interface'
import LineTitle from '../../atoms/LineTitle/LineTitle'
import NextImage from '../../atoms/NextImage/NextImage'
import Paginator from '../Paginator/Paginator'

interface CreditHistoryBlockProps {
  page: number
  perPage: number
  setPage: (page: number) => void
  creditHistory: CreditData[]
}
/**
 * CreditHistoryBlock component is used to display a credit history block
 * @param creditHistory - The data of the credit history
 * @returns A CreditHistoryBlock component
 */
const CreditHistoryBlock = ({ creditHistory, page, perPage, setPage, }: CreditHistoryBlockProps) => {
  return (
    <div className='font-bold'>
      <LineTitle title='Historial de créditos' />
      <div className='flex flex-col bg-light-color-one md:py-4 rounded-3xl'>
        {creditHistory.slice((page - 1) * perPage, page * perPage).map((credit, index) => {
          const status = CreditStatusesProperties.find(
            (property) => property.status === credit.status
          )
          return (
            <div
              className={`flex flex-col md:flex-row mx-8 py-6 text-black justify-between ${
                index === creditHistory.length - 1
                  ? ''
                  : 'border-b-[2px] border-light-color-two'
              }`}
              key={`block-${index}`}
            >
              <div className='flex flex-row max-md:items-center'>
                <NextImage
                  className={`${status?.background} rounded-3xl p-5 mx-4 md:mx-8 w-[80px] h-[80px] md:w-[80px] md:h-[80px]`}
                  src={status?.icon ?? ''}
                  alt={status?.text ?? ''}
                  width={40}
                  height={40}
                />
                <div className='flex flex-col justify-between'>
                  <p className='text-[1rem] md:text-[1.25rem]'>
                    ESTADO:
                  </p>
                  <p className='text-[1.5rem] md:text-[1.875rem] font-normal'>
                    {status?.text}
                  </p>
                </div>
              </div>
              <div className='flex flex-row md:flex-col justify-between max-md:items-center'>
                <p className='text-[1.875rem] text-primary-color'>
                  {convertNumberToCurrency(calculateAllInterest(credit))}
                </p>
                <p className='text-[1.25rem] font-semibold text-right'>
                  {formatDateAdmin(credit.maxDate, 'onlyDate')}
                </p>
              </div>
            </div>
          )
        })}
        {creditHistory.length < 1 && (
          <h3 className='text-[2rem] font-bold text-center my-10'>
            No hay créditos por mostrar
          </h3>
        )}
      </div>
      <Paginator
        total={
          creditHistory
            .length
        }
        page={page}
        perPage={perPage}
        onChange={(page) => setPage(page)}
      />
    </div>
  )
}

export default CreditHistoryBlock
