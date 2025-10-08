'use client'
import { useEffect, useState } from 'react'
import { CreditStatusesProperties } from '../../../constants/CreditStatusesProperties'
import BigSquareButton from '../../atoms/BigSquareButton/BigSquareButton'
import WelcomeMessage from '../../atoms/WelcomeMessage/WelcomeMessage'
import getAllCredits from '../../../services/getAllCredits'
import { useFormik } from 'formik'
import { CreditData } from '../../../interfaces/creditData.interface'
import TagStatus from '../../atoms/TagStatus/TagStatus'
import { checkID } from '../../../helpers/checkFilters'
import Paginator from '../../molecules/Paginator/Paginator'
import ApproverCreditWaitList from '../ApproverCreditWaitList/ApproverCreditWaitList'
import ApproverCreditDelayList from '../ApproverCreditDelayList/ApproverCreditDelayList'
import ApproverCreditDisburseList from '../ApproverCreditDisburseList/ApproverCreditDisburseList'
import ApproverDetailWait from '../ApproverDetailWait/ApproverDetailWait'
import ApproverDetailDelay from '../ApproverDetailDelay/ApproverDetailDelay'
import ApproverDetailDisburse from '../ApproverDetailDisburse/ApproverDetailDisburse'

const ApproverCreditSection = () => {
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
  /**
   * selectionCategory is the category selected in the filter
   */
  const [selectionCategory, setSelectionCategory] = useState<string>(CreditStatusesProperties[0].status)
  /**
   * formik is the formik object to manage the filter form
   */
  const formik = useFormik({
    initialValues: {
      filterId: '',
    },
    onSubmit: (values) => {},
  })

  /**
   * showForm is the state to show or hide the form
   */
  const [showForm, setShowForm] = useState<boolean>(false)
  /**
   * selectedCredit is the credit to be displayed in the form
   */
  const [selectedCredit, setSelectedCredit] = useState<CreditData>()
  /**
   * creditAmounts is the list of amounts of the credits
   */
  const [creditAmounts, setCreditsAmount] = useState<Number[]>([0, 0, 0])
  /**
   * handleShowForm is the function to show the form
   * @param id is the id of the credit to be displayed
   */
  const handleShowForm = (id: number) => {
    setSelectedCredit(creditsList.find((credit) => credit.code === id)!!)
    setShowForm(true)
  }

  /**
   * fetchCredits is the function to fetch the credits list
   */
  useEffect(() => {
    const fetchCredits = async () => {
      const credits = await getAllCredits()
      setCreditsList(
        credits.filter((credit: CreditData) => {
          if (selectionCategory === CreditStatusesProperties[1].status) {
            return credit.status !== CreditStatusesProperties[0].status
          } else {
            return credit.status === selectionCategory
          }
        })
      )
      if (credits) {
        setCreditsAmount([
          credits.filter(
            (credit: CreditData) =>
              credit.status === CreditStatusesProperties[0].status
          ).length,
          credits.filter(
            (credit: CreditData) =>
              credit.status === CreditStatusesProperties[3].status
          ).length,
          credits.filter(
            (credit: CreditData) =>
              credit.status !== CreditStatusesProperties[0].status
          ).length,
        ])
      }
    }
    if (!showForm) {
      setCreditsList([])
      fetchCredits()
    }
  }, [selectionCategory, showForm])
  /**
   * useEffect to reset the page when the filters change
   */
  useEffect(() => {
    setPage(1)
  }, [formik.values.filterId, selectionCategory])

  return (
    <>
      {!showForm && (
        <section className='p-[1rem] xl:ml-[300px] xl:mr-[50px] max-lg:pt-14 text-primary-color'>
          <div className='flex flex-row max-md:flex-col justify-between'>
            <WelcomeMessage />
            <div className='flex flex-row max-md:flex-col max-md:w-full justify-between my-10  h-[75px] text-[1.25rem]'>
              <div className='relative max-md:w-full'>
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
            </div>
          </div>
          <div className='flex flex-row'>
            <h2 className='font-semibold text-[1.5625rem] mr-4'>Créditos</h2>
            <TagStatus text={selectionCategory} />
          </div>
          <div className='flex flex-row max-md:flex-col gap-12 max-md:gap-4 py-8 border-b-4 border-primary-color'>
            <BigSquareButton
              text='Créditos por desembolsar'
              value={creditAmounts[0].toString()}
              active={selectionCategory === CreditStatusesProperties[0].status}
              onHandleClick={() =>
                setSelectionCategory(CreditStatusesProperties[0].status)}
            />
            <BigSquareButton
              text='Créditos activos'
              value={creditAmounts[2].toString()}
              active={selectionCategory === CreditStatusesProperties[1].status}
              onHandleClick={() =>
                setSelectionCategory(CreditStatusesProperties[1].status)}
            />
            <BigSquareButton
              text='Créditos en mora'
              value={creditAmounts[1].toString()}
              active={selectionCategory === CreditStatusesProperties[3].status}
              onHandleClick={() =>
                setSelectionCategory(CreditStatusesProperties[3].status)}
            />
          </div>
          {selectionCategory === CreditStatusesProperties[0].status && (
            <ApproverCreditWaitList
              creditsList={creditsList}
              formik={formik}
              page={page}
              perPage={perPage}
              handleShowForm={handleShowForm}
            />
          )}
          {selectionCategory === CreditStatusesProperties[3].status && (
            <ApproverCreditDelayList
              creditsList={creditsList}
              formik={formik}
              page={page}
              perPage={perPage}
              handleShowForm={handleShowForm}
            />
          )}
          {selectionCategory === CreditStatusesProperties[1].status && (
            <ApproverCreditDisburseList
              creditsList={creditsList}
              formik={formik}
              page={page}
              perPage={perPage}
              handleShowForm={handleShowForm}
            />
          )}
          {selectionCategory && (
            <Paginator
              total={
                creditsList.filter((credit) =>
                  checkID(credit, formik.values.filterId)
                ).length
              }
              page={page}
              perPage={perPage}
              onChange={(page) => setPage(page)}
            />
          )}
        </section>
      )}
      {showForm && selectionCategory === CreditStatusesProperties[0].status && (
        <ApproverDetailWait
          creditData={selectedCredit!!}
          setShowForm={setShowForm}
        />
      )}
      {showForm && selectionCategory === CreditStatusesProperties[3].status && (
        <ApproverDetailDelay
          creditData={selectedCredit!!}
          setShowForm={setShowForm}
        />
      )}
      {showForm && selectionCategory !== CreditStatusesProperties[0].status && selectionCategory !== CreditStatusesProperties[3].status && (
        <ApproverDetailDisburse
          creditData={selectedCredit!!}
          setShowForm={setShowForm}
        />
      )}
    </>
  )
}

export default ApproverCreditSection
