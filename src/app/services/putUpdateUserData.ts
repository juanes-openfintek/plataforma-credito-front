import axios from 'axios'
import { UserData } from '../interfaces/userData.interface'
import getUserToken from '../helpers/getUserToken'
import { signOut } from 'next-auth/react'

const putUpdateUserData = async (data: UserData) => {
  try {
    const token = await getUserToken()
    const response = await axios.put(
      process.env.NEXT_PUBLIC_BACKEND_URL + '/auth/update-user',
      data,
      {
        headers: {
          'x-security-token': process.env.NEXT_PUBLIC_SECURITY_TOKEN,
          Authorization: `Bearer ${token}`
        },
      }
    )
    return response.data
  } catch (error: any) {
    console.error('Error fetching data:', error)
    if (error?.response?.status === 401) {
      signOut()
    }
    return null
  }
}

export default putUpdateUserData
