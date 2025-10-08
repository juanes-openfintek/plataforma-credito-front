import { CreditData } from '../interfaces/creditData.interface'
import { Ticket } from '../interfaces/ticket.interface'

/**
 * convertNumberToCurrency is a function that converts a number to currency
 * @param actualNumber - The number to convert
 * @returns The number converted to currency
 */
export const convertNumberToCurrency = (actualNumber: number) => {
  if (isNaN(actualNumber)) {
    return '$0'
  }
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(actualNumber)
}
/**
 * calculatePercentages is a function that calculates the percentages of a currency
 * @param actualCurrency - The actual currency
 * @param percentage - The percentage
 * @returns The percentage calculated
 */
export const calculatePercentages = (
  actualCurrency: number,
  percentage: number
) => {
  if (isNaN(actualCurrency) || isNaN(percentage)) {
    return 0
  }
  return (actualCurrency * percentage) / 100
}

/**
 * calculateInterest is a function that calculates the total of a currency
 * @param credit - The credit
 * @returns The total calculated
 */
export const calculateAllInterest = (
  credit: Ticket | CreditData,
  quotas?: Number
) => {
  try {
    const interest =
      credit.amount *
      (calculateInterest(credit.quotasNumber ?? quotas, credit.taxes) / 100)
    const insurance = credit.amount * (credit.taxes?.rateInsurance / 100)
    const administation =
      credit.amount * (credit.taxes?.rateAdministration / 100)
    const iva = credit.amount * (credit.taxes?.iva / 100)
    return credit.amount + interest + insurance + administation + iva
  } catch (error) {
    return 0
  }
}

export const calculateInterest = (
  quotas: number,
  taxes: {
    rateEffectiveAnnual: number
    rateEffectiveMonthly: number
  }
) => {
  try {
    let tax = 0
    if (quotas === 12) {
      tax = taxes.rateEffectiveAnnual
    } else {
      tax = taxes.rateEffectiveMonthly
    }
    return tax
  } catch (error) {
    return 0
  }
}
