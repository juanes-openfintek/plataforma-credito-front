import axios from 'axios'
import getUserToken from '../helpers/getUserToken'
import { signOut } from 'next-auth/react'

const postChangeSelfPassword = async (newPassword: string) => {
  try {
    const token = await getUserToken()
    const response = await axios.post(
      process.env.NEXT_PUBLIC_BACKEND_URL + '/auth/change-password',
      {
        password: newPassword,
      },
      {
        headers: {
          'x-security-token': process.env.NEXT_PUBLIC_SECURITY_TOKEN,
          Authorization: `Bearer ${token}`,
        },
      }
    )
    return response.status
  } catch (error: any) {
    console.error('Error fetching data:', error)
    if (error?.response?.status === 401) {
      signOut()
    }
    return error.response.data
  }
}

export default postChangeSelfPassword
