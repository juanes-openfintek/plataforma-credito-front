'use client'
import { useEffect, useState } from 'react'
import AdminEmployList from '../AdminEmployList/AdminEmployList'
import AdminDetailEmploy from '../AdminDetailEmploy/AdminDetailEmploy'
import getUsersAdmin from '../../../services/getUsersAdmin'
import { Employee } from '../../../interfaces/employee.interface'

const AdminEmploySection = () => {
  /**
   * This state is used to store the employees that will be displayed on the page
   */
  const [employees, setEmployees] = useState<Employee[]>([])
  /**
   * nameUser is the name of the user in session
   */
  const [selectedUser, setSelectedUser] = useState<Employee | null>(null)
  /**
   * This function is used to change the page of the notifications array
   */
  const [showForm, setShowForm] = useState<boolean>(false)
  /**
   * This constant is used to set the number of notifications that will be displayed on the page
   */
  const perPage = 10
  /**
   * page is the page to be displayed
   */
  const [page, setPage] = useState<number>(1)
  /**
   * This function is used to change the page of the notifications array
   * @param id - This parameter is used to change the page of the notifications array
   */
  const handleShowForm = (id?: string) => {
    const employeer = employees.find((employee) => employee._id === id)
    if (employeer) {
      setSelectedUser(employeer)
    } else {
      setSelectedUser(null)
    }
    setShowForm(true)
  }
  /**
   * This function is used to change the page of the notifications array
   */
  useEffect(() => {
    const fetchEmployees = async () => {
      const employees = await getUsersAdmin()
      setEmployees(employees.filter((employee: Employee) => employee.isActive))
    }
    fetchEmployees()
  }, [showForm])

  return (
    <>
      {!showForm && (
        <AdminEmployList
          employees={employees}
          setShowForm={handleShowForm}
          page={page}
          perPage={perPage}
          setPage={setPage}
        />
      )}
      {showForm && (
        <AdminDetailEmploy setShowForm={setShowForm} userData={selectedUser} />
      )}
    </>
  )
}

export default AdminEmploySection
