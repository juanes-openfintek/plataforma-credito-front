import axios from 'axios'
import { signOut } from 'next-auth/react'
import colombianBanks from '../constants/colombianBanks'

const getBanks = async () => {
  const source = (process.env.NEXT_PUBLIC_BANKS_SOURCE || 'mock')
    .toLowerCase()
    .trim()

  if (source !== 'api') {
    console.info('Using mock bank catalog (demo mode).')
    return {
      banks: colombianBanks.map((bank) => ({
        code: bank.code,
        name: bank.name,
        supported_account_types: bank.supported_account_types,
      })),
    }
  }

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/mono/banks`,
      {
        headers: {
          'x-security-token': process.env.NEXT_PUBLIC_SECURITY_TOKEN,
        },
      }
    )
    return response.data
  } catch (error: any) {
    console.warn(
      'Endpoint /mono/banks not available, falling back to mock data:',
      error?.message ?? error
    )

    if (error?.response?.status === 401) {
      signOut()
    }

    return {
      banks: colombianBanks.map((bank) => ({
        code: bank.code,
        name: bank.name,
        supported_account_types: bank.supported_account_types,
      })),
    }
  }
}

export default getBanks
