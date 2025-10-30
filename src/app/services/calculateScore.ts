import axios from 'axios'

export interface CalculateScoreRequest {
  monthlyIncome?: number
  currentDebt?: number
  creditHistoryMonths?: number
  employmentMonths?: number
  requestedAmount?: number
  requestedTerm?: number
}

export interface ScoreBreakdown {
  baseScore: number
  incomeRatioScore: number
  creditHistoryScore: number
  employmentStabilityScore: number
}

export interface ScoreResponse {
  score: number
  breakdown: ScoreBreakdown
  isEligible: boolean
  recommendedAmount: number
  recommendedTerm: number
  message: string
  approvalLikelihood: number
}

const calculateScore = async (
  data: CalculateScoreRequest
): Promise<ScoreResponse | null> => {
  try {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_BACKEND_URL + '/scoring/calculate',
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
    console.error('Error calculating score:', error)
    return null
  }
}

export default calculateScore
