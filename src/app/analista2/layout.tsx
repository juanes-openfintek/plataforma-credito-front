'use client'
import { SessionProvider, useSession } from 'next-auth/react'
import React from 'react'
import AnalystLayout from '../components/layouts/AnalystLayout/AnalystLayout'

function Analyst2LayoutContent({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const userName = session?.user?.name || 'Analista'

  return (
    <AnalystLayout analystNumber={2} userName={userName}>
      {children}
    </AnalystLayout>
  )
}

export default function Analyst2Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <Analyst2LayoutContent>{children}</Analyst2LayoutContent>
    </SessionProvider>
  )
}
