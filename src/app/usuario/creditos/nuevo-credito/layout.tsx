'use client'
import React from 'react'
import { CreditContextProvider } from '../../../context/creditContext'
export default function NewCreditPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <CreditContextProvider>
        {children}
      </CreditContextProvider>
    </div>
  )
}
