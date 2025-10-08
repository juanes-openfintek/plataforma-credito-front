'use client'
import CreditStatus from '../components/molecules/CreditStatus/CreditStatus'
import BreadcrumbLabel from '../components/atoms/BreadcrumbLabel/BreadcrumbLabel'
import { useEffect, useState } from 'react'
import getAllCreditsByUser from '../services/getAllCreditsByUser'
import useDecryptedSession from '../hooks/useDecryptedSession'
import { CreditData } from '../interfaces/creditData.interface'

export default function User() {
  /**
   * nameUser is the name of the user in session
   */
  const nameUser = useDecryptedSession()?.name

  const [credits, setCredits] = useState<CreditData[]>([])
  useEffect(() => {
    /**
     * Fetches all credits and maps them to a Credit object.
     * @returns {Promise<void>}
     */
    const getCredits = async (): Promise<void> => {
      const response = await getAllCreditsByUser()
      setCredits(response)
    }
    getCredits()
  }, [])

  return (
    <main>
      <section className='p-[1rem] xl:ml-[300px] xl:mr-[50px] max-lg:pt-14 text-primary-color'>
        <BreadcrumbLabel text='Inicio' />
        <h2 className='text-[2.1875rem] max-md:leading-[2rem] leading-[1.5625rem] font-bold mb-2 mt-4'>
          Hola, {nameUser}
        </h2>
        <h3 className='text-[1.25rem] mb-6'>
          Bienvenido al panel principal, acá podrás ver el resumen de los
          estados de tus creditos
        </h3>
        {credits.length === 0 && (
          <h4 className='text-center m-20 text-[2rem]'>No hay creditos registrados en el sistema</h4>
        )}
        {credits?.map((credit, id) => (
          <CreditStatus key={id} dataCredit={credit} />
        ))}
      </section>
    </main>
  )
}
