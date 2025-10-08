import axios from 'axios'

const getCreditByID = async(idCredit: string, token: string) => {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_BACKEND_URL + '/credit/get-all-credits',
      {
        headers: {
          'x-security-token': process.env.NEXT_PUBLIC_SECURITY_TOKEN,
          Authorization: `Bearer ${token}`,
        },
        params: { code: idCredit },
      }
    )
    return response.data
  } catch (error: any) {
    console.error('Error fetching data:', error)
    return []
  }
}

export default getCreditByID
