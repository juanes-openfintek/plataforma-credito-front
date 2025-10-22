import NextImage from '../../atoms/NextImage/NextImage'
import SimpleFieldInput from '../../atoms/SimpleFieldInput/SimpleFieldInput'
import { CreditStatusesProperties } from '../../../constants/CreditStatusesProperties'
import { CreditData } from '../../../interfaces/creditData.interface'
import formatDateAdmin from '../../../helpers/formatDateAdmin'
import { convertNumberToCurrency } from '../../../helpers/calculationsHelpers'

interface CreditStatusProps {
  dataCredit: CreditData
}
/**
 * CreditStatus is a component that renders the status of a credit
 * @param {any} dataCredit - The data of the credit
 * @example <CreditStatus dataCredit={dataCredit} />
 * @returns The CreditStatus component
 */
const CreditStatus = ({ dataCredit }: CreditStatusProps) => {
  const statusProperties = CreditStatusesProperties.find(
    (property) => property.status === dataCredit.status
  )

  return (
    <div className='w-full bg-light-color-one rounded-3xl mb-12'>
      <div
        className={`flex flex-row text-black p-[1rem] items-center rounded-3xl ${statusProperties?.background}`}
      >
        <NextImage
          className='mx-4 h-[38px] w-[38px]'
          src={statusProperties?.icon ?? ''}
          alt='status-icon'
          width={38}
          height={38}
        />
        <div>
          <h3 className='text-[1.5625rem] max-md:leading-[2rem] leading-[1.5625rem] font-semibold uppercase'>
            {statusProperties?.text}
          </h3>
          {/* <h4>Solicitud No. {dataCredit.code}</h4> */}
        </div>
      </div>
      <div className='grid grid-cols-3 max-lg:grid-cols-1 gap-4 max-lg:gap-2 max-lg:py-6 p-6 mx-6'>
        <SimpleFieldInput
          value={convertNumberToCurrency(dataCredit.amount)}
          type='text'
          label='Monto'
          name='MontoField'
          readonly
          alternativeText
        />
        <SimpleFieldInput
          value={dataCredit.name}
          type='text'
          label='Nombres'
          name='NameField'
          readonly
        />
        <SimpleFieldInput
          value={dataCredit.lastname}
          type='text'
          label='Apellidos'
          name='LastNameField'
          readonly
        />
        <SimpleFieldInput
          value={`${dataCredit?.quotasNumber} ${
            dataCredit?.quotasNumber === 1 ? 'mes' : 'meses'
          }`}
          type='text'
          label='Diferido a'
          name='DefferedField'
          readonly
        />
        <SimpleFieldInput
          value={formatDateAdmin(dataCredit.maxDate, 'onlyDate')}
          type='text'
          label='Fecha máxima de respuesta'
          name='DateField'
          readonly
        />
        <SimpleFieldInput
          value={
            dataCredit?.quotasNumber === 12
              ? (dataCredit?.taxes?.rateEffectiveAnnual?.toString() || '0') + '%'
              : (dataCredit?.taxes?.rateEffectiveMonthly?.toString() || '0') + '%'
          }
          type='text'
          label='Interés aplicado'
          name='taxField'
          readonly
        />
      </div>
    </div>
  )
}

export default CreditStatus
