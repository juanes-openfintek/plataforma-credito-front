import CryptoJS from 'crypto-js'

/**
 * Decrypts a token using the encryption key and returns the decrypted data. (Used principally for SSR decryption)
 * @param token - The token to be decrypted.
 * @returns The decrypted data as an object.
 */
const decryptData = (token: string) => {
  try {
    if (!token) {
      console.error('❌ No token provided for decryption')
      return {}
    }
    
    const key = process.env.NEXT_PUBLIC_ENCRYPT_KEY
    if (!key) {
      console.error('❌ NEXT_PUBLIC_ENCRYPT_KEY is not defined')
      return {}
    }
    
    const bytes = CryptoJS.AES.decrypt(token, key)
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8)
    
    if (!decryptedData) {
      console.error('❌ Failed to decrypt data')
      return {}
    }
    
    const userData = JSON.parse(decryptedData)
    return userData
  } catch (error) {
    console.error('❌ Error decrypting data:', error)
    return {}
  }
}

export default decryptData
