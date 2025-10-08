import { createDecipheriv } from 'crypto'
/**
 * Decrypts a token using the encryption key and returns the decrypted data.
 * @param token - The token to be decrypted.
 * @returns The decrypted data as an object.
 */
const decryptCryptoData = (data: any) : string => {
  try {
    if (data === '' || !data || !data.iv) return ''
    const key = process.env.NEXT_PUBLIC_ENCRYPT_KEY!!
    const algorithm = 'aes-256-cbc'
    const iv = Buffer.from(data.iv, 'hex')
    const encryptedText = Buffer.from(data.encryptedData, 'hex')
    const decipher: any = createDecipheriv(
      algorithm,
      Buffer.from(key, 'hex'),
      iv
    )
    let decrypted: any = decipher.update(encryptedText, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
  } catch (error) {
    console.error(error)
    return ''
  }
}

export default decryptCryptoData
