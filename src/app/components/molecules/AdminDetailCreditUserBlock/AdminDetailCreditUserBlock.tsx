import { convertNumberToCurrency } from '../../../helpers/calculationsHelpers'
import formatDateAdmin from '../../../helpers/formatDateAdmin'
import { CreditData } from '../../../interfaces/creditData.interface'

interface AdminDetailCreditUserBlockProps {
  creditUserData: CreditData
  withReference?: boolean
}

const AdminDetailCreditUserBlock = ({
  creditUserData,
  withReference,
}: AdminDetailCreditUserBlockProps) => {
  return (
    <div className='rounded-xl border-primary-color border-2 flex flex-row justify-between px-8 py-2'>
      <div className='flex flex-col'>
        <h3 className='text-[1.5625rem] font-bold'>{`${creditUserData?.name} ${creditUserData?.lastname}`}</h3>
        <p className='text-[1.25rem] font-semibold'>{`${convertNumberToCurrency(
          creditUserData?.amount
        )} COP`}
        </p>
        <p className='font-semibold'>{`${creditUserData?.quotasNumber} ${creditUserData?.quotasNumber === 1 ? 'mes' : 'meses'}`}</p>
      </div>
      {withReference && (
        <div className='text-center my-auto font-semibold'>
          <p className='text-[1.25rem]'>Referencia de pago</p>
          <p>#{creditUserData.code}</p>
        </div>
      )}
      <div className='flex flex-col font-bold justify-center'>
        <p>{formatDateAdmin(creditUserData?.created, 'onlyDate')}</p>
        <p>{formatDateAdmin(creditUserData?.created, 'onlyHours')}</p>
      </div>
    </div>
  )
}

export default AdminDetailCreditUserBlock
