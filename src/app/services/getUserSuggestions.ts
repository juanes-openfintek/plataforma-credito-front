import axios from 'axios'
import getUserToken from '../helpers/getUserToken'
import { signOut } from 'next-auth/react'

export interface SuggestionItem {
  category: 'DOCUMENTS' | 'EMPLOYMENT' | 'FINANCIAL' | 'PERSONAL_INFO' | 'CREDIT_HISTORY'
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  message: string
  impactOnScore: number
  action: string
  timeEstimate: string
}

export interface SuggestionsResponse {
  suggestions: SuggestionItem[]
  totalImpact: number
  currentScore: number
  potentialScore: number
  hasIncompleteProfile: boolean
  completionPercentage: number
}

const getUserSuggestions = async (
  userId: string
): Promise<SuggestionsResponse | null> => {
  try {
    const token = await getUserToken()
    const response = await axios.get(
      process.env.NEXT_PUBLIC_BACKEND_URL + `/user/${userId}/suggestions`,
      {
        headers: {
          'x-security-token': process.env.NEXT_PUBLIC_SECURITY_TOKEN,
          Authorization: `Bearer ${token}`,
        },
      }
    )
    return response.data
  } catch (error: any) {
    console.error('Error fetching suggestions:', error)
    if (error?.response?.status === 401) {
      signOut()
    }
    return null
  }
}

export default getUserSuggestions
