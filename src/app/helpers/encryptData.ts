import CryptoJS from 'crypto-js'

/**
 * Encrypts the given data using AES encryption algorithm and a secret key. (Used principally for SSR encryption)
 * @param data - The data to be encrypted.
 * @returns The encrypted data as a string.
 */
const encryptData = (data: any) => {
  const key = process.env.NEXT_PUBLIC_ENCRYPT_KEY
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key!!).toString()
  return encrypted
}

export default encryptData
