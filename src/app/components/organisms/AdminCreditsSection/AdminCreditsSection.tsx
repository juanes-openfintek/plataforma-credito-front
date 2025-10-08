'use client'
import { useEffect, useState } from 'react'
import AdminCreditsList from '../AdminCreditsList/AdminCreditsList'
import AdminDetailCredit from '../AdminDetailCredit/AdminDetailCredit'
import getAllCredits from '../../../services/getAllCredits'
import { CreditData } from '../../../interfaces/creditData.interface'

const AdminCreditsSection = () => {
  /**
   * creditsList is the list of credits to be displayed
   */
  const [creditsList, setCreditsList] = useState<CreditData[]>([])
  /**
   * selectedCredit is the credit to be displayed in the form
   */
  const [selectedCredit, setSelectedCredit] = useState<CreditData>()
  /**
   * showForm is the state to show or hide the form
   */
  const [showForm, setShowForm] = useState<boolean>(false)
  /**
   * perPage is the number of credits to be displayed
   */
  const perPage = 10
  /**
   * page is the page to be displayed
   */
  const [page, setPage] = useState<number>(1)
  /**
   * formik is the formik object to manage the filter form
   */
  /**
   * handleShowForm is the function to show the form
   * @param id is the id of the credit to be displayed
   */
  const handleShowForm = (id: number) => {
    const selectedCredit = creditsList.find((credit) => credit.code === id)
    if (selectedCredit) {
      setSelectedCredit(selectedCredit)
      setShowForm(true)
    }
  }
  /**
   * fetchCredits is the function to fetch the credits list
   */
  useEffect(() => {
    if (!showForm) {
      const fetchCredits = async () => {
        setCreditsList(await getAllCredits())
      }
      fetchCredits()
    }
  }, [showForm])

  return (
    <>
      {!showForm && (
        <AdminCreditsList
          creditsList={creditsList}
          handleShowForm={handleShowForm}
          page={page}
          perPage={perPage}
          setPage={setPage}
        />
      )}
      {showForm && (
        <AdminDetailCredit
          selectedCredit={selectedCredit!!}
          setShowForm={setShowForm}
        />
      )}
    </>
  )
}

export default AdminCreditsSection
