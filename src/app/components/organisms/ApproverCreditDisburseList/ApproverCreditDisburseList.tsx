import { checkID, checkName } from '../../../helpers/checkFilters'
import { CreditData } from '../../../interfaces/creditData.interface'
import ApproverCreditDisburseBlock from '../../molecules/ApproverCreditDisburseBlock/ApproverCreditDisburseBlock'

interface ApproverCreditDisburseListProps {
  creditsList: CreditData[]
  formik: any
  page: number
  perPage: number
  handleShowForm: (id: number) => void
}

const ApproverCreditDisburseList = ({
  creditsList,
  formik,
  page,
  perPage,
  handleShowForm,
}: ApproverCreditDisburseListProps) => {
  return (
    <div className='bg-light-color-one rounded-2xl px-6 py-6 mt-8'>
      <div className='grid grid-cols-7 max-lg:grid-cols-3 text-center font-bold text-[1.125rem]'>
        <h3 className='max-lg:hidden'>ID solicitud</h3>
        <h3>Cliente</h3>
        <h3>Fecha de aprobación</h3>
        <h3 className='max-lg:hidden'>Fecha ideal desembolso</h3>
        <h3 className='max-lg:hidden'>Cantidad a desembolsar</h3>
        <h3 className='max-lg:hidden'>Banco</h3>
        <h3>Ver</h3>
      </div>
      {creditsList
        .filter((credit) => checkName(credit, formik.values.filterId))
        .filter((credit) => checkID(credit, formik.values.filterId))
        .slice((page - 1) * perPage, page * perPage)
        .map((credit, index) => {
          if (!credit) {
            return null
          }
          return (
            <ApproverCreditDisburseBlock
              key={`${credit.code}-${index}`}
              handleShowForm={handleShowForm}
              creditData={credit}
            />
          )
        })}
      {creditsList
        .filter((credit) => checkName(credit, formik.values.filterId))
        .filter((credit) => checkID(credit, formik.values.filterId)).length <
        1 && (
          <h3 className='text-[2rem] font-bold text-center my-10'>
            No hay créditos por mostrar
          </h3>
      )}
    </div>
  )
}

export default ApproverCreditDisburseList
