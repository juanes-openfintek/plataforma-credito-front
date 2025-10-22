import axios from 'axios'
import { signOut } from 'next-auth/react'
import colombianBanks from '../constants/colombianBanks'

const getBanks = async () => {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_BACKEND_URL + '/mono/banks',
      {
        headers: {
          'x-security-token': process.env.NEXT_PUBLIC_SECURITY_TOKEN,
        },
      }
    )
    return response.data
  } catch (error: any) {
    console.warn('⚠️  Endpoint /mono/banks not available, using mock data:', error.message)
    
    // Si es error 401, cerrar sesión
    if (error?.response?.status === 401) {
      signOut()
    }
    
    // Retornar datos mock de bancos colombianos
    return { 
      banks: colombianBanks.map(bank => ({
        code: bank.code,
        name: bank.name,
        supported_account_types: bank.supported_account_types
      }))
    }
  }
}

export default getBanks
