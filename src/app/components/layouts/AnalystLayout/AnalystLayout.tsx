'use client'
import React, { ReactNode } from 'react'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

interface AnalystLayoutProps {
  children: ReactNode
  analystNumber: 1 | 2 | 3
  userName?: string
}

const AnalystLayout = ({ children, analystNumber, userName }: AnalystLayoutProps) => {
  const router = useRouter()
  const pathname = usePathname()

  const basePath = `/analista${analystNumber}`

  const getAnalystTitle = () => {
    switch (analystNumber) {
      case 1:
        return 'Validación Inicial'
      case 2:
        return 'Análisis Cualitativo'
      case 3:
        return 'Preaprobación y Documentos'
      default:
        return 'Analista'
    }
  }

  const getAnalystColor = () => {
    switch (analystNumber) {
      case 1:
        return {
          gradient: 'from-blue-600 to-blue-800',
          hover: 'hover:bg-blue-600/50',
          active: 'bg-white text-blue-700',
          border: 'border-blue-500',
        }
      case 2:
        return {
          gradient: 'from-teal-600 to-teal-800',
          hover: 'hover:bg-teal-600/50',
          active: 'bg-white text-teal-700',
          border: 'border-teal-500',
        }
      case 3:
        return {
          gradient: 'from-purple-600 to-purple-800',
          hover: 'hover:bg-purple-600/50',
          active: 'bg-white text-purple-700',
          border: 'border-purple-500',
        }
      default:
        return {
          gradient: 'from-gray-600 to-gray-800',
          hover: 'hover:bg-gray-600/50',
          active: 'bg-white text-gray-700',
          border: 'border-gray-500',
        }
    }
  }

  const colors = getAnalystColor()

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Inicio',
      path: basePath,
      icon: (
        <svg className='w-7 h-7' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' />
        </svg>
      ),
    },
    {
      id: 'creditos',
      label: 'Créditos',
      path: `${basePath}/creditos`,
      icon: (
        <svg className='w-7 h-7' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
        </svg>
      ),
    },
  ]

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/login' })
  }

  const isActive = (path: string) => {
    if (path === basePath) {
      return pathname === path
    }
    return pathname.startsWith(path)
  }

  return (
    <div className='flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100'>
      {/* Sidebar Navigation */}
      <aside className={`w-72 bg-gradient-to-b ${colors.gradient} shadow-2xl relative flex flex-col`}>
        {/* Logo/Brand */}
        <div className='p-6 flex items-center justify-center border-b border-white/20'>
          <Image
            src='/images/letras_openfintek.png'
            alt='OpenFintek'
            width={160}
            height={50}
            className='object-contain'
            priority
          />
        </div>

        {/* Analyst Info */}
        <div className='px-6 py-4 border-b border-white/20'>
          <div className='bg-white/10 rounded-xl p-4'>
            <p className='text-white/70 text-xs font-medium uppercase tracking-wider'>Rol Actual</p>
            <p className='text-white font-bold text-lg mt-1'>Analista</p>
            <p className='text-white/80 text-sm'>{getAnalystTitle()}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className='px-4 space-y-2 flex-1 mt-4'>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => router.push(item.path)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 ${
                isActive(item.path)
                  ? `${colors.active} shadow-lg`
                  : `text-white/90 ${colors.hover}`
              }`}
            >
              {item.icon}
              <span className='font-semibold'>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Profile Footer */}
        <div className='p-4 border-t border-white/20'>
          {userName && (
            <div className='flex items-center gap-3 px-4 py-3 mb-2'>
              <div className='w-10 h-10 rounded-full bg-white/20 flex items-center justify-center'>
                <span className='text-white font-bold text-lg'>
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className='text-white font-semibold text-sm'>{userName}</p>
                <p className='text-white/60 text-xs'>Analista</p>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${colors.hover} transition-all`}
          >
            <svg className='w-5 h-5 text-white/80' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
            </svg>
            <span className='text-white/80 text-sm font-medium'>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className='flex-1 overflow-auto'>
        <div className='p-8'>
          {children}
        </div>
      </main>
    </div>
  )
}

export default AnalystLayout

