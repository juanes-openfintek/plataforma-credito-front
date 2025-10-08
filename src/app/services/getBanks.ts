import axios from 'axios'
import { signOut } from 'next-auth/react'

const getBanks = async () => {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_BACKEND_URL + '/mono/banks',
      {
        headers: {
          'x-security-token': process.env.NEXT_PUBLIC_SECURITY_TOKEN,
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

export default getBanks
