'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CommercialAuthProvider, useCommercialAuth } from '../context/CommercialAuthContext'
import CommercialLayout from '../components/layouts/CommercialLayout/CommercialLayout'
import ControlModule from '../components/modules/comercial/ControlModule/ControlModule'
import CreacionModule from '../components/modules/comercial/CreacionModule/CreacionModule'
import DashboardModule from '../components/modules/comercial/DashboardModule/DashboardModule'

function CommercialPortalContent() {
  const [activeModule, setActiveModule] = useState<'dashboard' | 'control' | 'creacion'>('dashboard')
  const { isAuthenticated, loading } = useCommercialAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/registro-comercial')
    }
  }, [isAuthenticated, loading, router])

  if (loading || !isAuthenticated) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-color/10 to-accent-color/10'>
        <div className='text-center'>
          <div className='w-16 h-16 border-4 border-primary-color border-t-accent-color rounded-full animate-spin mx-auto mb-4'></div>
          <p className='text-gray-600 font-semibold'>Cargando portal comercial...</p>
        </div>
      </div>
    )
  }

  return (
    <CommercialLayout activeModule={activeModule} onModuleChange={setActiveModule}>
      {activeModule === 'dashboard' && <DashboardModule />}
      {activeModule === 'control' && <ControlModule />}
      {activeModule === 'creacion' && <CreacionModule />}
    </CommercialLayout>
  )
}

export default function CommercialPortal() {
  return (
    <CommercialAuthProvider>
      <CommercialPortalContent />
    </CommercialAuthProvider>
  )
}
