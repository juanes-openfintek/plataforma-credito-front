import { calculateAllInterest, convertNumberToCurrency } from '../../../helpers/calculationsHelpers'
import formatDateAdmin from '../../../helpers/formatDateAdmin'
import { Ticket } from '../../../interfaces/ticket.interface'
import LineTitle from '../../atoms/LineTitle/LineTitle'
import SquareButton from '../../atoms/SquareButton/SquareButton'

interface CreditBlockInfoProps {
  title: string
  quotas: number,
  toPayData?: Ticket
  multiBlockData?: Ticket[]
  creditCode?: string
  onClickHandler?: () => void
}
/**
 * CreditBlockInfo component is used to display a credit block info
 * @param title - The title to be displayed
 * @param toPayData - The data of the credit block to pay if is only one
 * @param multiBlockData - The data of the credit blocks to pay if are more than one
 * @returns A CreditBlockInfo component
 */
const CreditBlockInfo = ({
  title,
  quotas,
  multiBlockData,
  toPayData,
  creditCode,
  onClickHandler,
}: CreditBlockInfoProps) => {
  /**
   * Function to check if the date is in the past
   * @param maxDate - The max date of the ticket
   * @returns A boolean that indicates if the date is in the past
   */
  const checkPastDate = (maxDate: string) => {
    const today = new Date()
    const date = new Date(maxDate)
    date.setHours(23, 59, 0, 0)
    return today > date
  }

  return (
    <div className='w-full font-bold text-[1.25rem]'>
      <LineTitle title={title} />
      {!multiBlockData?.length && !toPayData && (
        <h3 className='text-[2rem] text-primary-color font-bold text-center my-10'>
          No hay créditos activos
        </h3>
      )}
      {multiBlockData &&
        multiBlockData.map((block, index) => (
          <div
            className='w-full bg-light-color-one py-4 px-10 mb-4 rounded-3xl'
            key={'block-' + index}
          >
            <div className='flex justify-between'>
              <p className='text-[1.25rem] lg:text-[1.875rem] font-semibold'>
                Valor cuota
              </p>
              <p className='text-[1.25rem] lg:text-[1.875rem]'>
                {convertNumberToCurrency(calculateAllInterest(block, quotas))}
              </p>
            </div>
            <div className='flex justify-between'>
              <p className='text-[1rem] lg:text-[1.5rem] font-semibold'>
                Fecha límite de pago
              </p>
              <p className='text-[1rem] lg:text-[1.5rem]'>
                {formatDateAdmin(block.maxDate, 'onlyDate')}
              </p>
            </div>
          </div>
        ))}
      {toPayData && (
        <div className='w-full bg-light-color-one py-4 px-10 mb-4 rounded-3xl'>
          <div className='flex justify-between items-center'>
            <p className='font-bold text-[1.5rem] lg:text-[1.875rem] text-primary-color'>
              {convertNumberToCurrency(calculateAllInterest(toPayData, quotas))}
            </p>
            {checkPastDate(toPayData.maxDate) && (
              <p className='text-[1rem] lg:text-[1.125rem] rounded-lg text-white bg-reject-color px-4 lg:px-8 py-1 font-poppins'>
                Vencida
              </p>
            )}
            {!checkPastDate(toPayData.maxDate) && (
              <p className='text-[1rem] lg:text-[1.125rem] rounded-lg text-black bg-progress-color px-4 lg:px-8 py-1 font-poppins'>
                Pendiente
              </p>
            )}
          </div>
          <div className='flex justify-between'>
            <p className='font-semibold text-[1.25rem]'>
              {formatDateAdmin(toPayData.maxDate, 'onlyDate')}
            </p>
          </div>
          <div className='my-9 w-[70%] h-[4rem] text-[1.125rem] mx-auto'>
            <SquareButton text='Pagar' onClickHandler={onClickHandler} />
          </div>
        </div>
      )}
    </div>
  )
}

export default CreditBlockInfo
