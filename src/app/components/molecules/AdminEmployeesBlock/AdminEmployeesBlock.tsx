import formatDateAdmin from '../../../helpers/formatDateAdmin'
import formatRole from '../../../helpers/formatRole'
import { Employee } from '../../../interfaces/employee.interface'

/**
 * Props for the AdminEmployeesBlock component
 * @interface
 */
interface AdminEmployeesBlockProps {
  employees: Employee
  setShowForm: (value: string) => void
}

const AdminEmployeesBlock = ({
  employees,
  setShowForm
}: AdminEmployeesBlockProps) => {
  return (
    <div className='grid grid-cols-5 max-lg:grid-cols-3 items-center py-3 text-center border-b-2 border-black text-black'>
      <p>{`${employees.name} ${employees.lastname}`}</p>
      <p className='max-lg:hidden overflow-hidden text-ellipsis'>{employees.email}</p>
      <p>{formatRole(employees.roles[0])}</p>
      <p className='text-[0.90rem] max-lg:hidden'>{formatDateAdmin(employees.createdAt, 'admin')}</p>
      <span className='icon-eye text-primary-color m-auto cursor-pointer' onClick={() => setShowForm(employees._id)} />
    </div>
  )
}

export default AdminEmployeesBlock
