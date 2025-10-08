import { convertNumberToCurrency } from '../../../helpers/calculationsHelpers'
import formatDateAdmin from '../../../helpers/formatDateAdmin'
import { CreditData } from '../../../interfaces/creditData.interface'
import SimpleFieldInput from '../../atoms/SimpleFieldInput/SimpleFieldInput'

interface AdminUserMinimalCreditBlockProps {
  creditUserData: CreditData
}

const AdminUserMinimalCreditBlock = ({
  creditUserData,
}: AdminUserMinimalCreditBlockProps) => {
  return (
    <>
      <h2 className='text-[1.5625rem] font-semibold my-4 mt-12'>
        Información del crédito
      </h2>
      <div className='grid grid-cols-3 max-lg:grid-cols-1 gap-4 max-lg:gap-2 max-lg:py-6 p-6 bg-light-color-one px-6 lg:px-10 w-full rounded-2xl'>
        <SimpleFieldInput
          value={convertNumberToCurrency(Number(creditUserData?.amount))}
          type='text'
          label='Monto'
          name='Amount'
          readonly
          alternativeText
        />
        <SimpleFieldInput
          value={`${creditUserData?.quotasNumber} ${creditUserData?.quotasNumber === 1 ? 'mes' : 'meses'}`}
          type='text'
          label='Plazo'
          name='QuotasNumber'
          readonly
        />
        <SimpleFieldInput
          value={formatDateAdmin(creditUserData?.updatedAt, 'onlyDate')}
          type='text'
          label='Fecha de aprobación'
          name='DisburseDate'
          readonly
        />
      </div>
    </>
  )
}

export default AdminUserMinimalCreditBlock
