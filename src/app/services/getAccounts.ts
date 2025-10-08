import axios from 'axios'
import getUserToken from '../helpers/getUserToken'
import { signOut } from 'next-auth/react'

const getAccounts = async () => {
  try {
    const token = await getUserToken()
    const response = await axios.get(
      process.env.NEXT_PUBLIC_BACKEND_URL + '/account/find?isActive=true',
      {
        headers: {
          'x-security-token': process.env.NEXT_PUBLIC_SECURITY_TOKEN,
          Authorization: `Bearer ${token}`,
        },
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

export default getAccounts
