'use client'
import React, { createContext, useContext, useState } from 'react'
import { Taxes } from '../interfaces/taxes.interface'

interface CreditContextProps {
  creditTaxes: Taxes[]
  amount: number
  time: number
  showForm: boolean
  updateTaxesData: (
    creditRangesTaxes: Taxes[]
  ) => void
  updateAmount: (amount: number) => void
  updateTime: (time: number) => void
  updateShowForm: (showForm: boolean) => void
}
/**
 * CreditContext is a context to manage the credit calculation data
 */
const CreditContext = createContext<CreditContextProps>({
  creditTaxes: [
    {
      id: '',
      minAmount: 0,
      maxAmount: 0,
      emPercentage: 0,
      eaPercentage: 0,
      interestPercentage: 0,
      insurancePercentage: 0,
      administrationPercentage: 0,
      ivaPercentage: 0,
    },
  ],
  amount: 0,
  time: 0,
  showForm: false,
  updateTaxesData: () => {},
  updateAmount: () => {},
  updateTime: () => {},
  updateShowForm: () => {}
})

/**
 * useCreditState is a custom hook to use the credit context
 * @returns The CreditContext instance
 */
export function useCreditState() {
  return useContext(CreditContext)
}

/**
 * CreditContextProvider is a component that provides the credit calculation context
 * @returns The CreditContextProvider component
 */
function CreditContextProvider(props: { children: React.ReactNode }) {
  const [creditTaxes, setCreditTaxes] = useState([
    {
      id: '',
      minAmount: 0,
      maxAmount: 0,
      emPercentage: 0,
      eaPercentage: 0,
      interestPercentage: 0,
      insurancePercentage: 0,
      administrationPercentage: 0,
      ivaPercentage: 0,
    },
  ])
  const [amount, setAmount] = useState(0)
  const [time, setTime] = useState(0)
  const [showForm, setShowForm] = useState(false)
  /**
   * updateTaxesData is a function to update the taxes data state
   * @param creditRangesTaxes - The taxes data to update
   */
  const updateTaxesData = (creditRangesTaxes: Taxes[]) => {
    setCreditTaxes(creditRangesTaxes)
  }
  /**
   * updateAmount is a function to update the amount state
   * @param newAmount - The amount to update
   */
  const updateAmount = (newAmount: number) => {
    setAmount(newAmount)
  }
  /**
   * updateTime is a function to update the time state
   * @param time - The time to update
   */
  const updateTime = (time: number) => {
    setTime(time)
  }
  /**
   * updateShowForm is a function to update the showForm state
   * @param showForm - The showForm to update
   */
  const updateShowForm = (showForm: boolean) => {
    setShowForm(showForm)
  }

  return (
    <CreditContext.Provider
      value={{
        amount,
        time,
        creditTaxes,
        showForm,
        updateTaxesData,
        updateAmount,
        updateTime,
        updateShowForm
      }}
    >
      {props.children}
    </CreditContext.Provider>
  )
}

export { CreditContext, CreditContextProvider }
