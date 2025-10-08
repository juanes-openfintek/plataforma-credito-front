import axios from 'axios'
import { Taxes } from '../interfaces/taxes.interface'
import { signOut } from 'next-auth/react'

const fetchTaxesPercentages = async () => {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_BACKEND_URL + '/taxes',
      {
        headers: {
          'x-security-token': process.env.NEXT_PUBLIC_SECURITY_TOKEN,
        },
      }
    )
    const data = response.data

    const rangeTaxes: Taxes[] = data.map((tax: any) => {
      return {
        minAmount: tax.minAmount,
        maxAmount: tax.maxAmount,
        eaPercentage: tax.rateEffectiveAnnual,
        emPercentage: tax.rateEffectiveMonthly,
        insurancePercentage: tax.rateInsurance,
        administrationPercentage: tax.rateAdministration,
        interestPercentage: tax.rateDefault,
        ivaPercentage: tax.iva,
        id: tax._id,
      }
    })
    return rangeTaxes
  } catch (error: any) {
    console.error('Error fetching data:', error)
    if (error?.response?.status === 401) {
      signOut()
    }
    return []
  }
}

export default fetchTaxesPercentages
