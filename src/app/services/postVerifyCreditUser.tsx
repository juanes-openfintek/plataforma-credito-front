import axios from 'axios'
import { signOut } from 'next-auth/react'

const postVerifyCreditUser = async (token: string) => {
  try {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_BACKEND_URL + '/credit/verify-credit-user',
      {},
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

export default postVerifyCreditUser
