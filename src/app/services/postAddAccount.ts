import axios from 'axios'
import getUserToken from '../helpers/getUserToken'
import { signOut } from 'next-auth/react'
import encryptCryptoData from '../helpers/encryptCryptoData'
import { BankData } from '../interfaces/bankData.interface'

const postAddAccount = async (values: {
  typeAccount: string
  numberAccount: string
  nameBankAccount: string
  detailAccount: BankData
  urlCertificate: string
}) => {
  try {
    const token = await getUserToken()
    const response = await axios.post(
      process.env.NEXT_PUBLIC_BACKEND_URL + '/account/add-account',
      {
        accountNumber: encryptCryptoData(values.numberAccount),
        accountType: values.typeAccount,
        accountEntity: values.nameBankAccount,
        urlCertificate: values.urlCertificate,
        detail: values.detailAccount,
        isActive: true,
        default: false
      },
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
    return error.response.data
  }
}

export default postAddAccount
