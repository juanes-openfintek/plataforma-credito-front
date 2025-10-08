import axios from 'axios'
import getUserToken from '../helpers/getUserToken'
import { signOut } from 'next-auth/react'

const deleteTaxes = async (id: string) => {
  try {
    const token = await getUserToken()
    const response = await axios.delete(
      process.env.NEXT_PUBLIC_BACKEND_URL + '/taxes/delete',
      {
        headers: {
          'x-security-token': process.env.NEXT_PUBLIC_SECURITY_TOKEN,
          Authorization: `Bearer ${token}`,
        },
        params: {
          id,
        },
      }
    )
    return response.data.status
  } catch (error: any) {
    console.error('Error fetching data:', error)
    if (error?.response?.status === 401) {
      signOut()
    }
    return null
  }
}

export default deleteTaxes
