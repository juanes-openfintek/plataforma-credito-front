import { checkID, checkName, checkStatus } from '../../../helpers/checkFilters'
import { CreditData } from '../../../interfaces/creditData.interface'
import ApproverCreditBlock from '../../molecules/ApproverCreditBlock/ApproverCreditBlock'

interface ApproverCreditListProps {
  creditsList: CreditData[]
  formik: any
  page: number
  perPage: number
}

const ApproverOverallCreditList = ({ creditsList, formik, page, perPage }: ApproverCreditListProps) => {
  return (
    <div className='bg-light-color-one rounded-2xl px-6 py-12 mt-8 '>
      <div className='grid grid-cols-6 max-lg:grid-cols-3 text-center font-bold text-[1.125rem]'>
        <h3>ID solicitud</h3>
        <h3>Cliente</h3>
        <h3>Estado</h3>
        <h3 className='max-lg:hidden'>Fecha de solicitud</h3>
        <h3 className='max-lg:hidden'>Cantidad</h3>
        <h3 className='max-lg:hidden'>Banco</h3>
      </div>
      {creditsList
        .filter((credit) => checkStatus(credit, formik.values.filterStatus))
        .filter((credit) => checkName(credit, formik.values.filterId))
        .filter((credit) => checkID(credit, formik.values.filterId))
        .slice((page - 1) * perPage, page * perPage)
        .map((credit, index) => {
          if (!credit) {
            return null
          }
          return (
            <ApproverCreditBlock
              key={`${credit.code}-${index}`}
              creditData={credit}
            />
          )
        })}
    </div>
  )
}

export default ApproverOverallCreditList
