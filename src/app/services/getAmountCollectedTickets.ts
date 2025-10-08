import axios from 'axios'
import getUserToken from '../helpers/getUserToken'
import { signOut } from 'next-auth/react'

const getAmountCollectedTickets = async (startDate?: string) => {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() + 1)
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
      process.env.NEXT_PUBLIC_BACKEND_URL + '/statistics/amountTicketsCollected',
      {
        headers: {
          'x-security-token': process.env.NEXT_PUBLIC_SECURITY_TOKEN,
          Authorization: `Bearer ${token}`,
        },
        params
      }
    )
    const positionResponse = response.data[0]
    return positionResponse
  } catch (error: any) {
    console.error('Error fetching data:', error)
    if (error?.response?.status === 401) {
      signOut()
    }
    return []
  }
}

export default getAmountCollectedTickets
