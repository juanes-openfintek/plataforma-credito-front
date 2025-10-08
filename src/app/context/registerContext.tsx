import React, { createContext, useContext, useState } from 'react'
import { BankData } from '../interfaces/bankData.interface'

interface RegisterContextProps {
  registerData: {
    email: string
    password: string
    name: string
    lastName: string
    phoneNumber: string
    dateOfBirth: string
    documentType: string
    documentNumber: string
    accountNumber: string
    accountType: string
    accountEntity: string
  }
  errorMessage: string
  bankAllData: BankData[]
  saveUserData: (
    email: string,
    password: string,
    name: string,
    lastName: string,
    phoneNumber: string,
    dateOfBirth: string,
    documentType: string,
    documentNumber: string,
    accountType: string,
    accountNumber: string,
    accountEntity: string
  ) => void
  saveMessage: (message: string) => void
  saveBanks: (banks: BankData[]) => void
}
/**
 * RegisterContext is a context to manage the register data
 */
const RegisterContext = createContext<RegisterContextProps>({
  registerData: {
    email: '',
    password: '',
    name: '',
    lastName: '',
    phoneNumber: '',
    dateOfBirth: '',
    documentType: '',
    documentNumber: '',
    accountNumber: '',
    accountType: '',
    accountEntity: '',
  },
  errorMessage: '',
  bankAllData: [],
  saveUserData: () => {},
  saveMessage: () => {},
  saveBanks: () => {},
})

/**
 * useRegisterState is a custom hook to use the register context
 * @returns The RegisterContext instance
 */
export function useRegisterState() {
  return useContext(RegisterContext)
}

/**
 * RegisterContextProvider is a component that provides the register context
 * @returns The RegisterContextProvider component
 */
function RegisterContextProvider(props: { children: React.ReactNode }) {
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    name: '',
    lastName: '',
    phoneNumber: '',
    dateOfBirth: '',
    documentType: '',
    documentNumber: '',
    accountNumber: '',
    accountType: '',
    accountEntity: '',
  })
  const [errorMessage, setErrorMessage] = useState('')
  /**
   * Banks state
   */
  const [bankAllData, setBankAllData] = useState<BankData[]>([])
  /**
   * @description This function is used to save the user data
   * @param email - The user email
   * @param password - The user password
   * @param name - The user name
   * @param lastName - The user last name
   */
  const saveUserData = (
    email: string,
    password: string,
    name: string,
    lastName: string,
    phoneNumber: string,
    dateOfBirth: string,
    documentType: string,
    documentNumber: string,
    accountType: string,
    accountNumber: string,
    accountEntity: string
  ) => {
    setRegisterData({
      email,
      password,
      name,
      lastName,
      phoneNumber,
      dateOfBirth,
      documentType,
      documentNumber,
      accountType,
      accountNumber,
      accountEntity,
    })
  }
  /**
   * @description This function is used to save the error message
   * @param message The error message
   */
  const saveMessage = (message: string) => {
    setErrorMessage(message)
  }
  /**
   * @description This function is used to save the banks
   * @param banks The banks
   */
  const saveBanks = (banks: BankData[]) => {
    setBankAllData(banks)
  }
  return (
    <RegisterContext.Provider
      value={{ registerData, errorMessage, bankAllData, saveUserData, saveMessage, saveBanks }}
    >
      {props.children}
    </RegisterContext.Provider>
  )
}

export { RegisterContext, RegisterContextProvider }
