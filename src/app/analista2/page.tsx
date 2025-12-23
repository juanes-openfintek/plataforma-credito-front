'use client'
import { useState, useEffect } from 'react'
import { getCreditsAnalyst2 } from '../services/analyst2.service'
import { CreditData } from '../interfaces/creditData.interface'
import { mapToSimplifiedStatus, CreditStatus } from '../constants/CreditStatusesProperties'

const Analyst2Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    radicados: 0,
    enEstudio: 0,
    devueltos: 0,
    rechazados: 0,
    desembolsados: 0,
  })
  const [loading, setLoading] = useState(true)
  const [recentCredits, setRecentCredits] = useState<CreditData[]>([])

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const credits = await getCreditsAnalyst2('')
      
      const radicados = credits.filter((c: CreditData) => 
        mapToSimplifiedStatus(c.status) === CreditStatus.RADICADO
      ).length
      const enEstudio = credits.filter((c: CreditData) => 
        mapToSimplifiedStatus(c.status) === CreditStatus.EN_ESTUDIO
      ).length
      const devueltos = credits.filter((c: CreditData) => 
        mapToSimplifiedStatus(c.status) === CreditStatus.DEVUELTO
      ).length
      const rechazados = credits.filter((c: CreditData) => 
        mapToSimplifiedStatus(c.status) === CreditStatus.RECHAZADO
      ).length
      const desembolsados = credits.filter((c: CreditData) => 
        mapToSimplifiedStatus(c.status) === CreditStatus.DESEMBOLSADO
      ).length
      
      setStats({
        total: credits.length,
        radicados,
        enEstudio,
        devueltos,
        rechazados,
        desembolsados,
      })
      setRecentCredits(credits.slice(0, 5))
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin' />
      </div>
    )
  }

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div>
        <h1 className='text-3xl font-bold text-gray-900'>Panel de Analista</h1>
        <p className='text-gray-600 mt-1'>Análisis cualitativo y verificación de referencias</p>
      </div>

      {/* Pipeline de Estados Simplificados */}
      <div className='bg-white rounded-2xl shadow-md p-6 border border-gray-100'>
        <h3 className='text-xl font-bold text-gray-900 mb-6'>Estado de Créditos</h3>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
          <div className='text-center p-4 bg-blue-50 rounded-xl border-2 border-blue-200'>
            <p className='text-3xl font-bold text-blue-700'>{stats.radicados}</p>
            <p className='text-sm text-blue-600 mt-1 font-semibold'>Radicados</p>
          </div>
          <div className='text-center p-4 bg-yellow-50 rounded-xl border-2 border-yellow-200'>
            <p className='text-3xl font-bold text-yellow-700'>{stats.enEstudio}</p>
            <p className='text-sm text-yellow-600 mt-1 font-semibold'>En estudio</p>
          </div>
          <div className='text-center p-4 bg-orange-50 rounded-xl border-2 border-orange-200'>
            <p className='text-3xl font-bold text-orange-700'>{stats.devueltos}</p>
            <p className='text-sm text-orange-600 mt-1 font-semibold'>Devueltos</p>
          </div>
          <div className='text-center p-4 bg-red-50 rounded-xl border-2 border-red-200'>
            <p className='text-3xl font-bold text-red-700'>{stats.rechazados}</p>
            <p className='text-sm text-red-600 mt-1 font-semibold'>Rechazados</p>
          </div>
          <div className='text-center p-4 bg-green-50 rounded-xl border-2 border-green-200'>
            <p className='text-3xl font-bold text-green-700'>{stats.desembolsados}</p>
            <p className='text-sm text-green-600 mt-1 font-semibold'>Desembolsados</p>
          </div>
          <div className='text-center p-4 bg-gray-50 rounded-xl border-2 border-gray-200'>
            <p className='text-3xl font-bold text-gray-700'>{stats.total}</p>
            <p className='text-sm text-gray-600 mt-1 font-semibold'>Total</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className='bg-white rounded-2xl shadow-md p-6 border border-gray-100'>
        <h2 className='text-xl font-bold text-gray-900 mb-4'>Acciones Rápidas</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <a
            href='/analista2/creditos'
            className='flex items-center gap-4 p-4 bg-teal-50 rounded-xl hover:bg-teal-100 transition-colors border border-teal-200'
          >
            <div className='bg-teal-500 p-3 rounded-lg'>
              <svg className='w-6 h-6 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
              </svg>
            </div>
            <div>
              <p className='font-semibold text-gray-900'>Ver Créditos</p>
              <p className='text-sm text-gray-600'>Gestionar solicitudes</p>
            </div>
          </a>

          <div className='flex items-center gap-4 p-4 bg-purple-50 rounded-xl border border-purple-200'>
            <div className='bg-purple-500 p-3 rounded-lg'>
              <svg className='w-6 h-6 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
            </div>
            <div>
              <p className='font-semibold text-gray-900'>Tu Rol</p>
              <p className='text-sm text-gray-600'>Referencias y asegurabilidad</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Credits */}
      {recentCredits.length > 0 && (
        <div className='bg-white rounded-2xl shadow-md p-6 border border-gray-100'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-xl font-bold text-gray-900'>Créditos Recientes</h2>
            <a href='/analista2/creditos' className='text-teal-600 hover:text-teal-800 font-semibold text-sm'>
              Ver todos →
            </a>
          </div>
          <div className='space-y-3'>
            {recentCredits.map((credit) => (
              <div
                key={credit._id}
                className='flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors'
              >
                <div>
                  <p className='font-semibold text-gray-900'>
                    {credit.name} {credit.lastname}
                  </p>
                  <p className='text-sm text-gray-600'>Doc: {credit.documentNumber}</p>
                </div>
                <div className='text-right'>
                  <p className='font-bold text-teal-600'>
                    ${Number(credit.amount).toLocaleString('es-CO')}
                  </p>
                  {(() => {
                    const simplified = mapToSimplifiedStatus(credit.status)
                    const colorMap: Record<string, string> = {
                      [CreditStatus.RADICADO]: 'bg-blue-100 text-blue-800',
                      [CreditStatus.EN_ESTUDIO]: 'bg-yellow-100 text-yellow-800',
                      [CreditStatus.DEVUELTO]: 'bg-orange-100 text-orange-800',
                      [CreditStatus.RECHAZADO]: 'bg-red-100 text-red-800',
                      [CreditStatus.DESEMBOLSADO]: 'bg-green-100 text-green-800',
                    }
                    const labelMap: Record<string, string> = {
                      [CreditStatus.RADICADO]: 'Radicado',
                      [CreditStatus.EN_ESTUDIO]: 'En estudio',
                      [CreditStatus.DEVUELTO]: 'Devuelto',
                      [CreditStatus.RECHAZADO]: 'Rechazado',
                      [CreditStatus.DESEMBOLSADO]: 'Desembolsado',
                    }
                    return (
                      <span className={`text-xs px-2 py-1 rounded-full ${colorMap[simplified] || 'bg-gray-100 text-gray-800'}`}>
                        {labelMap[simplified] || simplified}
                      </span>
                    )
                  })()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Analyst2Dashboard
