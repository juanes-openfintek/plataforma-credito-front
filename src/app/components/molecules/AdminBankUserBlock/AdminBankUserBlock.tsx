import decryptCryptoData from '../../../helpers/decryptCryptoData'
import formatTypeAccount from '../../../helpers/formatTypeAccount'
import { CreditData } from '../../../interfaces/creditData.interface'
import SimpleFieldInput from '../../atoms/SimpleFieldInput/SimpleFieldInput'

interface AdminBankUserBlockProps {
  creditUserData: CreditData
}

const AdminBankUserBlock = ({
  creditUserData,
}: AdminBankUserBlockProps) => {
  return (
    <>
      <h2 className='text-[1.5625rem] font-semibold my-4 mt-12'>
        Información bancaria para el desembolso
      </h2>
      <div className='grid grid-cols-3 max-lg:grid-cols-1 gap-4 max-lg:gap-2 max-lg:py-6 p-6 bg-light-color-one px-6 lg:px-10 w-full rounded-2xl'>
        <SimpleFieldInput
          value={formatTypeAccount(creditUserData?.account?.accountType) ?? ''}
          type='text'
          label='Tipo de cuenta'
          name='typeAccount'
          readonly
        />
        <SimpleFieldInput
          value={decryptCryptoData(creditUserData?.account?.accountNumber)}
          type='text'
          label='Número de cuenta'
          name='accountNumber'
          readonly
        />
        <SimpleFieldInput
          value={creditUserData?.account?.accountEntity ?? ''}
          type='text'
          label='Banco'
          name='bankName'
          readonly
        />
      </div>
    </>
  )
}

export default AdminBankUserBlock
