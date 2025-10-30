import axios from 'axios'
import getUserToken from '../helpers/getUserToken'
import { signOut } from 'next-auth/react'

export interface RejectCreditRequest {
  status: string
  reason?: string
  notes?: string
}

export interface RejectCreditResponse {
  success: boolean
  message: string
  credit: any
  rejectedBy: string
  rejectedAt: string
}

const rejectCredit = async (
  creditId: string,
  data: RejectCreditRequest
): Promise<RejectCreditResponse | null> => {
  try {
    const token = await getUserToken()
    const response = await axios.post(
      process.env.NEXT_PUBLIC_BACKEND_URL + `/credit/${creditId}/reject`,
      data,
      {
        headers: {
          'x-security-token': process.env.NEXT_PUBLIC_SECURITY_TOKEN,
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )
    return response.data
  } catch (error: any) {
    console.error('Error rejecting credit:', error)
    if (error?.response?.status === 401) {
      signOut()
    }
    return null
  }
}

export default rejectCredit
