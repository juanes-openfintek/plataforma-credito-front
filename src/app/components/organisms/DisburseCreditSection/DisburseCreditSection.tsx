'use client'
import { useEffect, useState } from 'react'
import getAllCredits from '../../../services/getAllCredits'
import { CreditData } from '../../../interfaces/creditData.interface'
import { useFormik } from 'formik'
import { CreditStatusesProperties } from '../../../constants/CreditStatusesProperties'
import WelcomeMessage from '../../atoms/WelcomeMessage/WelcomeMessage'
import DisburseCreditListSixCol from '../DisburseCreditListSixCol/DisburseCreditListSixCol'
import Paginator from '../../molecules/Paginator/Paginator'
import { checkID, checkName } from '../../../helpers/checkFilters'
import DisburseCreditListSevenCol from '../DisburseCreditListSevenCol/DisburseCreditListSevenCol'
import DisburserDetailToDisburse from '../DisburserDetailToDisburse/DisburserDetailToDisburse'
import DisburseDetailValidated from '../DisburseDetailValidated/DisburseDetailValidated'
import DisburseDetailPromissoryPendient from '../DisburseDetailPromissoryPendient/DisburseDetailPromissoryPendient'
import DisburseDetailPromissorySigned from '../DisburseDetailPromissorySigned/DisburseDetailPromissorySigned'
import DisburseDetailConfirm from '../DisburseDetailConfirm/DisburseDetailConfirm'

