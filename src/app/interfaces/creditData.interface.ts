export interface CreditData {
  status: string
  code: number
  details: string
  _id: string
  email: string
  account: {
    urlCertificate: string
    _id: string
    user: string
    accountNumber: string
    accountType: string
    lastNumbers: string
    accountEntity: string
    isActive: boolean
    default: boolean
    __v: number
    updatedAt: string
  }
  arkdia: {
    title?: string
    documentId: string
    status: string
    _id: string
  }
  user?: {
    email: string
    uid: string
    isActive: true
    roles: [string]
    emailVerified: true
    documentNumber: string
    documentType: string
    dateOfBirth: string
    name: string
    secondName: string
    lastname: string
    secondLastname: string
  }
  taxes: {
    minAmount: number
    maxAmount: number
    rateEffectiveAnnual: number
    rateEffectiveMonthly: number
    rateDefault: number
    rateInsurance: number
    rateAdministration: number
    iva: number
  }
  amount: number
  quotasNumber: number
  created: string
  maxDate: string
  name: string
  secondName: string
  lastname: string
  secondLastname: string
  phoneNumber: string
  dateOfBirth: string
  documentType: string
  documentNumber: string
  personType?: 'pensionado' | 'empleado'
  economicActivity: string
  nameCompany: string
  phoneNumberCompany: string
  addressCompany: string
  positionCompany: string
  typeContract: string
  dateOfAdmission: string
  pensionIssuer?: string
  pensionType?: string
  monthlyIncome: string
  monthlyExpenses: string
  experienceCredit: string
  disburserMethod: string
  bankName?: string
  bankAccountType?: string
  bankAccountNumber?: string
  nameReferencePersonal: string
  parentescoReferencePersonal: string
  phoneNumberReferencePersonal: string
  departamentReferencePersonal: string
  municipalityReferencePersonal: string
  commission: string,
  identificationNumber: string,
  updatedAt: string
  requiresPortfolioPurchase?: boolean
  portfolioDebts?: Array<{
    id?: string
    entity?: string
    balance?: number
    installment?: number
    selected?: boolean
  }>
  analyst1Checklist?: {
    kyc?: boolean
    riskCentral?: boolean
    debtCapacity?: boolean
  }
  analyst2Checklist?: {
    references?: boolean
    insurabilityPolicies?: boolean
    portfolioPurchase?: boolean
    employmentOrPensionVerification?: boolean
  }
  analyst3Checklist?: {
    reviewAnalyst1?: boolean
    reviewAnalyst2?: boolean
    finalRectification?: boolean
  }
}
