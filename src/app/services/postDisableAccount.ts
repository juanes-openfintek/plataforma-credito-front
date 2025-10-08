import axios from 'axios'
import getUserToken from '../helpers/getUserToken'
import { signOut } from 'next-auth/react'

const postDisableAccount = async (idAccount: string) => {
  try {
    const token = await getUserToken()
    const response = await axios.post(
      process.env.NEXT_PUBLIC_BACKEND_URL + '/account/disable',
      {
        account: idAccount,
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

export default postDisableAccount