const DisburseCreditSection = () => {
  /**
   * perPage is the number of credits to be displayed
   */
  const perPage = 10
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
  const [selectionCategory, setSelectionCategory] = useState<string>(CreditStatusesProperties[1].status)
  /**
   * formik is the formik object to manage the filter form
   */
  const formik = useFormik({
    initialValues: {
      filterName: '',
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
   * handleShowForm is the function to show the form
   * @param id is the id of the credit to be displayed
   */
  const handleShowForm = (id: number) => {
    setSelectedCredit(creditsList.find((credit) => credit.code === id))
    setShowForm(true)
  }

  /**
   * fetchCredits is the function to fetch the credits list
   */
  useEffect(() => {
    const fetchCredits = async () => {
      setCreditsList(await getAllCredits(selectionCategory))
    }
    if (selectionCategory && !showForm) {
      setCreditsList([])
      fetchCredits()
    }
  }, [selectionCategory, showForm])
  /**
   * useEffect to reset the page when the filters change
   */
  useEffect(() => {
    setPage(1)
  }, [formik.values.filterName])
  return (
    <>
      {!showForm && (
        <section className='p-[1rem] xl:ml-[300px] xl:mr-[50px] max-lg:pt-14 text-primary-color'>
          <div className='flex flex-row max-md:flex-col justify-between'>
            <WelcomeMessage />
            <div className='flex flex-row max-md:flex-col max-md:w-full justify-between my-10 md:h-[75px] text-[1.25rem]'>
              <div className='relative max-md:w-full'>
                <input
                  type='text'
                  name='filterName'
                  placeholder='Buscar por ID o nombre'
                  value={formik.values.filterName}
                  onChange={formik.handleChange}
                  className='border-primary-color border-[1px] p-2 rounded-lg pl-10 h-full w-[300px] max-md:w-full'
                />
                <span className='icon-search p-[1px] absolute left-4 top-[28px] max-md:top-1/4' />
              </div>
            </div>
          </div>
          <h2 className='font-semibold text-[1.5625rem] mr-4'>Créditos</h2>
          <div className='flex flex-row max-md:flex-col py-2 border-b-2 border-primary-color font-semibold text-[1.5625rem]'>
            <p
              className={`md:border-r-2 border-primary-color pr-4 max-md:px-4 cursor-pointer ${
                selectionCategory === CreditStatusesProperties[1].status ? '' : 'text-light-color-two'
              }`}
              onClick={() => setSelectionCategory(CreditStatusesProperties[1].status)}
            >
              Créditos aprobados
            </p>
            <p
              className={`md:border-r-2 border-primary-color px-4 cursor-pointer ${
                selectionCategory === CreditStatusesProperties[4].status ? '' : 'text-light-color-two'
              }`}
              onClick={() => setSelectionCategory(CreditStatusesProperties[4].status)}
            >
              Créditos validados
            </p>
            <p
              className={`md:border-r-2 border-primary-color px-4 cursor-pointer ${
                selectionCategory === CreditStatusesProperties[5].status
                  ? ''
                  : 'text-light-color-two'
              }`}
              onClick={() => setSelectionCategory(CreditStatusesProperties[5].status)}
            >
              Pendiente por pagaré
            </p>
            <p
              className={`md:border-r-2 border-primary-color px-4 cursor-pointer ${
                selectionCategory === CreditStatusesProperties[6].status
                  ? ''
                  : 'text-light-color-two'
              }`}
              onClick={() => setSelectionCategory(CreditStatusesProperties[6].status)}
            >
              Pagaré firmado
            </p>
            <p
              className={`px-4 cursor-pointer ${
                selectionCategory === CreditStatusesProperties[7].status
                  ? ''
                  : 'text-light-color-two'
              }`}
              onClick={() => setSelectionCategory(CreditStatusesProperties[7].status)}
            >
              Listos para desembolso
            </p>
          </div>
          {selectionCategory === CreditStatusesProperties[1].status && (
            <DisburseCreditListSixCol
              creditsList={creditsList}
              formik={formik}
              page={page}
              perPage={perPage}
              actionLabel='Desembolsar'
              handleShowForm={handleShowForm}
            />
          )}
          {selectionCategory === CreditStatusesProperties[4].status && (
            <DisburseCreditListSixCol
              creditsList={creditsList}
              formik={formik}
              page={page}
              perPage={perPage}
              actionLabel='Generar crédito'
              handleShowForm={handleShowForm}
            />
          )}
          {selectionCategory === CreditStatusesProperties[5].status && (
            <DisburseCreditListSevenCol
              creditsList={creditsList}
              formik={formik}
              page={page}
              perPage={perPage}
              actionLabel='Generar pagaré'
              handleShowForm={handleShowForm}
            />
          )}
          {selectionCategory === CreditStatusesProperties[6].status && (
            <DisburseCreditListSevenCol
              creditsList={creditsList}
              formik={formik}
              page={page}
              perPage={perPage}
              actionLabel='Ver pagaré'
              handleShowForm={handleShowForm}
            />
          )}
          {selectionCategory === CreditStatusesProperties[7].status && (
            <DisburseCreditListSevenCol
              creditsList={creditsList}
              formik={formik}
              page={page}
              perPage={perPage}
              actionLabel='Editar'
              handleShowForm={handleShowForm}
            />
          )}
          {selectionCategory && (
            <Paginator
              total={
                creditsList
                  .filter((credit) => checkID(credit, formik.values.filterName))
                  .filter((credit) =>
                    checkName(credit, formik.values.filterName)
                  ).length
              }
              page={page}
              perPage={perPage}
              onChange={(page) => setPage(page)}
            />
          )}
        </section>
      )}
      {showForm && selectionCategory === CreditStatusesProperties[1].status && (
        <DisburserDetailToDisburse
          creditData={selectedCredit!!}
          setShowForm={setShowForm}
        />
      )}
      {showForm && selectionCategory === CreditStatusesProperties[4].status && (
        <DisburseDetailValidated
          creditData={selectedCredit!!}
          setShowForm={setShowForm}
        />
      )}
      {showForm && selectionCategory === CreditStatusesProperties[5].status && (
        <DisburseDetailPromissoryPendient
          creditData={selectedCredit!!}
          setShowForm={setShowForm}
        />
      )}
      {showForm && selectionCategory === CreditStatusesProperties[6].status && (
        <DisburseDetailPromissorySigned
          creditData={selectedCredit!!}
          setShowForm={setShowForm}
        />
      )}
      {showForm && selectionCategory === CreditStatusesProperties[7].status && (
        <DisburseDetailConfirm
          creditData={selectedCredit!!}
          setShowForm={setShowForm}
        />
      )}
    </>
  )
}

export default DisburseCreditSection
