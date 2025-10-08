'use client'
import { useRouter } from 'next/navigation'
import SquareButton from '../../components/atoms/SquareButton/SquareButton'
import CreditBlockInfo from '../../components/molecules/CreditBlockInfo/CreditBlockInfo'
import CreditHistoryBlock from '../../components/molecules/CreditHistoryBlock/CreditHistoryBlock'
import BreadcrumbLabel from '../../components/atoms/BreadcrumbLabel/BreadcrumbLabel'
import { useEffect, useState } from 'react'
import getAllCreditsByUser from '../../services/getAllCreditsByUser'
import { CreditData } from '../../interfaces/creditData.interface'
import getCreditsTickets from '../../services/getCreditTickets'
import { Ticket } from '../../interfaces/ticket.interface'

/**
 * Credits is a component that renders the credits page
 * @returns The Credits component
 */
export default function Credits() {
  /**
   * router is the router of the page
   */
  const router = useRouter()
  /**
   * creditList is the list of credits
   */
  const [creditList, setCreditList] = useState([])
  /**
   * creditActive is the active credit
   */
  const [creditActive, setCreditActive] = useState<any | undefined>()
  /**
   * canCreateCredit is a boolean that indicates if the user can create a credit
   */
  const [canCreateCredit, setCanCreateCredit] = useState<boolean>(false)
  /**
   * perPage is the number of items to be displayed per page
   */
  const perPage = 3
  /**
   * page is the page to be displayed
   */
  const [page, setPage] = useState<number>(1)
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
      if (!creditFindedActive) {
        setCanCreateCredit(true)
      }
      if (creditFindedActive?._id) {
        setCreditActive(await getCreditsTickets(creditFindedActive?._id))
      }
      setCreditList(credits)
    }
    fetchCredits()
  }, [])

  return (
    <main>
      <section className='p-[1rem] xl:ml-[300px] xl:mr-[50px] max-lg:pt-14 text-primary-color'>
        <BreadcrumbLabel text='Crédito' />
        {canCreateCredit && (
          <div className='w-[230px] h-[70px] text-[1.25rem] font-semibold mt-4'>
            <SquareButton
              text='Nuevo crédito'
              withIcon
              onClickHandler={() =>
                router.push('/usuario/creditos/nuevo-credito')}
            />
          </div>
        )}
        <div className='grid lg:grid-cols-2 grid-cols-1 gap-6 md:gap-20 text-black my-12'>
          <CreditBlockInfo
            title='Cuotas activas'
            quotas={creditActive?.quotasNumber}
            multiBlockData={creditActive?.tickets
              .filter(
                (ticket: Ticket) =>
                  ticket.status === 'pending'
              )
              .splice(0, 2)}
          />
          <CreditBlockInfo
            title='Pagos pendientes'
            quotas={creditActive?.quotasNumber}
            toPayData={creditActive?.tickets.find(
              (ticket: Ticket) =>
                ticket.status === 'pending' || ticket.status === 'default'
            )}
            creditCode={creditActive?.code}
            onClickHandler={() => router.push('/usuario/pagos')}
          />
        </div>
        <CreditHistoryBlock
          creditHistory={creditList}
          page={page}
          setPage={setPage}
          perPage={perPage}
        />
      </section>
    </main>
  )
}
