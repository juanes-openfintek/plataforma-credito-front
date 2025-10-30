import axios from 'axios'
import { signOut } from 'next-auth/react'

type UploadInput = FormData | File | Blob | null | undefined

const postNewFile = async (file: UploadInput) => {
  if (!file) {
    return null
  }

  const isFormData =
    typeof FormData !== 'undefined' && file instanceof FormData
  const isBlob = typeof Blob !== 'undefined' && file instanceof Blob

  if (!isFormData && !isBlob) {
    console.error('Formato de archivo no soportado para la carga.')
    return null
  }

  const formData = isFormData
    ? (file as FormData)
    : (() => {
        const data = new FormData()
        const fileBlob = file as File | Blob
        data.append('file', fileBlob, (fileBlob as File)?.name)
        return data
      })()

  try {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_BACKEND_URL + '/files/upload',
      formData,
      {
        headers: {
          'x-security-token': process.env.NEXT_PUBLIC_SECURITY_TOKEN,
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
