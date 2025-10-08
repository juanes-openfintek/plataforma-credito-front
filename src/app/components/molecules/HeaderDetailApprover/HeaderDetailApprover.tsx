import { CreditData } from '../../../interfaces/creditData.interface'
import SquareButton from '../../atoms/SquareButton/SquareButton'
import AdminDetailCreditUserBlock from '../AdminDetailCreditUserBlock/AdminDetailCreditUserBlock'

interface HeaderDetailApproverProps {
  creditData: CreditData
  onHandleClick: () => void
  onHandleApproveClick: () => void
  onHandleRejectClick: () => void
}

const HeaderDetailApprover = ({
  creditData,
  onHandleClick,
  onHandleApproveClick,
  onHandleRejectClick
}: HeaderDetailApproverProps) => {
  return (
    <div className='shadow-lg'>
      <div className='p-[1rem] xl:ml-[300px] xl:mr-[50px] max-lg:pt-14 text-primary-color'>
        <p className='text-[1.25rem] font-bold mb-8 cursor-pointer' onClick={onHandleClick}>
          {'< Créditos por desembolsar'}
        </p>
        <div className='grid grid-cols-3 max-lg:grid-cols-1 gap-6 items-center'>
          <AdminDetailCreditUserBlock creditUserData={creditData} />
          <div className='h-[70px]'>
            <SquareButton text='Aprobar crédito' onClickHandler={onHandleApproveClick} />
          </div>
          <div className='h-[70px]'>
            <SquareButton text='Rechazar crédito' errorFill onClickHandler={onHandleRejectClick} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeaderDetailApprover
