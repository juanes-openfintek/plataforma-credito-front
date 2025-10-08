import axios from 'axios'
import getUserToken from '../helpers/getUserToken'
import { signOut } from 'next-auth/react'

const putTaxes = async (
  values: {
    minAmount: number
    maxAmount: number
    emPercentage: number
    eaPercentage: number
    ivaPercentage: number
    interestPercentage: number
    insurancePercentage: number
    administrationPercentage: number
  },
  id: string
) => {
  try {
    const token = await getUserToken()
    const response = await axios.put(
      process.env.NEXT_PUBLIC_BACKEND_URL + '/taxes/update',
      {
        id,
        minAmount: values.minAmount.toString(),
        maxAmount: values.maxAmount.toString(),
        rateEffectiveAnnual: values.eaPercentage.toString(),
        rateDefault: values.interestPercentage.toString(),
        rateEffectiveMonthly: values.emPercentage.toString(),
        rateInsurance: values.insurancePercentage.toString(),
        rateAdministration: values.administrationPercentage.toString(),
        iva: values.ivaPercentage.toString(),
      },
      {
        headers: {
          'x-security-token': process.env.NEXT_PUBLIC_SECURITY_TOKEN,
          Authorization: `Bearer ${token}`,
        },
      }
    )
    return response.data.status
  } catch (error: any) {
    console.error('Error fetching data:', error)
    if (error?.response?.status === 401) {
      signOut()
    }
    return error.response.data
  }
}

export default putTaxes
