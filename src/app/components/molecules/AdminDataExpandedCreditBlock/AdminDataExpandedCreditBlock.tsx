import { convertNumberToCurrency } from '../../../helpers/calculationsHelpers'
import formatDateAdmin from '../../../helpers/formatDateAdmin'
import { CreditData } from '../../../interfaces/creditData.interface'
import SimpleFieldInput from '../../atoms/SimpleFieldInput/SimpleFieldInput'

interface AdminDataExpandedCreditBlockProps {
  dataCredit: CreditData
  title: string
}

const AdminDataExpandedCreditBlock = ({
  dataCredit,
  title
}: AdminDataExpandedCreditBlockProps) => {
  return (
    <>
      <h2 className='text-[1.5625rem] font-semibold my-4 mt-12'>
        {title}
      </h2>
      <div className='grid grid-cols-3 max-lg:grid-cols-1 gap-4 max-lg:gap-2 max-lg:py-6 p-6 bg-light-color-one px-6 lg:px-10 w-full rounded-2xl'>
        <SimpleFieldInput
          value={convertNumberToCurrency(dataCredit?.amount)}
          type='text'
          label='Monto'
          name='MontoField'
          readonly
          alternativeText
        />
        <SimpleFieldInput
          value={dataCredit?.name}
          type='text'
          label='Nombres'
          name='NameField'
          readonly
        />
        <SimpleFieldInput
          value={dataCredit?.lastname}
          type='text'
          label='Apellidos'
          name='LastNameField'
          readonly
        />
        <SimpleFieldInput
          value={`${dataCredit?.quotasNumber} ${dataCredit?.quotasNumber === 1 ? 'mes' : 'meses'}`}
          type='text'
          label='Diferido a'
          name='DefferedField'
          readonly
        />
        <SimpleFieldInput
          value={formatDateAdmin(dataCredit?.maxDate, 'onlyDate')}
          type='text'
          label='Fecha máxima de respuesta'
          name='DateField'
          readonly
        />
        <SimpleFieldInput
          value={dataCredit?.taxes?.rateDefault.toString() + '%'}
          type='text'
          label='Interés aplicado'
          name='taxField'
          readonly
        />
      </div>
    </>
  )
}

export default AdminDataExpandedCreditBlock
