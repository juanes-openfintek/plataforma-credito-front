import axios from 'axios'

const getHeaders = () => {
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('comercial_token') : null
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'x-security-token': process.env.NEXT_PUBLIC_SECURITY_TOKEN || '',
      'Content-Type': 'multipart/form-data',
    },
  }
}

/**
 * Subir un archivo al servidor
 * @param file El archivo a subir
 * @param documentType Tipo de documento (opcional)
 * @returns URL del archivo subido
 */
export const uploadFile = async (file: File, documentType?: string): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)
  
  if (documentType) {
    formData.append('documentType', documentType)
  }

  const headers = getHeaders()
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/files/upload`,
    formData,
    headers
  )

  return response.data.url
}

/**
 * Subir múltiples archivos
 * @param files Array de archivos con su tipo
 * @returns Array de objetos con información de los archivos subidos
 */
export const uploadMultipleFiles = async (
  files: Array<{ file: File; documentType: string }>
): Promise<Array<{ documentType: string; fileName: string; fileUrl: string }>> => {
  const uploadPromises = files.map(async ({ file, documentType }) => {
    try {
      const fileUrl = await uploadFile(file, documentType)
      return {
        documentType,
        fileName: file.name,
        fileUrl,
      }
    } catch (error) {
      console.error(`Error subiendo ${documentType}:`, error)
      throw new Error(`Error al subir ${documentType}: ${file.name}`)
    }
  })

  return Promise.all(uploadPromises)
}

