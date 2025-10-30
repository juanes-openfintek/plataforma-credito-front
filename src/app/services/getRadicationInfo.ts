import axios from 'axios'
import getUserToken from '../helpers/getUserToken'
import { signOut } from 'next-auth/react'

export interface RadicationInfo {
  radicationNumber: string
  radicationDate: string
  radicationSource: 'WEB' | 'MOBILE' | 'ADMIN'
  code: number
  status: string
  estimatedReviewDays: string
  creditAmount: number
  createdAt: string
}

const getRadicationInfo = async (
  creditId: string
): Promise<RadicationInfo | null> => {
  try {
    const token = await getUserToken()
    const response = await axios.get(
      process.env.NEXT_PUBLIC_BACKEND_URL +
        `/credit/${creditId}/radication-info`,
      {
        headers: {
          'x-security-token': process.env.NEXT_PUBLIC_SECURITY_TOKEN,
          Authorization: `Bearer ${token}`,
        },
      }
    )
    return response.data
  } catch (error: any) {
    console.error('Error fetching radication info:', error)
    if (error?.response?.status === 401) {
      signOut()
    }
    return null
  }
}

export default getRadicationInfo
