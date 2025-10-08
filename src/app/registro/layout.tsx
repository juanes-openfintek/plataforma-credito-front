'use client'
import React from 'react'
import { RegisterContextProvider } from '../context/registerContext'
import { SessionProvider } from 'next-auth/react'
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <SessionProvider>
        <RegisterContextProvider>{children}</RegisterContextProvider>
      </SessionProvider>
    </div>
  )
}
