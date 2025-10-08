import axios from 'axios'
import getUserToken from '../helpers/getUserToken'
import { signOut } from 'next-auth/react'

const putUpdateCredit = async (
  idCredit: string,
  status: string,
  idPromissory?: string,
  code?: string,
  commission?: string,
  identificationNumber?: string
) => {
  const data: any = {
    id: idCredit,
  }
  if (status) {
    data.status = status
  }
  if (idPromissory) {
    data.arkdia = {
      documentId: code,
      _id: idPromissory,
    }
  }
  if (commission) {
    data.commission = commission
    data.identificationNumber = identificationNumber
  }
  try {
    const token = await getUserToken()
    const response = await axios.put(
      process.env.NEXT_PUBLIC_BACKEND_URL + '/credit/update-credit',
      data,
      {
        headers: {
          'x-security-token': process.env.NEXT_PUBLIC_SECURITY_TOKEN,
          Authorization: `Bearer ${token}`,
        },
      }
    )
    return response
  } catch (error: any) {
    console.error('Error fetching data:', error)
    if (error?.response?.status === 401) {
      signOut()
    }
    return null
  }
}

export default putUpdateCredit
