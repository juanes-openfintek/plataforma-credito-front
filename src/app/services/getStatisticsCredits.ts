import axios from 'axios'
import getUserToken from '../helpers/getUserToken'
import { signOut } from 'next-auth/react'

const getStatisticsCredits = async (status?: string) => {
  const params: any = {}
  if (status) {
    params.status = status
  }
  try {
    const token = await getUserToken()
    const response = await axios.get(
      process.env.NEXT_PUBLIC_BACKEND_URL + '/statistics/credits',
      {
        headers: {
          'x-security-token': process.env.NEXT_PUBLIC_SECURITY_TOKEN,
          Authorization: `Bearer ${token}`,
        },
        params,
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

export default getStatisticsCredits
