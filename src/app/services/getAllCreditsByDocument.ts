import axios from 'axios'

const getAllCreditsByDocument = async (
  documentType: string,
  documentNumber: string
) => {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_BACKEND_URL + '/credit/get-credit-by-document',
      {
        headers: {
          'x-security-token': process.env.NEXT_PUBLIC_SECURITY_TOKEN,
        },
        params: {
          documentType,
          documentNumber,
        },
      }
    )
    return response.data
  } catch (error: any) {
    console.error('Error fetching data:', error)
    return error.response.data.message
  }
}

export default getAllCreditsByDocument
