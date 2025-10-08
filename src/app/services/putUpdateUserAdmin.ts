import axios from 'axios'
import getUserToken from '../helpers/getUserToken'
import { signOut } from 'next-auth/react'
import encryptData from '../helpers/encryptData'

const putUpdateUserAdmin = async (values: {
  id: string
  uid: string
  completeName: String
  email: string
  asignPassword: string
  role: string
}) => {
  try {
    const tokenUser = await getUserToken()
    const response = await axios.post(
      '/api/admin/update-user',
      {
        token: encryptData({
          values,
          token: tokenUser
        }),
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

export default putUpdateUserAdmin
