'use client'
import { useEffect, useState } from 'react'
import CreditPendingBlock from '../../components/molecules/CreditPendingBlock/CreditPendingBlock'
import PaymentInfo from '../../components/organisms/PaymentInfo/PaymentInfo'
import BreadcrumbLabel from '../../components/atoms/BreadcrumbLabel/BreadcrumbLabel'
import getAllCreditsByUser from '../../services/getAllCreditsByUser'
import { CreditData } from '../../interfaces/creditData.interface'
import getCreditsTickets from '../../services/getCreditTickets'
import { Ticket } from '../../interfaces/ticket.interface'
/**
 * IdCreditPage component is used to display the credit payout page
 * @returns A IdCreditPage component
 */
const IdCreditPage = () => {
  /**
   * State to manage the credit payout layout
   */
  const [creditPayout, setCreditPayout] = useState(false)
  /**
   * State to manage the credit payout data
   */
  const [ticketList, setTicketList] = useState<Ticket[]>([])
  /**
   * State to manage the credit payout data
   */
  const [credit, setCredit] = useState<any>('')
  /**
   * State to manage the credit payout data
   */
  const [creditSelected, setCreditSelected] = useState<any>('')
  /**
   * useEffect to fetch the credits
   */
  useEffect(() => {
    const fetchCredits = async () => {
      const credits = await getAllCreditsByUser()
      const creditFindedActive: CreditData = credits.find(
        (credit: CreditData) =>
          credit.status === 'confirmed' || credit.status === 'default'
      )
      setCredit({
        code: creditFindedActive?.code.toString(),
        id: creditFindedActive?._id,
      })
      if (creditFindedActive?._id) {
        const credit = await getCreditsTickets(creditFindedActive?._id)
        setTicketList(credit?.tickets ?? [])
      }
    }
    fetchCredits()
  }, [])
  return (
    <main>
      <section className='p-[1rem] xl:ml-[300px] xl:mr-[50px] max-lg:pt-14 text-primary-color'>
        <BreadcrumbLabel
          link={creditPayout ? '/usuario/pagos' : ''}
          text='Pagos pendientes'
          leftArrow={creditPayout}
          onClickHandler={() => setCreditPayout(false)}
        />
        {!creditPayout &&
          ticketList?.map((ticket, index) => (
            <CreditPendingBlock
              key={index}
              title='Pagos pendientes'
              toPayData={ticket}
              quotas={credit.quotasNumber}
              creditNumber={credit.code}
              onClickHandler={(id) => { setCreditSelected(id); setCreditPayout(true) }}
            />
          ))}
        {ticketList?.length === 0 && (
          <h4 className='text-center m-20 text-[2rem]'>No hay pagos pendientes en el sistema</h4>
        )}
        {creditPayout && (
          <PaymentInfo
            ticketValue={ticketList?.find(
              (ticket) =>
                ticket._id === creditSelected
            )}
            quotas={credit.quotasNumber}
            creditNumber={credit.code}
          />
        )}
      </section>
    </main>
  )
}

export default IdCreditPage
