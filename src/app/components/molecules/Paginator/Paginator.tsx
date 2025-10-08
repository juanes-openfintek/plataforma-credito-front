'use client'
import { useFormik } from 'formik'
import { useEffect } from 'react'

interface PaginatorProps {
  total: number
  page: number
  perPage: number
  onChange: (page: number) => void
}

const Paginator = ({
  total = 0,
  page,
  perPage = 1,
  onChange,
}: PaginatorProps) => {
  /**
   * This constant is used to store the pages array
   */
  const pages: number[] = []

  /**
   * This function is used to create the pages array
   * @param total - This parameter is used to know the total number of notifications
   * @param perPage - This parameter is used to know the number of notifications per page
   * @returns - This function returns the pages array
   */
  const constructorPages = (total: number, perPage: number) => {
    for (let i = 0; i < Math.ceil(total / perPage); i++) {
      pages.push(i + 1)
    }
    return pages
  }
  constructorPages(total, perPage)

  /**
   * This formik is used to store the page in which the user is located
   */
  const formik = useFormik({
    initialValues: {
      pageSelector: page || 1,
    },
    onSubmit: () => {},
  })
  /**
   * This useEffect is used to set the page in which the user is located
   */
  useEffect(() => {
    formik.setFieldValue('pageSelector', page)
  }, [page])
  /**
   * This function is used to change the page of the notifications array
   */
  useEffect(() => {
    onChange(formik.values.pageSelector)
  }, [formik.values.pageSelector])
  /**
   * This function is used to go to the last page
   */
  const toLastPage = () => {
    formik.setFieldValue('pageSelector', pages.length)
  }
  /**
   * This function is used to go to the first page
   */
  const toFirstPage = () => {
    formik.setFieldValue('pageSelector', 1)
  }
  /**
   * This function is used to go to the next page
   */
  const toNextPage = () => {
    if (formik.values.pageSelector < pages.length) {
      formik.setFieldValue('pageSelector', formik.values.pageSelector + 1)
    }
  }
  /**
   * This function is used to go to the previous page
   */
  const toPreviousPage = () => {
    if (formik.values.pageSelector > 1) {
      formik.setFieldValue('pageSelector', formik.values.pageSelector - 1)
    }
  }

  return (
    <div className='flex flex-row gap-2 font-bold justify-end'>
      <div className='px-2 py-1 mx-2 my-1 cursor-pointer max-md:text-[0.75rem]'>
        <select
          name='pageSelector'
          value={formik.values.pageSelector}
          id='pageSelector'
          onChange={formik.handleChange}
        >
          {pages.map((page, index) => (
            <option key={index} value={page}>
              {page}
            </option>
          ))}
        </select>

        <p className='inline-block ml-2'> de {pages.length} páginas</p>
      </div>
      <div
        className='px-2 py-1 mx-2 my-1 cursor-pointer'
        onClick={() => toFirstPage()}
      >
        {'<<'}
      </div>
      <div
        className='px-2 py-1 mx-2 my-1 cursor-pointer'
        onClick={() => toPreviousPage()}
      >
        {'<'}
      </div>
      <div
        className='px-2 py-1 mx-2 my-1 cursor-pointer'
        onClick={() => toNextPage()}
      >
        {'>'}
      </div>
      <div
        className='px-2 py-1 mx-2 my-1 cursor-pointer'
        onClick={() => toLastPage()}
      >
        {'>>'}
      </div>
    </div>
  )
}

export default Paginator
