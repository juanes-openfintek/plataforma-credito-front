import axios from 'axios'
import getUserToken from '../helpers/getUserToken'
import { signOut } from 'next-auth/react'

const postTaxes = async (values: {
  minAmount: number
  maxAmount: number
  emPercentage: number
  eaPercentage: number
  ivaPercentage: number
  interestPercentage: number
  insurancePercentage: number
  administrationPercentage: number
}) => {
  try {
    const token = await getUserToken()
    const response = await axios.post(
      process.env.NEXT_PUBLIC_BACKEND_URL + '/taxes/create',
      {
        minAmount: Number(values.minAmount),
        maxAmount: Number(values.maxAmount),
        rateEffectiveAnnual: Number(values.eaPercentage),
        rateDefault: Number(values.ivaPercentage),
        rateEffectiveMonthly: Number(values.emPercentage),
        rateInsurance: Number(values.insurancePercentage),
        rateAdministration: Number(values.administrationPercentage),
        iva: Number(values.ivaPercentage),
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

export default postTaxes
