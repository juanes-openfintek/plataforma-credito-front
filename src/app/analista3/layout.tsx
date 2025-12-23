'use client'
import { SessionProvider, useSession } from 'next-auth/react'
import React from 'react'
import AnalystLayout from '../components/layouts/AnalystLayout/AnalystLayout'

function Analyst3LayoutContent({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const userName = session?.user?.name || 'Analista'

  return (
    <AnalystLayout analystNumber={3} userName={userName}>
      {children}
    </AnalystLayout>
  )
}

export default function Analyst3Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <Analyst3LayoutContent>{children}</Analyst3LayoutContent>
    </SessionProvider>
  )
}
