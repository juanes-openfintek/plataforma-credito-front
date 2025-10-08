import axios from 'axios'
import getUserToken from '../helpers/getUserToken'
import { signOut } from 'next-auth/react'

const getValidate = async () => {
  try {
    const token = await getUserToken()
    const response = await axios.get(
      process.env.NEXT_PUBLIC_BACKEND_URL + '/auth/validate',
      {
        headers: {
          'x-security-token': process.env.NEXT_PUBLIC_SECURITY_TOKEN,
          Authorization: `Bearer ${token}`,
        },
      }
    )
    const data = response.data

    const userData = {
      id: data._id,
      uid: data.uid,
      name: data.name,
      secondName: data.secondName,
      email: data.email,
      lastname: data.lastname,
      secondLastname: data.secondLastname,
      token: data.token,
      roles: data.roles,
      phoneNumber: data.phoneNumber,
      birthdate: data.dateOfBirth,
      documentNumber: data.documentNumber,
      documentType: data.documentType,
    }
    return userData
  } catch (error: any) {
    console.error('Error fetching data:', error)
    if (error?.response?.status === 401) {
      signOut()
    }
    return []
  }
}

export default getValidate
