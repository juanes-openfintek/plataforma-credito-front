import axios from 'axios'
import getUserToken from '../helpers/getUserToken'
import { signOut } from 'next-auth/react'

const postCredit = async (values: {
  firstNamePersonalInfo: string
  middleNamePersonalInfo: string
  lastNamePersonalInfo: string
  secondLastNamePersonalInfo: string
  phonePersonalInfo: string
  emailPersonalInfo: string
  birthDatePersonalInfo: string
  typeDocument: string
  documentNumber: string
  ecoActivityWorkInfo: string
  nameCompanyWorkInfo: string
  telCompanyWorkInfo: string
  addressCompanyWorkInfo: string
  jobTitleWorkInfo: string
  contractKindWorkInfo: string
  initialWorkDateWorkInfo: string
  monthIngressFinancialInfo: string
  monthEgressFinancialInfo: string
  creditExperienceFinancialInfo: string
  disbursementFinancialInfo: string
  completeNameReference: string
  relationshipReference: string
  departmentReference: string
  municipalityReference: string
  phoneReference: string
  taxes: string
  amount: number
  quotasNumber: number
}) => {
  const token = await getUserToken()
  const headers = token
    ? {
        headers: {
          'x-security-token': process.env.NEXT_PUBLIC_SECURITY_TOKEN,
          Authorization: `Bearer ${token}`,
        },
      }
    : {
        headers: {
          'x-security-token': process.env.NEXT_PUBLIC_SECURITY_TOKEN,
        },
      }
  try {
    const maxDate = new Date()
    maxDate.setDate(maxDate.getDate() + 7)
    maxDate.setHours(12, 0)
    const response = await axios.post(
      process.env.NEXT_PUBLIC_BACKEND_URL + (token ? '/credit/create' : '/credit/create-without-user'),
      {
        amount: values.amount,
        quotasNumber: values.quotasNumber,
        maxDate: maxDate.toISOString(),
        email: values.emailPersonalInfo,
        name: values.firstNamePersonalInfo,
        secondName: values.middleNamePersonalInfo,
        lastname: values.lastNamePersonalInfo,
        secondLastname: values.secondLastNamePersonalInfo,
        phoneNumber: values.phonePersonalInfo,
        dateOfBirth: values.birthDatePersonalInfo,
        documentType: values.typeDocument,
        documentNumber: values.documentNumber,
        economicActivity: values.ecoActivityWorkInfo,
        nameCompany: values.nameCompanyWorkInfo,
        phoneNumberCompany: values.telCompanyWorkInfo,
        addressCompany: values.addressCompanyWorkInfo,
        positionCompany: values.jobTitleWorkInfo,
        typeContract: values.contractKindWorkInfo,
        dateOfAdmission: values.initialWorkDateWorkInfo,
        monthlyIncome: values.monthIngressFinancialInfo,
        monthlyExpenses: values.monthEgressFinancialInfo,
        experienceCredit: values.creditExperienceFinancialInfo,
        disburserMethod: values.disbursementFinancialInfo,
        nameReferencePersonal: values.completeNameReference,
        parentescoReferencePersonal: values.relationshipReference,
        phoneNumberReferencePersonal: values.phoneReference,
        departamentReferencePersonal: values.departmentReference,
        municipalityReferencePersonal: values.municipalityReference,
        taxes: values.taxes
      },
      headers
    )
    return response.data.status
  } catch (error: any) {
    console.error('Error fetching data:', error)
    console.error('Error response:', error?.response?.data)
    console.error('Error status:', error?.response?.status)
    if (error?.response?.status === 401) {
      signOut()
    }
    return error.response.data
  }
}

export default postCredit
