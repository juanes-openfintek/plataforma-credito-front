'use client'
import { SessionProvider, useSession } from 'next-auth/react'
import React from 'react'
import AnalystLayout from '../components/layouts/AnalystLayout/AnalystLayout'

function Analyst1LayoutContent({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const userName = session?.user?.name || 'Analista'

  return (
    <AnalystLayout analystNumber={1} userName={userName}>
      {children}
    </AnalystLayout>
  )
}

export default function Analyst1Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <Analyst1LayoutContent>{children}</Analyst1LayoutContent>
    </SessionProvider>
  )
}
