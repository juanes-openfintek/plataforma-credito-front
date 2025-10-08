'use client'
import { SessionProvider } from 'next-auth/react'
import React from 'react'
import MenuUser from '../components/molecules/MenuUser/MenuUser'
export default function DisburserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <SessionProvider>
        <MenuUser />
        {children}
      </SessionProvider>
    </div>
  )
}
