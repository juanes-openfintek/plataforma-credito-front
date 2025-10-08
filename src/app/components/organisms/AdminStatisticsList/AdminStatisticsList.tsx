'use client'
import { useEffect, useState } from 'react'
import SimpleFieldInput from '../../atoms/SimpleFieldInput/SimpleFieldInput'
import SquareButton from '../../atoms/SquareButton/SquareButton'
import AdminStatisticsBlock from '../../molecules/AdminStatisticsBlock/AdminStatisticsBlock'
import { useFormik } from 'formik'
import { CreditData } from '../../../interfaces/creditData.interface'
import Paginator from '../../molecules/Paginator/Paginator'
import { checkEndDate, checkStartDate } from '../../../helpers/checkFilters'
import getStatisticsCredits from '../../../services/getStatisticsCredits'
import { CreditStatusesProperties } from '../../../constants/CreditStatusesProperties'

const AdminStatisticsList = () => {
  /**
   * Declare all the dates to be used in the filters
   */
  const today = new Date()
  const weekAgo = new Date(today)
  const fifthteenAgo = new Date(today)
  const monthAgo = new Date(today)
  today.setHours(0, 0, 0, 0)
  weekAgo.setHours(0, 0, 0, 0)
  fifthteenAgo.setHours(0, 0, 0, 0)
  monthAgo.setHours(0, 0, 0, 0)
  weekAgo.setDate(today.getDate() - 7)
  fifthteenAgo.setDate(today.getDate() - 15)
  monthAgo.setMonth(today.getMonth() - 1)

  const [credits, setCredits] = useState<CreditData[]>([])
  /**
   * page is the page to be displayed
   */
  const [page, setPage] = useState<number>(1)

  /**
   * perPage is the number of credits to be displayed
   */
  const perPage = 10
  /**
   * formik is the formik hook to handle the filters
   */
  const formik = useFormik({
    initialValues: {
      filterStartDate: '',
      filterEndDate: '',
    },
    onSubmit: (values) => {},
  })
  /**
   * useEffect to fetch all the credits
   */
  useEffect(() => {
    const fetchCredits = async () => {
      const confirmedCredits = getStatisticsCredits(CreditStatusesProperties[8].status)
      const paidCredits = getStatisticsCredits(CreditStatusesProperties[9].status)
      Promise.all([confirmedCredits, paidCredits]).then((values) => {
        setCredits(values[0].concat(values[1]))
      })
    }
    fetchCredits()
  }, [])
  /**
   * useEffect to reset the page when the filters change
   */
  useEffect(() => {
    setPage(1)
  }, [formik.values.filterStartDate, formik.values.filterEndDate])

  return (
    <>
      <div className='flex flex-row max-md:flex-col my-10 justify-between'>
        <div className='flex flex-row max-md:flex-col gap-8'>
          <SquareButton
            text='Hoy'
            gray={
              !(
                formik.values.filterStartDate ===
                  today.toISOString().split('T')[0] &&
                formik.values.filterEndDate ===
                  today.toISOString().split('T')[0]
              )
            }
            onClickHandler={() => {
              formik.setValues({
                filterStartDate: today.toISOString().split('T')[0],
                filterEndDate: today.toISOString().split('T')[0],
              })
            }}
          />
          <SquareButton
            text='Semanal'
            gray={
              !(
                formik.values.filterStartDate ===
                  weekAgo.toISOString().split('T')[0] &&
                formik.values.filterEndDate ===
                  today.toISOString().split('T')[0]
              )
            }
            onClickHandler={() => {
              formik.setValues({
                filterStartDate: weekAgo.toISOString().split('T')[0],
                filterEndDate: today.toISOString().split('T')[0],
              })
            }}
          />
          <SquareButton
            text='Quincenal'
            gray={
              !(
                formik.values.filterStartDate ===
                  fifthteenAgo.toISOString().split('T')[0] &&
                formik.values.filterEndDate ===
                  today.toISOString().split('T')[0]
              )
            }
            onClickHandler={() => {
              formik.setValues({
                filterStartDate: fifthteenAgo.toISOString().split('T')[0],
                filterEndDate: today.toISOString().split('T')[0],
              })
            }}
          />
          <SquareButton
            text='Mensual'
            gray={
              !(
                formik.values.filterStartDate ===
                  monthAgo.toISOString().split('T')[0] &&
                formik.values.filterEndDate ===
                  today.toISOString().split('T')[0]
              )
            }
            onClickHandler={() => {
              formik.setValues({
                filterStartDate: monthAgo.toISOString().split('T')[0],
                filterEndDate: today.toISOString().split('T')[0],
              })
            }}
          />
        </div>
        <div className='flex flex-row gap-2 max-md:mt-4'>
          <SimpleFieldInput
            placeholder='Desde'
            value={formik.values.filterStartDate}
            name='filterStartDate'
            type='date'
            label=''
            onHandleChange={formik.handleChange}
            border
          />
          <SimpleFieldInput
            placeholder='Hasta'
            value={formik.values.filterEndDate}
            name='filterEndDate'
            type='date'
            label=''
            onHandleChange={formik.handleChange}
            border
          />
        </div>
      </div>

      <div className='bg-light-color-one rounded-2xl px-6 py-6 '>
        <div className='grid grid-cols-7 max-lg:grid-cols-3 text-center font-bold text-[1.125rem]'>
          <h3>ID Solicitud</h3>
          <h3>Cliente</h3>
          <h3 className='max-lg:hidden'>Fecha de solicitud</h3>
          <h3>Cantidad solicitada</h3>
          <h3 className='max-lg:hidden'>Pago restante</h3>
          <h3 className='max-lg:hidden'>Valor abonado</h3>
          <h3 className='max-lg:hidden'>Banco</h3>
        </div>
        {credits
          .filter((credit) =>
            checkStartDate(credit, formik.values.filterStartDate)
          )
          .filter((credit) => checkEndDate(credit, formik.values.filterEndDate))
          .slice((page - 1) * perPage, page * perPage)
          .map((credit, index) => (
            <AdminStatisticsBlock
              key={`${credit.code}-${index}`}
              creditData={credit}
            />
          ))}
      </div>
      <Paginator
        total={
          credits
            .filter((credit) =>
              checkStartDate(credit, formik.values.filterStartDate)
            )
            .filter((credit) =>
              checkEndDate(credit, formik.values.filterEndDate)
            ).length
        }
        page={page}
        perPage={perPage}
        onChange={(page) => setPage(page)}
      />
    </>
  )
}

export default AdminStatisticsList
