import axios from 'axios'
import { CalculateScoreRequest, ScoreResponse } from './calculateScore'

export interface PreApprovalResponse extends ScoreResponse {
  estimatedMonthlyPayment: number
  estimatedTotalCost: number
  estimatedTotalInterest: number
  interestRate: number
}

const getPreApproval = async (
  data: CalculateScoreRequest
): Promise<PreApprovalResponse | null> => {
  try {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_BACKEND_URL + '/scoring/pre-approval',
      data,
      {
        headers: {
          'x-security-token': process.env.NEXT_PUBLIC_SECURITY_TOKEN,
          'Content-Type': 'application/json',
        },
      }
    )
    return response.data
  } catch (error: any) {
    console.error('Error getting pre-approval:', error)
    return null
  }
}

export default getPreApproval
