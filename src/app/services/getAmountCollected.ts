import axios from 'axios'
import getUserToken from '../helpers/getUserToken'
import { signOut } from 'next-auth/react'

const getAmountCollected = async (startDate?: string) => {
  const date = new Date()
  const formattedDate = date.toISOString().split('T')[0]
  const params: {endDate: string, startDate?: string} = {
    endDate: formattedDate,
  }
  if (startDate) {
    params.startDate = startDate
  }
  try {
    const token = await getUserToken()
    const response = await axios.get(
      process.env.NEXT_PUBLIC_BACKEND_URL + '/statistics/amountCollected',
      {
        headers: {
          'x-security-token': process.env.NEXT_PUBLIC_SECURITY_TOKEN,
          Authorization: `Bearer ${token}`,
        },
        params
      }
    )
    return response.data
  } catch (error: any) {
    console.error('Error fetching data:', error)
    if (error?.response?.status === 401) {
      signOut()
    }
    return []
  }
}

export default getAmountCollected
