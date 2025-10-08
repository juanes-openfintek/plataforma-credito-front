import { createCipheriv, randomBytes } from 'crypto'

/**
 * Encrypts the given data using AES encryption algorithm and a secret key.
 * @param data - The data to be encrypted.
 * @returns The encrypted data as a string.
 */
const encryptCryptoData = (data: any) => {
  const iv = randomBytes(16)
  const key = process.env.NEXT_PUBLIC_ENCRYPT_KEY!!
  const algorithm = 'aes-256-cbc'
  const cipher = createCipheriv(algorithm, Buffer.from(key, 'hex'), iv)
  let encrypted = cipher.update(data, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return { iv: iv.toString('hex'), encryptedData: encrypted }
}

export default encryptCryptoData
