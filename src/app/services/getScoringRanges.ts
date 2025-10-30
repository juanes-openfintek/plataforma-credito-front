import axios from 'axios'

export interface ScoringRange {
  minScore: number
  maxScore: number
  label: string
  maxAmount: number
  color: string
  description: string
}

export interface ScoringRangesResponse {
  ranges: ScoringRange[]
  minimumQualifyingScore: number
}

const getScoringRanges = async (): Promise<ScoringRangesResponse | null> => {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_BACKEND_URL + '/scoring/ranges',
      {
        headers: {
          'x-security-token': process.env.NEXT_PUBLIC_SECURITY_TOKEN,
        },
      }
    )
    return response.data
  } catch (error: any) {
    console.error('Error fetching scoring ranges:', error)
    return null
  }
}

export default getScoringRanges
