import { useFormik } from 'formik'
import { CreditStatusesProperties } from '../../../constants/CreditStatusesProperties'
import AdminCreditBlock from '../../molecules/AdminCreditBlock/AdminCreditBlock'
import WelcomeMessage from '../../atoms/WelcomeMessage/WelcomeMessage'
import { CreditData } from '../../../interfaces/creditData.interface'
import Paginator from '../../molecules/Paginator/Paginator'
import { checkName, checkStatus } from '../../../helpers/checkFilters'
import { useEffect } from 'react'

interface AdminCreditsListProps {
  creditsList: CreditData[]
  handleShowForm: (id: number) => void
  page: number
  perPage: number
  setPage: (page: number) => void
}

const AdminCreditsList = ({
  creditsList,
  handleShowForm,
  page,
  perPage,
  setPage,
}: AdminCreditsListProps) => {
  const formik = useFormik({
    initialValues: {
      filterStatus: 'Filtrar',
      filterName: '',
    },
    onSubmit: (values) => {},
  })

  /**
   * useEffect to reset the page when the filters change
   */
  useEffect(() => {
    setPage(1)
  }, [formik.values.filterStatus, formik.values.filterName])

  return (
    <>
      <WelcomeMessage />
      <div className='flex flex-row max-md:flex-col justify-between my-10 h-[75px] text-[1.25rem]'>
        <select
          className='border-primary-color border-[1px] p-2 rounded-lg w-[300px] max-md:w-full'
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
        <div className='relative'>
          <input
            type='text'
            name='filterName'
            placeholder='Buscar por nombre'
            value={formik.values.filterName}
            onChange={formik.handleChange}
            className='border-primary-color border-[1px] p-2 rounded-lg pl-10 h-full w-[300px] max-md:w-full max-md:mt-4'
          />
          <span className='icon-search p-[1px] absolute left-4 top-[28px] max-md:top-[35px]' />
        </div>
      </div>
      <>
        <div className='bg-light-color-one rounded-2xl px-6 py-6 max-md:mt-16'>
          <div className='grid grid-cols-8 max-lg:grid-cols-3 text-center font-bold text-[1.125rem]'>
            <h3 className='max-lg:hidden'>ID solicitud</h3>
            <h3>Cliente</h3>
            <h3>Estado</h3>
            <h3 className='col-span-2 max-lg:hidden'>Fecha de solicitud</h3>
            <h3 className='max-lg:hidden'>Cantidad</h3>
            <h3 className='max-lg:hidden'>Banco</h3>
            <h3>Acción</h3>
          </div>
          {creditsList
            .filter((credit) => checkStatus(credit, formik.values.filterStatus))
            .filter((credit) => checkName(credit, formik.values.filterName))
            .slice((page - 1) * perPage, page * perPage)
            .map((credit, index) => {
              if (!credit) {
                return null
              }
              return (
                <AdminCreditBlock
                  key={`${credit.code}-${index}`}
                  handleShowForm={handleShowForm}
                  creditData={credit}
                />
              )
            })}
        </div>
        {creditsList
          .filter((credit) => checkStatus(credit, formik.values.filterStatus))
          .filter((credit) => checkName(credit, formik.values.filterName))
          .length < 1 && (
            <h3 className='text-[2rem] font-bold text-center my-10'>
              No hay créditos por mostrar
            </h3>
        )}
        <Paginator
          total={
            creditsList
              .filter((credit) =>
                checkStatus(credit, formik.values.filterStatus)
              )
              .filter((credit) => checkName(credit, formik.values.filterName))
              .length
          }
          page={page}
          perPage={perPage}
          onChange={(page) => setPage(page)}
        />
      </>
    </>
  )
}

export default AdminCreditsList
