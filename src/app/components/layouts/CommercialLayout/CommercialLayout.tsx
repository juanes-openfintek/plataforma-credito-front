'use client'
import React, { ReactNode } from 'react'
import Image from 'next/image'
import { useCommercialAuth } from '../../../context/CommercialAuthContext'

interface CommercialLayoutProps {
  children: ReactNode
  activeModule: 'dashboard' | 'control' | 'creacion'
  onModuleChange: (module: 'dashboard' | 'control' | 'creacion') => void
}

const CommercialLayout = ({ children, activeModule, onModuleChange }: CommercialLayoutProps) => {
  const { user, logout } = useCommercialAuth()

  return (
    <div className='flex min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50'>
      {/* Sidebar Navigation */}
      <aside className='w-72 bg-gradient-to-b from-purple-700 to-purple-900 shadow-2xl relative flex flex-col'>
        {/* Logo/Brand */}
        <div className='p-8 flex items-center justify-center'>
          <Image
            src='/images/openfintek-logo.png'
            alt='Openfintek'
            width={180}
            height={60}
            className='object-contain'
            priority
          />
        </div>

        {/* Navigation */}
        <nav className='px-6 space-y-3 flex-1 mt-8'>
          <button
            onClick={() => onModuleChange('dashboard')}
            className={`w-full flex flex-col items-center justify-center gap-3 px-6 py-6 rounded-2xl transition-all duration-300 ${
              activeModule === 'dashboard'
                ? 'bg-white text-purple-700 shadow-lg'
                : 'text-purple-100 hover:bg-purple-600/50'
            }`}
          >
            <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' />
            </svg>
            <span className={`text-sm font-semibold ${activeModule === 'dashboard' ? 'text-purple-700' : 'text-white'}`}>
              Inicio
            </span>
          </button>

          <button
            onClick={() => onModuleChange('creacion')}
            className={`w-full flex flex-col items-center justify-center gap-3 px-6 py-6 rounded-2xl transition-all duration-300 ${
              activeModule === 'creacion'
                ? 'bg-white text-purple-700 shadow-lg'
                : 'text-purple-100 hover:bg-purple-600/50'
            }`}
          >
            <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
            </svg>
            <span className={`text-sm font-semibold ${activeModule === 'creacion' ? 'text-purple-700' : 'text-white'}`}>
              Nuevo crédito
            </span>
          </button>

          <button
            onClick={() => onModuleChange('control')}
            className={`w-full flex flex-col items-center justify-center gap-3 px-6 py-6 rounded-2xl transition-all duration-300 ${
              activeModule === 'control'
                ? 'bg-white text-purple-700 shadow-lg'
                : 'text-purple-100 hover:bg-purple-600/50'
            }`}
          >
            <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
            </svg>
            <span className={`text-sm font-semibold ${activeModule === 'control' ? 'text-purple-700' : 'text-white'}`}>
              Créditos
            </span>
          </button>
        </nav>

        {/* User Profile Footer */}
        <div className='p-6 border-t border-purple-600'>
          <button
            onClick={() => onModuleChange('dashboard')}
            className='w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-purple-600/50 transition-all mb-3'
          >
            <svg className='w-5 h-5 text-purple-200' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
            </svg>
            <span className='text-purple-200 text-sm font-medium'>Perfil</span>
          </button>

          <button
            onClick={logout}
            className='w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-purple-600/50 transition-all'
          >
            <svg className='w-5 h-5 text-purple-200' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
            </svg>
            <span className='text-purple-200 text-sm font-medium'>Salir</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className='flex-1 p-8 overflow-auto'>
        <div className='max-w-7xl mx-auto'>
          {children}
        </div>
      </main>
    </div>
  )
}

export default CommercialLayout
