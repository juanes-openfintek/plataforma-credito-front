import { CreditData } from '../../../interfaces/creditData.interface'
import SimpleFieldInput from '../../atoms/SimpleFieldInput/SimpleFieldInput'

interface ApproverCreditDelayBlockProps {
  creditUserData: CreditData
}

const ApproverCreditDelayBlock = ({
  creditUserData,
}: ApproverCreditDelayBlockProps) => {
  return (
    <>
      <h2 className='text-[1.5625rem] font-semibold my-4 mt-12'>
        Información de la mora
      </h2>
      <div className='grid grid-cols-3 max-lg:grid-cols-1 gap-4 max-lg:gap-2 max-lg:py-6 p-6 bg-light-color-one px-6 lg:px-10 w-full rounded-2xl'>
        <SimpleFieldInput
          value='---'
          type='text'
          label='Días en mora'
          name='DelayDays'
          readonly
        />
        <SimpleFieldInput
          value='---'
          type='text'
          label='Fecha del desembolso'
          name='DisburseDate'
          readonly
        />
        <SimpleFieldInput
          value='---'
          type='text'
          label='Fecha del último pago'
          name='LastPaidDate'
          readonly
        />
        <SimpleFieldInput
          value='---'
          type='text'
          label='Fecha máxima a pagar'
          name='MaxToPayDate'
          readonly
        />
        <SimpleFieldInput
          value={creditUserData?.taxes?.rateEffectiveAnnual.toString() + '%'}
          type='text'
          label='Interés principal'
          name='MainTax'
          readonly
        />
        <SimpleFieldInput
          value={creditUserData?.taxes?.rateDefault.toString() + '%'}
          type='text'
          label='Interés adicional por mora'
          name='TaxDelay'
          readonly
        />
        <SimpleFieldInput
          value='---'
          type='text'
          label='Valor en mora'
          name='DelayValue'
          readonly
        />
        <SimpleFieldInput
          value='---'
          type='text'
          label='Valor total a pagar'
          name='TotalValue'
          readonly
        />
        <SimpleFieldInput
          value='---'
          type='text'
          label='Reporte central'
          name='CentralReport'
          readonly
        />
      </div>
    </>
  )
}

export default ApproverCreditDelayBlock
