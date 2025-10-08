interface Ticket {
  _id: string
  user: string
  credit: string
  taxes: string
  date: string
  amount: number
  maxDate: string
  status: string
  createdAt: string
  updatedAt: string
  __v: number
}

interface HasDefault {
  hasDefault: boolean
  ticketsDefault: Ticket[]
  daysInDefault: number
  ticketWithLongestDefault: null
}

export interface CreditTickets {
  _id: string
  created: string
  status: string
  amount: number
  quotasNumber: number
  maxDate: string
  user: string
  taxes: string
  account: string
  name: string
  secondName: string
  lastname: string
  secondLastname: string
  phoneNumber: string
  dateOfBirth: string
  documentType: string
  documentNumber: string
  economicActivity: string
  typeContract: string
  nameCompany: string
  phoneNumberCompany: string
  addressCompany: string
  positionCompany: string
  dateOfAdmission: string
  monthlyIncome: string
  monthlyExpenses: string
  experienceCredit: string
  disburserMethod: string
  nameReferencePersonal: string
  parentescoReferencePersonal: string
  phoneNumberReferencePersonal: string
  departamentReferencePersonal: string
  municipalityReferencePersonal: string
  createdAt: string
  updatedAt: string
  code: number
  __v: number
  tickets: Ticket[]
  hasDefault: HasDefault
}
