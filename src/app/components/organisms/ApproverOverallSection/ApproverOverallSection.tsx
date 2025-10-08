'use client'
import { useEffect, useState } from 'react'
import WelcomeMessage from '../../atoms/WelcomeMessage/WelcomeMessage'
import { useFormik } from 'formik'
import { CreditStatusesProperties } from '../../../constants/CreditStatusesProperties'
import BigInfoSquare from '../../atoms/BigInfoSquare/BigInfoSquare'
import { CreditData } from '../../../interfaces/creditData.interface'
import getAllCredits from '../../../services/getAllCredits'
import { checkID, checkName, checkStatus } from '../../../helpers/checkFilters'
import Paginator from '../../molecules/Paginator/Paginator'
import ApproverCreditList from '../ApproverOverallCreditList/ApproverOverallCreditList'
import { convertNumberToCurrency } from '../../../helpers/calculationsHelpers'
import getAmountCollectedTickets from '../../../services/getAmountCollectedTickets'

const ApproverOverallSection = () => {
  /**
   * perPage is the number of credits to be displayed
   */
  const perPage = 5
  /**
   * page is the page to be displayed
   */
  const [page, setPage] = useState<number>(1)
  /**
   * creditsList is the list of credits to be displayed
   */
  const [creditsList, setCreditsList] = useState<CreditData[]>([])
  const [collectedAmount, setCollectedAmount] = useState<number>(0)
  /**
   * formik is the formik object to manage the filter form
   */
  const formik = useFormik({
    initialValues: {
      filterStatus: 'Filtrar',
      filterId: '',
    },
    onSubmit: (values) => {},
  })
  /**
   * fetchCredits is the function to fetch the credits list
   */
  useEffect(() => {
    const fetchCredits = async () => {
      Promise.all([getAllCredits(), getAmountCollectedTickets()]).then(
        (values) => {
          setCreditsList(values[0])
          if (values[1]?.total[0]?.total) {
            setCollectedAmount(values[1]?.total[0].total)
          }
        }
      )
    }
    fetchCredits()
  }, [])

  /**
   * useEffect to reset the page when the filters change
   */
  useEffect(() => {
    setPage(1)
  }, [formik.values.filterStatus, formik.values.filterId])

  return (
    <>
      <div className='flex flex-row max-md:flex-col justify-between'>
        <WelcomeMessage />
      </div>
      <h2 className='font-semibold text-[1.5625rem] my-4'>Inicio</h2>
      <div className='flex flex-row max-xl:flex-col gap-12 py-8 max-xl:py-1 border-b-4 border-primary-color'>
        <BigInfoSquare
          text='Créditos en espera'
          value={creditsList
            .filter(
              (credit) => credit.status === CreditStatusesProperties[0].status
            )
            .length.toString()}
        />
        <BigInfoSquare
          text='Créditos aprobados'
          value={creditsList
            .filter(
              (credit) => credit.status !== CreditStatusesProperties[0].status
            )
            .length.toString()}
        />
        <BigInfoSquare
          text='Dinero recaudado'
          value={convertNumberToCurrency(collectedAmount)}
        />
      </div>
      <div className='flex flex-row max-md:flex-col justify-end my-10 h-[75px] text-[1.25rem]'>
        <div className='relative'>
          <input
            type='text'
            name='filterId'
            placeholder='Buscar por ID o Nombre'
            value={formik.values.filterId}
            onChange={formik.handleChange}
            className='border-primary-color border-[1px] p-2 rounded-lg pl-10 h-full w-[300px] max-md:w-full'
          />
          <span className='icon-search p-[1px] absolute left-4 top-[28px] max-md:top-1/4' />
        </div>
        <select
          className='border-primary-color border-[1px] md:ml-4 p-2 rounded-lg max-md:w-full max-md:mt-4'
          name='filterStatus'
          value={formik.values.filterStatus}
          onChange={formik.handleChange}
        >
          <option hidden>Filtrar</option>
          <option>Ninguno</option>
          {CreditStatusesProperties?.map((option, index) => (
            <option key={`${option}-${index}`} value={option.status}>
              {option.text}
            </option>
          ))}
        </select>
      </div>
      <ApproverCreditList
        creditsList={creditsList}
        formik={formik}
        page={page}
        perPage={perPage}
      />
      <Paginator
        total={
          creditsList
            .filter((credit) => checkStatus(credit, formik.values.filterStatus))
            .filter((credit) => checkName(credit, formik.values.filterId))
            .filter((credit) => checkID(credit, formik.values.filterId)).length
        }
        page={page}
        perPage={perPage}
        onChange={(page) => setPage(page)}
      />
    </>
  )
}

export default ApproverOverallSection
