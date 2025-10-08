import { getSession } from 'next-auth/react'
import decryptData from './decryptData'

/**
 * Retrieves the user token from the session storage after decrypting the user data.
 * @returns The user token if available, otherwise null.
 */
const getUserToken = async () => {
  const encryptedData: any = await getSession()
  const userData = decryptData(encryptedData?.user)
  return userData?.token
}

export default getUserToken
