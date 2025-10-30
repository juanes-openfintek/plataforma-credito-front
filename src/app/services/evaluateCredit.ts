import axios from 'axios'
import getUserToken from '../helpers/getUserToken'
import { signOut } from 'next-auth/react'

export interface EvaluateCreditRequest {
  creditAmount: number
  creditTerm: number
  userScore: number
  monthlyIncome: number
  currentMonthlyDebt: number
  employmentMonths: number
  creditHistoryMonths: number
  requiredDocumentsVerified: boolean
  creditType?: string
}

export interface ApprovalResponse {
  canAutoApprove: boolean
  approvalLevel: 'AUTO' | 'LEVEL1' | 'LEVEL2' | 'COMMITTEE'
  expectedApprovalDays: number
  rejectionReasons: string[]
  validations: {
    scoreValidation: {
      passed: boolean
      score: number
      threshold: number
    }
    incomeValidation: {
      passed: boolean
      income: number
      minimum: number
    }
    debtRatioValidation: {
      passed: boolean
      ratio: number
      maximum: number
    }
    documentValidation: {
      passed: boolean
      verified: boolean
    }
    amountValidation: {
      passed: boolean
      amount: number
      autoApproveLimit: number
    }
  }
  requiredDocuments: string[]
  approvalRules: {
    autoApproveUpTo: number
    scoreThreshold: number
    maxLevelApprovals: {
      level1: number
      level2: number
    }
    minimumMonthlyIncome: number
    maximumDebtToIncomeRatio: number
  }
  recommendation: string
}

const evaluateCredit = async (
  data: EvaluateCreditRequest
): Promise<ApprovalResponse | null> => {
  try {
    const token = await getUserToken()
    const response = await axios.post(
      process.env.NEXT_PUBLIC_BACKEND_URL + '/credit/evaluate',
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
    console.error('Error evaluating credit:', error)
    if (error?.response?.status === 401) {
      signOut()
    }
    return null
  }
}

export default evaluateCredit
