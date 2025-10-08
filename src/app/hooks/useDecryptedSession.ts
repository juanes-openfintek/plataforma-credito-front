import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import decryptData from '../helpers/decryptData'
import { UserDataToken } from '../interfaces/userDataToken.interface'

/**
 * Custom hook to get the decrypted user session data.
 * @returns The decrypted user session data.
 */
const useDecryptedSession = () => {
  const session: any = useSession()
  const [dataUser, setDataUser] = useState<UserDataToken>({
    id: '',
    uid: '',
    name: '',
    secondName: '',
    email: '',
    lastname: '',
    secondLastname: '',
    token: '',
    roles: [],
    phoneNumber: '',
    birthdate: '',
    documentNumber: '',
    documentType: '',
    commission: '',
    identificationNumber: '',
  })
  useEffect(() => {
    if (session?.data?.user) {
      const decryptedData = decryptData(session?.data?.user)
      setDataUser(decryptedData)
    }
  }, [session])

  return dataUser
}

export default useDecryptedSession
