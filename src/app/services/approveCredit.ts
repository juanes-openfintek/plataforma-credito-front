import axios from 'axios'
import getUserToken from '../helpers/getUserToken'
import { signOut } from 'next-auth/react'

export interface ApproveCreditRequest {
  status: string
  reason?: string
  notes?: string
}

export interface ApproveCreditResponse {
  success: boolean
  message: string
  credit: any
  approvedBy: string
  approvedAt: string
}

const approveCredit = async (
  creditId: string,
  data: ApproveCreditRequest
): Promise<ApproveCreditResponse | null> => {
  try {
    const token = await getUserToken()
    const response = await axios.post(
      process.env.NEXT_PUBLIC_BACKEND_URL + `/credit/${creditId}/approve`,
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
    console.error('Error approving credit:', error)
    if (error?.response?.status === 401) {
      signOut()
    }
    return null
  }
}

export default approveCredit
