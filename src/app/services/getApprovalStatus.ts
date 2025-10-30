import axios from 'axios'
import getUserToken from '../helpers/getUserToken'
import { signOut } from 'next-auth/react'

export interface ApprovalStatus {
  creditId: string
  currentStatus: string
  canAutoApprove: boolean
  approvalLevel: 'AUTO' | 'LEVEL1' | 'LEVEL2' | 'COMMITTEE'
  expectedApprovalDays: number
  radicationNumber: number
  radicationDate: string
  context: {
    creditAmount: number
    creditTerm: number
    userScore: number
    monthlyIncome: number
    currentMonthlyDebt: number
    employmentMonths: number
    creditHistoryMonths: number
    requiredDocumentsVerified: boolean
  }
}

const getApprovalStatus = async (
  creditId: string
): Promise<ApprovalStatus | null> => {
  try {
    const token = await getUserToken()
    const response = await axios.get(
      process.env.NEXT_PUBLIC_BACKEND_URL +
        `/credit/${creditId}/approval-status`,
      {
        headers: {
          'x-security-token': process.env.NEXT_PUBLIC_SECURITY_TOKEN,
          Authorization: `Bearer ${token}`,
        },
      }
    )
    return response.data
  } catch (error: any) {
    console.error('Error fetching approval status:', error)
    if (error?.response?.status === 401) {
      signOut()
    }
    return null
  }
}

export default getApprovalStatus
