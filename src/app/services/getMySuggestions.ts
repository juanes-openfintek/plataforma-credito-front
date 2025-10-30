import axios from 'axios'
import getUserToken from '../helpers/getUserToken'
import { signOut } from 'next-auth/react'
import { SuggestionsResponse, SuggestionItem } from './getUserSuggestions'

export type { SuggestionItem, SuggestionsResponse }

const getMySuggestions = async (): Promise<SuggestionsResponse | null> => {
  try {
    const token = await getUserToken()
    const response = await axios.get(
      process.env.NEXT_PUBLIC_BACKEND_URL + `/user/me/suggestions`,
      {
        headers: {
          'x-security-token': process.env.NEXT_PUBLIC_SECURITY_TOKEN,
          Authorization: `Bearer ${token}`,
        },
      }
    )
    return response.data
  } catch (error: any) {
    console.error('Error fetching my suggestions:', error)
    if (error?.response?.status === 401) {
      signOut()
    }
    return null
  }
}

export default getMySuggestions
