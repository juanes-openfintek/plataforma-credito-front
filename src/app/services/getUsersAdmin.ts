import axios from 'axios'
import getUserToken from '../helpers/getUserToken'
import { signOut } from 'next-auth/react'

const getUsersAdmin = async (uid?: string) => {
  let body = {}
  if (uid) {
    body = {
      isActive: true,
      uid,
    }
  } else {
    body = {
      isActive: true,
    }
  }
  try {
    const token = await getUserToken()
    const response = await axios.get(
      process.env.NEXT_PUBLIC_BACKEND_URL + '/auth/get-users',
      {
        params: body,
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

export default getUsersAdmin
