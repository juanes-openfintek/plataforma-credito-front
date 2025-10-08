import CryptoJS from 'crypto-js'

/**
 * Decrypts a token using the encryption key and returns the decrypted data. (Used principally for SSR decryption)
 * @param token - The token to be decrypted.
 * @returns The decrypted data as an object.
 */
const decryptData = (token: string) => {
  try {
    const key = process.env.NEXT_PUBLIC_ENCRYPT_KEY
    const bytes = CryptoJS.AES.decrypt(token, key!!)
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8)
    const userData = JSON.parse(decryptedData)
    return userData
  } catch (error) {
    console.error(error)
    return {}
  }
}

export default decryptData
