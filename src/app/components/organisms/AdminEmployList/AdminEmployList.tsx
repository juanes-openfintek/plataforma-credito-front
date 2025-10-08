import { useFormik } from 'formik'
import SquareButton from '../../atoms/SquareButton/SquareButton'
import AdminEmployeesBlock from '../../molecules/AdminEmployeesBlock/AdminEmployeesBlock'
import { Roles } from '../../../constants/Roles'
import { Employee } from '../../../interfaces/employee.interface'
import Paginator from '../../molecules/Paginator/Paginator'
import { checkName, checkRole } from '../../../helpers/checkFilters'
import { useEffect } from 'react'

interface AdminEmployListProps {
  employees: Employee[]
  page: number
  perPage: number
  setPage: (page: number) => void
  setShowForm: (value?: string) => void
}

const AdminEmployList = ({
  employees,
  setShowForm,
  page,
  perPage,
  setPage,
}: AdminEmployListProps) => {
  /**
   * formik is the formik object to manage the filter form
   */
  const formik = useFormik({
    initialValues: {
      filterRole: 'Filtrar',
      filterName: '',
    },
    onSubmit: (values) => {},
  })
  /**
   * useEffect to reset the page when the filters change
   */
  useEffect(() => {
    setPage(1)
  }, [formik.values.filterRole, formik.values.filterName])
  return (
    <>
      <div className='flex flex-row max-md:flex-col h-[75px] text-[1.25rem] justify-end'>
        <div className='relative md:mr-8'>
          <input
            type='text'
            name='filterName'
            placeholder='Buscar por nombre'
            value={formik.values.filterName}
            onChange={formik.handleChange}
            className='border-primary-color border-[1px] w-full p-2 rounded-lg pl-10 h-full w-[300px] max-md:w-full'
          />
          <span className='icon-search p-[1px] absolute left-4 top-[28px] max-md:top-1/4' />
        </div>
        <select
          className='border-primary-color border-[1px] p-2 max-md:mt-4 rounded-lg w-[300px] max-md:w-full'
          name='filterRole'
          value={formik.values.filterRole}
          onChange={formik.handleChange}
        >
          <option>Filtrar</option>
          {Roles?.map((option, index) => (
            <option key={`${option}-${index}`} value={option.id}>
              {option.text}
            </option>
          ))}
        </select>
      </div>
      <h3 className='font-semibold text-[1.5625rem]'>Control</h3>
      <div className='my-10 md:w-[270px] h-[75px] text-[1.25rem]'>
        <SquareButton
          text='Nuevo empleado'
          withIcon
          onClickHandler={() => setShowForm()}
        />
      </div>

      <div className='bg-light-color-one rounded-2xl px-6 py-6 '>
        <div className='grid grid-cols-5 max-lg:grid-cols-3 text-center font-bold text-[1.125rem]'>
          <h3>Nombre</h3>
          <h3 className='max-lg:hidden'>Correo electrónico</h3>
          <h3>Rol</h3>
          <h3 className='max-lg:hidden'>Fecha de creación</h3>
          <h3>Editar</h3>
        </div>
        {employees
          .filter((employe) => checkRole(employe, formik.values.filterRole))
          .filter((employe) => checkName(employe, formik.values.filterName))
          .slice((page - 1) * perPage, page * perPage)
          .map((employe, index) =>
            employe ? (
              <AdminEmployeesBlock
                key={`${employe?._id}-${index}`}
                employees={employe}
                setShowForm={setShowForm}
              />
            ) : null
          )}
      </div>
      {employees
        .filter((employe) => checkRole(employe, formik.values.filterRole))
        .filter((employe) => checkName(employe, formik.values.filterName))
        .length < 1 && (
          <h3 className='text-[2rem] font-bold text-center my-10'>
            No hay usuarios por mostrar
          </h3>
      )}
      <Paginator
        total={
          employees
            .filter((employe) => checkRole(employe, formik.values.filterRole))
            .filter((employe) => checkName(employe, formik.values.filterName))
            .length
        }
        page={page}
        perPage={perPage}
        onChange={(page) => setPage(page)}
      />
    </>
  )
}

export default AdminEmployList
