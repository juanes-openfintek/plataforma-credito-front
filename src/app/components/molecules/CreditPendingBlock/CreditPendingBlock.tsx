import { TicketStatuses } from '../../../constants/TicketStatuses'
import { calculateAllInterest, convertNumberToCurrency } from '../../../helpers/calculationsHelpers'
import formatDateAdmin from '../../../helpers/formatDateAdmin'
import { Ticket } from '../../../interfaces/ticket.interface'
import LineTitle from '../../atoms/LineTitle/LineTitle'
import NextImage from '../../atoms/NextImage/NextImage'
import SquareButton from '../../atoms/SquareButton/SquareButton'

interface CreditPendingBlockProps {
  title: string
  toPayData: Ticket
  quotas: number
  creditNumber?: string
  customMargin?: boolean
  onClickHandler: (id: string) => void
}
/**
 * CreditPendingBlock component is used to display a credit pending block
 * @param title - The title of the credit pending block
 * @param toPayData - The data of the credit pending block
 * @param customMargin - If the credit pending block has a custom margin
 * @param onClickHandler - The function to execute when the user clicks the button
 * @returns The CreditPendingBlock component
 */
const CreditPendingBlock = ({
  title,
  toPayData,
  quotas,
  creditNumber,
  customMargin,
  onClickHandler,
}: CreditPendingBlockProps) => {
  const today = new Date()
  /**
   * Function to check if the date is in the last seven days
   * @param maxDate - The max date of the ticket
   * @returns A boolean that indicates if the date is in the last seven days
   */
  const checkLastSevenDays = (maxDate: string) => {
    const date = new Date(maxDate)
    date.setHours(23, 59, 0, 0)
    const weekAgo = new Date(date)
    weekAgo.setDate(today.getDate() - Number(process.env.NEXT_PUBLIC_DAYS_BEFORE_PAYMENT))
    return today >= weekAgo && today <= date
  }

  return (
    <div className='w-full font-bold text-[1.25rem] my-20'>
      <LineTitle title={title} />
      <div className='w-full bg-light-color-one py-4 px-10 mb-4 rounded-3xl text-black'>
        <div
          className={`flex flex-col md:flex-row mt-4 relative max-md:items-center ${
            !customMargin ? 'w-4/5 max-2xl:w-full' : 'w-full'
          }`}
        >
          <NextImage
            className={`${
              TicketStatuses.find(
                (status) => status.status === toPayData.status
              )?.background
            } rounded-3xl p-5 mr-4 md:mr-8 w-[80px] h-[80px] md:w-[80px] md:h-[80px]`}
            src={
              TicketStatuses.find(
                (status) => status.status === toPayData.status
              )?.icon ?? ''
            }
            alt='timer'
            width={40}
            height={40}
          />
          <div className='flex flex-col justify-between max-md:mt-8'>
            <p className='text-[1rem] md:text-[1.25rem]'>
              ESTADO:
            </p>
            <p className='text-[1.5rem] md:text-[1.875rem] font-normal'>
              {
                TicketStatuses.find(
                  (status) => status.status === toPayData.status
                )?.text
              }
            </p>
          </div>
          <div className='flex flex-col justify-between md:absolute md:right-0'>
            <p className='text-[1.875rem] text-primary-color'>
              {convertNumberToCurrency(calculateAllInterest(toPayData, quotas))}
            </p>
            <p className='text-[1.25rem] font-semibold text-center md:text-left'>
              {formatDateAdmin(toPayData.maxDate, 'onlyDate')}
            </p>
          </div>
        </div>
        <div
          className={`flex flex-col md:flex-row my-9 md:h-[72px] relative ${
            (checkLastSevenDays(toPayData.maxDate) &&
              toPayData.status === 'pending') ||
            toPayData.status === 'default'
              ? 'justify-between'
              : 'justify-end'
          }`}
        >
          {toPayData.status === 'pending' &&
            checkLastSevenDays(toPayData.maxDate) && !customMargin && (
              <div className='w-[150px] max-md:w-full text-[1.125rem]'>
                <SquareButton text='Pagar' onClickHandler={() => onClickHandler(toPayData._id)} />
              </div>
          )}
          {toPayData.status === 'default' && !customMargin && (
            <div className='w-[150px] max-md:w-full text-[1.125rem]'>
              <SquareButton text='Pagar' onClickHandler={() => onClickHandler(toPayData._id)} />
            </div>
          )}
          <div
            className={`flex flex-col justify-center max-md:items-center ${
              toPayData.status !== 'pending'
                ? 'md:absolute md:right-0'
                : 'max-md:mt-4'
            }`}
          >
            {toPayData.status === 'default' && (
              <p
                className={`text-[1rem] lg:text-[1.125rem] rounded-lg text-white text-center ${
                  customMargin ? 'w-[160px]' : '2xl:mr-[165px]'
                } w-[255px] bg-reject-color px-4 lg:px-8 py-1 font-poppins`}
              >
                Vencida
              </p>
            )}
            {toPayData.status === 'paid' && (
              <p
                className={`text-[1rem] lg:text-[1.125rem] rounded-lg text-white text-center ${
                  customMargin ? 'w-[160px]' : '2xl:mr-[165px]'
                } w-[255px] bg-success-color px-4 lg:px-8 py-1 font-poppins`}
              >
                Pagada
              </p>
            )}
            {toPayData.status === 'pending' && (
              <p
                className={`text-[1rem] lg:text-[1.125rem] rounded-lg text-black text-center ${
                  customMargin ? 'w-[160px]' : '2xl:mr-[165px]'
                } w-[255px] bg-progress-color px-4 lg:px-8 py-1 font-poppins`}
              >
                Pendiente
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreditPendingBlock
