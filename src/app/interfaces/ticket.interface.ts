interface Taxes {
  _id: string
  minAmount: number
  maxAmount: number
  rateEffectiveAnnual: number
  rateEffectiveMonthly: number
  rateDefault: number
  rateInsurance: number
  rateAdministration: number
  __v: number
  iva: number
  updatedAt: string
}

export interface Ticket {
  _id: string
  user: string
  credit: string
  taxes: Taxes
  date: string
  maxDate: string
  amount: number
  status: string
  createdAt: string
  updatedAt: string
  quotasNumber: number
  __v: number
  totalForPay: number
}
