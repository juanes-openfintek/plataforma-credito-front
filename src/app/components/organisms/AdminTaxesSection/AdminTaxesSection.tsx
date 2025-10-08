'use client'
import { useEffect, useState } from 'react'
import AdminDetailTax from '../AdminDetailTax.tsx/AdminDetailTax'
import { Taxes } from '../../../interfaces/taxes.interface'
import AdminTaxesList from '../AdminTaxesList/AdminTaxesList'
import getTaxes from '../../../services/getTaxes'

const AdminTaxesSection = () => {
  /**
   * Component for displaying and editing tax details in the admin panel.
   */
  const [selectedTax, setSelectedTax] = useState<Taxes | null>(null)
  /**
   * An array of objects containing information for tax details.
   */
  const [taxes, setTaxes] = useState<Taxes[]>([])
  /**
   * A boolean that shows or hides the form.
   */
  const [showForm, setShowForm] = useState<boolean>(false)
  /**
   * perPage is the number of items to be displayed per page
   */
  const perPage = 10
  /**
   * page is the page to be displayed
   */
  const [page, setPage] = useState<number>(1)
  /**
   * Function to handle the display of the form.
   * @param {number} id - The id of the tax.
   */
  const handleShowForm = (id?: number) => {
    if (id !== undefined && id >= 0) {
      setSelectedTax(taxes[((page - 1) * perPage) + id])
    } else {
      setSelectedTax(null)
    }
    setShowForm(true)
  }
  /**
   * useEffect hook to fetch the taxes.
   */
  useEffect(() => {
    if (!showForm) {
      const fetchTaxes = async () => {
        setTaxes(await getTaxes())
      }
      fetchTaxes()
    }
  }, [showForm])

  return (
    <>
      {!showForm && (
        <AdminTaxesList
          taxes={taxes}
          handleShowForm={handleShowForm}
          page={page}
          perPage={perPage}
          setPage={setPage}
        />
      )}
      {showForm && (
        <AdminDetailTax tax={selectedTax} setShowForm={setShowForm} taxesList={taxes} />
      )}
    </>
  )
}

export default AdminTaxesSection
