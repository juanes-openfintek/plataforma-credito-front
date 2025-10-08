import axios from 'axios'
import getUserToken from '../helpers/getUserToken'
import { signOut } from 'next-auth/react'
import encryptCryptoData from '../helpers/encryptCryptoData'
import { BankData } from '../interfaces/bankData.interface'

interface IUpdateAccount {
  id: string
  isActive?: boolean
  setDefault?: boolean
  accountType?: string
  accountNumber?: string
  accountEntity?: string
  urlCertificate?: string
  detailAccount?: BankData

}

const putUpdateAccount = async (data: IUpdateAccount) => {
  try {
    const body: any = {
      id: data.id,
    }
    if (data.isActive !== undefined) {
      body.isActive = data.isActive.toString()
    }
    if (data.setDefault !== undefined) {
      body.default = data.setDefault.toString()
    }
    if (data.accountType) {
      body.accountType = data.accountType
      body.accountEntity = data.accountEntity
      body.accountNumber = encryptCryptoData(data.accountNumber)
      body.detail = data.detailAccount
      body.urlCertificate = data.urlCertificate
    }
    const token = await getUserToken()
    const response = await axios.put(
      process.env.NEXT_PUBLIC_BACKEND_URL + '/account/update',
      body,
      {
        headers: {
          'x-security-token': process.env.NEXT_PUBLIC_SECURITY_TOKEN,
          Authorization: `Bearer ${token}`,
        },
      }
    )
    return response.data
  } catch (error: any) {
    console.error('Error fetching data:', error)
    if (error?.response?.status === 401) {
      signOut()
    }
    return null
  }
}

export default putUpdateAccount
