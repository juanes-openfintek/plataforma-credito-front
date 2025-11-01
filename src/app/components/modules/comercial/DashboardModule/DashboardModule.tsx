'use client'
import React, { useState, useEffect } from 'react'
import { useCommercialAuth } from '../../../../context/CommercialAuthContext'
import { getCommercialStats } from '../../../../services/commercialSimulation'

interface DashboardStats {
  totalClients: number
  statusBreakdown: {
    radicados: number
    'en-progreso': number
    aprobado: number
    rechazado: number
    iniciado: number
    completado: number
    desembolsado: number
  }
  totalCreditRequested: number
  approvedCredits: number
  disbursedAmount: number
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

const CommercialDashboard = () => {
  const { isAuthenticated } = useCommercialAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      if (!isAuthenticated) return
      
      try {
        const data = await getCommercialStats()
        setStats(data)
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [isAuthenticated])

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='w-12 h-12 border-4 border-primary-color border-t-accent-color rounded-full animate-spin'></div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className='bg-white rounded-lg shadow-md p-8 text-center'>
        <p className='text-gray-600'>No se pudieron cargar las estadísticas</p>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Créditos Radicados',
      value: stats.statusBreakdown.radicados,
      color: 'from-blue-500 to-blue-600',
      icon: '📋',
      description: 'Solicitudes en proceso',
    },
    {
      title: 'En Proceso',
      value: stats.statusBreakdown['en-progreso'],
      color: 'from-yellow-500 to-yellow-600',
      icon: '⚙️',
      description: 'En revisión',
    },
    {
      title: 'Aprobados',
      value: stats.statusBreakdown.aprobado,
      color: 'from-green-500 to-green-600',
      icon: '✅',
      description: 'Créditos aprobados',
    },
    {
      title: 'Rechazados',
      value: stats.statusBreakdown.rechazado,
      color: 'from-red-500 to-red-600',
      icon: '❌',
      description: 'Solicitudes rechazadas',
    },
  ]

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='mb-8'>
        <h2 className='text-4xl font-bold text-gray-900 mb-2'>Créditos</h2>
        <button className='mt-4 flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl'>
          <span className='text-xl'>+</span>
          Nuevo crédito
        </button>
      </div>

      {/* Tabs-like sections */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
        {/* Créditos Activos */}
        <div className='bg-white rounded-2xl shadow-md p-6 border border-purple-100'>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='text-lg font-bold text-gray-900'>Créditos activos</h3>
            <span className='text-sm text-gray-500'>Ver todos</span>
          </div>
          {stats?.statusBreakdown && (
            <div className='space-y-3'>
              {[
                { label: 'Valor crédito', value: formatCurrency(stats.totalCreditRequested), date: '12/04/2022' },
                { label: 'Valor crédito', value: formatCurrency(240000), date: '12/04/2022' },
              ].map((item, idx) => (
                <div key={idx} className='flex justify-between items-center py-3 border-b border-gray-100 last:border-0'>
                  <div>
                    <p className='text-sm font-semibold text-gray-800'>{item.label}</p>
                    <p className='text-xs text-gray-500'>Fecha límite de pago</p>
                  </div>
                  <div className='text-right'>
                    <p className='text-sm font-bold text-gray-900'>{item.value}</p>
                    <p className='text-xs text-gray-500'>{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagos Pendientes */}
        <div className='bg-purple-50 rounded-2xl shadow-md p-6 border border-purple-200'>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='text-lg font-bold text-gray-900'>Pagos pendientes</h3>
          </div>
          <div className='bg-white rounded-xl p-4 mb-4'>
            <div className='flex justify-between items-center mb-3'>
              <p className='text-2xl font-bold text-purple-600'>{formatCurrency(123420)}</p>
              <span className='px-3 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-full'>Vencida</span>
            </div>
            <p className='text-xs text-gray-500 mb-3'>02/05/2022</p>
            <p className='text-xs text-gray-500 mb-3'>Crédito No. 123131</p>
            <button className='w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors'>
              Pagar
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards - Compact Version */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
        {statCards.map((stat, index) => (
          <div
            key={index}
            className='bg-white rounded-xl shadow-md p-5 border border-gray-100 hover:shadow-lg transition-all duration-300'
          >
            <div className='flex items-center justify-between mb-2'>
              <div className='text-3xl'>{stat.icon}</div>
              <p className='text-2xl font-bold text-gray-900'>{stat.value}</p>
            </div>
            <p className='text-sm text-gray-600 font-medium'>{stat.title}</p>
            <p className='text-xs text-gray-400 mt-1'>{stat.description}</p>
          </div>
        ))}
      </div>

      {/* Historial de créditos */}
      <div className='bg-white rounded-2xl shadow-md p-6 border border-gray-100'>
        <h3 className='text-xl font-bold text-gray-900 mb-6'>Historial de créditos</h3>
        <div className='space-y-4'>
          {[
            { id: '123131', status: 'En espera', statusColor: 'bg-yellow-100 text-yellow-700', icon: '⏳', amount: 123420, date: '02/05/2022' },
            { id: '123131', status: 'Activo', statusColor: 'bg-green-100 text-green-700', icon: '✓', amount: 123420, date: '02/05/2022' },
            { id: '123131', status: 'Rechazado', statusColor: 'bg-red-100 text-red-700', icon: '✗', amount: 123420, date: '02/05/2022' },
          ].map((credit, idx) => (
            <div key={idx} className='flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer'>
              <div className='flex items-center gap-4'>
                <div className={`w-12 h-12 rounded-xl ${credit.statusColor.split(' ')[0]} flex items-center justify-center text-2xl`}>
                  {credit.icon}
                </div>
                <div>
                  <p className='font-semibold text-gray-900'>Crédito No. {credit.id}</p>
                  <p className='text-sm text-gray-500'>ESTADO <span className={`font-semibold ${credit.statusColor}`}>{credit.status}</span></p>
                </div>
              </div>
              <div className='text-right'>
                <p className='font-bold text-gray-900'>{formatCurrency(credit.amount)}</p>
                <p className='text-sm text-gray-500'>{credit.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CommercialDashboard


