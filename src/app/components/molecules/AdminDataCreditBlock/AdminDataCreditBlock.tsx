// import formatDateAdmin from '../../../helpers/formatDateAdmin'
import { CreditData } from '../../../interfaces/creditData.interface'

interface AdminDataCreditBlockProps {
  creditUserData: CreditData
}

const AdminDataCreditBlock = ({
  creditUserData,
}: AdminDataCreditBlockProps) => {
  return (
    // TODO: Temporal de-activated for second development phase
    <>
      {/* <h2 className='text-[1.5625rem] font-semibold my-4 mt-12'>
        Información de data crédito
      </h2>
      <div className='flex flex-row max-lg:flex-col justify-between bg-light-color-one px-16 py-4 rounded-2xl items-center'>
        <div className='flex flex-col font-semibold max-lg:items-center'>
          <h3 className='text-[1.875rem] max-lg:text-[1.5rem]'>{`${creditUserData?.name} ${creditUserData?.lastname}`}</h3>
          <p className='text-[1.25rem] font-poppins text-black'>{`${creditUserData?.documentType} ${creditUserData?.documentNumber}`}</p>
        </div>
        <p className='font-poppins text-black max-lg:mt-8'>
          Consulta realizada{' '}
          <strong>{formatDateAdmin(new Date().toString(), 'admin')}</strong>
        </p>
        <div className='flex flex-col font-poppins text-black max-lg:items-center max-lg:mt-8'>
          <p className='font-semibold text-right'>Puntaje</p>
          <p className='font-semibold text-[1.25rem]'>
            <span className='text-primary-color font-bold text-[3.75rem]'>
              800
            </span>
            /950
          </p>
        </div>
      </div> */}
    </>
  )
}

export default AdminDataCreditBlock
