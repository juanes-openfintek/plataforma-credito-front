import { useEffect, useState } from 'react'
import ArrowButton from '../../atoms/ArrowButton/ArrowButton'
import {
  convertNumberToCurrency,
} from '../../../helpers/calculationsHelpers'
import { Taxes } from '../../../interfaces/taxes.interface'
import { useCreditState } from '../../../context/creditContext'

/**
 * DetailCalculations is a component that renders the detail of the calculations
 * @example <DetailCalculations />
 * @returns The DetailCalculations component
 */
const DetailCalculations = () => {
  /**
   * State to manage the detail visibility
   */
  const [showDetail, setShowDetail] = useState(false)
  /**
   * CreditContext instance
   */
  const { creditTaxes, amount, time } = useCreditState()
  /**
   * States to manage the interest values
   */
  const [interest, setInterest] = useState(0)
  /**
   * States to manage the insurances values
   */
  const [insurance, setInsurance] = useState(0)
  /**
   * States to manage the administration values
   */
  const [administration, setAdministration] = useState(0)
  /**
   * States to manage the iva values
   */
  const [iva, setIva] = useState(0)
  /**
   * useEffect to update the taxes values using the amount as base
   */
  useEffect(() => {
    if (amount === 0 || time === 0) return
    if (creditTaxes && creditTaxes.length > 0) {
      const tax = creditTaxes?.find((taxes) => {
        return amount >= taxes.minAmount && amount <= taxes.maxAmount
      })
      calculateInterest(tax)
    }
  }, [amount, time, creditTaxes])
  /**
   * Function to calculate the interest
   * @returns The interest value
   */
  const calculateInterest = (tax?: Taxes) => {
    if (!tax || time === 0) {
      setInterest(0)
      setInsurance(0)
      setAdministration(0)
      setIva(0)
      return
    }

    let finalValue: number | 0 = 0

    // Si es 12 meses o más, usa la tasa anual efectiva (eaPercentage)
    // Si es menos de 12 meses, usa la tasa mensual efectiva (emPercentage)
    if (time >= 12) {
      finalValue = amount * ((tax.eaPercentage ?? 0) / 100)
    } else {
      finalValue = amount * ((tax.emPercentage ?? 0) / 100) * time
    }
    setInterest(finalValue)
    setInsurance(amount * ((tax.insurancePercentage ?? 0) / 100) * time)
    setAdministration(amount * ((tax.administrationPercentage ?? 0) / 100) * time)
    setIva(amount * ((tax.ivaPercentage ?? 0) / 100) * time)
  }

  /**
   * Function to calculate the total cost
   * @returns The total cost value
   */
  const calculateAllCost = () => {
    return amount + interest + insurance + administration + iva
  }

  return (
    <>
      <div className='flex items-center font-bold mb-2'>
        <p className='w-2/3 text-[0.6rem] text-xs xl:text-base 2xl:text-[1.25rem]'>
          Valor total del préstamo
        </p>
        <p className='w-1/3 text-right text-xl lg:text-2xl 2xl:text-[2.25rem]'>
          {time > 0 && time <= 72
            ? convertNumberToCurrency(calculateAllCost())
            : convertNumberToCurrency(amount / 1)}
        </p>
      </div>

      {showDetail ? (
        <div className='my-6 font-poppins'>
          <div className='flex items-center my-2'>
            <p className='w-1/2 '>Capital</p>
            <p className='w-1/2 text-right  font-bold'>
              {convertNumberToCurrency(amount)}
            </p>
          </div>
          <div className='flex items-center my-2'>
            <p className='w-1/2 '>Intereses</p>
            <p className='w-1/2 text-right  font-bold'>
              {convertNumberToCurrency(interest)}
            </p>
          </div>
          <div className='flex items-center my-2'>
            <p className='w-1/2 '>Seguro</p>
            <p className='w-1/2 text-right  font-bold'>
              {convertNumberToCurrency(insurance)}
            </p>
          </div>
          <div className='flex items-center my-2'>
            <p className='w-1/2 '>Administración</p>
            <p className='w-1/2 text-right  font-bold'>
              {convertNumberToCurrency(administration)}
            </p>
          </div>
          <div className='flex items-center my-2'>
            <p className='w-1/2'>IVA</p>
            <p className='w-1/2 text-right font-bold'>
              {convertNumberToCurrency(iva)}
            </p>
          </div>
        </div>
      ) : null}

      <div className='border-t border-black' />

      <div className='py-4 w-[9rem] ml-auto'>
        <ArrowButton
          text={showDetail ? 'Ocultar detalle' : 'Ver detalle'}
          up={showDetail}
          onClickHandler={() => setShowDetail(!showDetail)}
        />
      </div>
    </>
  )
}

export default DetailCalculations
