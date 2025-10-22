import CryptoJS from 'crypto-js'

/**
 * Encrypts the given data using AES encryption algorithm and a secret key. (Used principally for SSR encryption)
 * @param data - The data to be encrypted.
 * @returns The encrypted data as a string.
 */
const encryptData = (data: any) => {
  try {
    const key = process.env.NEXT_PUBLIC_ENCRYPT_KEY
    if (!key) {
      console.error('❌ NEXT_PUBLIC_ENCRYPT_KEY is not defined')
      throw new Error('Encryption key is not configured')
    }
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key).toString()
    return encrypted
  } catch (error) {
    console.error('❌ Error encrypting data:', error)
    throw error
  }
}

export default encryptData
