'use client'
import { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import WelcomeMessage from '../../atoms/WelcomeMessage/WelcomeMessage'
import BigSquareButton from '../../atoms/BigSquareButton/BigSquareButton'
import TagStatus from '../../atoms/TagStatus/TagStatus'
import Paginator from '../../molecules/Paginator/Paginator'
import { getCreditsAnalyst1 } from '../../../services/analyst1.service'
import { CreditData } from '../../../interfaces/creditData.interface'
import { CreditStatusesProperties } from '../../../constants/CreditStatusesProperties'
import Analyst1CreditList from '../Analyst1CreditList/Analyst1CreditList'
import Analyst1CreditDetailImproved from '../Analyst1CreditDetail/Analyst1CreditDetailImproved'

const Analyst1CreditSection = () => {
  const perPage = 10
  const [page, setPage] = useState<number>(1)
  const [creditsList, setCreditsList] = useState<CreditData[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [showDetail, setShowDetail] = useState<boolean>(false)
  const [selectedCredit, setSelectedCredit] = useState<CreditData | null>(null)
  
  const [statusFilter, setStatusFilter] = useState<string>('SUBMITTED')

  const formik = useFormik({
    initialValues: {
      search: '',
    },
    onSubmit: (values) => {},
  })

  const handleShowDetail = (credit: CreditData) => {
    setSelectedCredit(credit)
    setShowDetail(true)
  }

  const fetchCredits = async () => {
    try {
      setLoading(true)
      const credits = await getCreditsAnalyst1(formik.values.search)
      setCreditsList(credits)
    } catch (error) {
      console.error('Error fetching credits:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!showDetail) {
      fetchCredits()
    }
  }, [showDetail, formik.values.search])

  useEffect(() => {
    setPage(1)
  }, [formik.values.search])

  const filteredCredits = creditsList.filter(credit => {
    if (statusFilter === 'ALL') return true
    return credit.status === statusFilter
  })

  const statusCounts = {
    submitted: creditsList.filter(c => c.status === 'SUBMITTED').length,
    inReview: creditsList.filter(c => c.status === 'ANALYST1_REVIEW').length,
    returned: creditsList.filter(c => c.status === 'ANALYST1_RETURNED').length,
  }

  return (
    <>
      {!showDetail && (
        <section className='text-primary-color'>
          <div className='flex flex-row max-md:flex-col justify-between'>
            <WelcomeMessage />
            <div className='flex flex-row max-md:flex-col max-md:w-full justify-between my-10 h-[75px] text-[1.25rem]'>
              <div className='relative max-md:w-full'>
                <input
                  type='text'
                  name='search'
                  placeholder='Buscar por ID, nombre o documento'
                  value={formik.values.search}
                  onChange={formik.handleChange}
                  className='border-primary-color border-[1px] p-2 rounded-lg pl-10 h-full w-[350px] max-md:w-full'
                />
                <span className='icon-search p-[1px] absolute left-4 top-[28px] max-md:top-1/4' />
              </div>
            </div>
          </div>

          <div className='flex flex-row items-center mb-4'>
            <h2 className='font-semibold text-[1.5625rem] mr-4'>
              Créditos - Analista 1 (Validación Inicial)
            </h2>
            <TagStatus text={
              statusFilter === 'SUBMITTED' ? 'Radicados' :
              statusFilter === 'ANALYST1_REVIEW' ? 'En Revisión' :
              statusFilter === 'ANALYST1_RETURNED' ? 'Devueltos' : 'Todos'
            } />
          </div>

          <div className='flex flex-row max-md:flex-col gap-4 py-8 border-b-4 border-primary-color'>
            <BigSquareButton
              text='Créditos Radicados'
              value={statusCounts.submitted.toString()}
              active={statusFilter === 'SUBMITTED'}
              onHandleClick={() => setStatusFilter('SUBMITTED')}
            />
            <BigSquareButton
              text='En Revisión'
              value={statusCounts.inReview.toString()}
              active={statusFilter === 'ANALYST1_REVIEW'}
              onHandleClick={() => setStatusFilter('ANALYST1_REVIEW')}
            />
            <BigSquareButton
              text='Devueltos'
              value={statusCounts.returned.toString()}
              active={statusFilter === 'ANALYST1_RETURNED'}
              onHandleClick={() => setStatusFilter('ANALYST1_RETURNED')}
            />
          </div>

          {loading ? (
            <div className='flex justify-center items-center h-64'>
              <p className='text-xl'>Cargando créditos...</p>
            </div>
          ) : (
            <>
              <Analyst1CreditList
                creditsList={filteredCredits}
                page={page}
                perPage={perPage}
                onSelectCredit={handleShowDetail}
              />
              
              <Paginator
                total={filteredCredits.length}
                page={page}
                perPage={perPage}
                onChange={(page) => setPage(page)}
              />
            </>
          )}
        </section>
      )}

      {showDetail && selectedCredit && (
        <Analyst1CreditDetailImproved
          credit={selectedCredit}
          onBack={() => {
            setShowDetail(false)
            setSelectedCredit(null)
          }}
          onRefresh={fetchCredits}
        />
      )}
    </>
  )
}

export default Analyst1CreditSection

