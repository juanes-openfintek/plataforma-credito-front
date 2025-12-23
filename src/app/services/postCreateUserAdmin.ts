import axios from 'axios'
import getUserToken from '../helpers/getUserToken'
import { signOut } from 'next-auth/react'
import encryptData from '../helpers/encryptData'

const postCreateUserAdmin = async (values: {
  completeName: string
  email: string
  asignPassword: string
  role: string
  commission: string
  identificationNumber: string
}) => {
  try {
    const tokenUser = await getUserToken()
    const response = await axios.post(
      '/api/admin/create-user',
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
    console.error('Error response:', error.response?.data)
    if (error?.response?.status === 401) {
      signOut()
    }
    return error.response?.data || { error: 'Error desconocido' }
  }
}

export default postCreateUserAdmin
