import { Taxes } from '../../../interfaces/taxes.interface'

/**
 * Props for the AdminTaxesBlockProps component
 * @interface
 */
interface AdminTaxesBlockProps {
  tax: Taxes
  position: number
  setSelectedTax: (tax: any) => void
}

const AdminTaxesBlock = ({
  tax,
  position,
  setSelectedTax,
}: AdminTaxesBlockProps) => {
  const { minAmount, maxAmount, emPercentage, eaPercentage, interestPercentage, insurancePercentage, administrationPercentage, ivaPercentage } = tax;
  return (
    <div className='grid grid-cols-8 max-lg:grid-cols-3 items-center py-3 text-center border-b-2 border-black text-black'>
      <p>{`${minAmount} - ${maxAmount}`}</p>
      <p>{emPercentage + '%'}</p>
      <p className='max-lg:hidden'>{eaPercentage + '%'}</p>
      <p className='max-lg:hidden'>{interestPercentage + '%'}</p>
      <p className='max-lg:hidden'>{ivaPercentage + '%'}</p>
      <p className='max-lg:hidden'>{insurancePercentage + '%'}</p>
      <p className='max-lg:hidden'>{administrationPercentage + '%'}</p>
      <span className='icon-eye text-accent-color m-auto cursor-pointer' onClick={() => setSelectedTax(position)} />
    </div>
  )
}

export default AdminTaxesBlock
