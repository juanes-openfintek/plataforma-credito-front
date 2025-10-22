import axios from 'axios'
import { signOut } from 'next-auth/react'

const postNewFile = async (file: FormData) => {
  try {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_BACKEND_URL + '/files/upload',
      file, // Enviar directamente el FormData, no como { file }
      {
        headers: {
          'x-security-token': process.env.NEXT_PUBLIC_SECURITY_TOKEN,
          'Content-Type': false, // Dejar que axios establezca el content-type correcto con boundary
        },
      }
    )
    return response.data.url
  } catch (error: any) {
    console.error('Error fetching data:', error)
    if (error?.response?.status === 401) {
      signOut()
    }
    return null
  }
}

export default postNewFile
