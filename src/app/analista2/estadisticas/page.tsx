'use client'
import { useState, useEffect } from 'react'
import { getCreditsAnalyst2 } from '../../services/analyst2.service'
import { CreditData } from '../../interfaces/creditData.interface'

const Analyst2StatsPage = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inReview: 0,
    returned: 0,
    approved: 0,
    rejected: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const credits = await getCreditsAnalyst2('')
      setStats({
        total: credits.length,
        pending: credits.filter((c: CreditData) => c.status === 'ANALYST1_APPROVED').length,
        inReview: credits.filter((c: CreditData) => c.status === 'ANALYST2_REVIEW').length,
        returned: credits.filter((c: CreditData) => c.status === 'ANALYST2_RETURNED').length,
        approved: credits.filter((c: CreditData) => c.status === 'ANALYST2_APPROVED').length,
        rejected: credits.filter((c: CreditData) => c.status === 'REJECTED').length,
      })
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

  const totalProcessed = stats.approved + stats.rejected
  const approvalRate = totalProcessed > 0 ? ((stats.approved / totalProcessed) * 100).toFixed(1) : '0'

  return (
    <div className='space-y-8'>
      <div>
        <h1 className='text-3xl font-bold text-gray-900'>Estadísticas - Analista</h1>
        <p className='text-gray-600 mt-1'>Métricas de análisis cualitativo</p>
      </div>

      {/* Main Stats */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-white rounded-2xl shadow-md p-6 border border-gray-100'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-lg font-semibold text-gray-700'>Total Asignados</h3>
            <span className='text-3xl'>📊</span>
          </div>
          <p className='text-4xl font-bold text-teal-600'>{stats.total}</p>
          <p className='text-sm text-gray-500 mt-2'>Créditos en gestión</p>
        </div>

        <div className='bg-white rounded-2xl shadow-md p-6 border border-gray-100'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-lg font-semibold text-gray-700'>Tasa de Aprobación</h3>
            <span className='text-3xl'>✅</span>
          </div>
          <p className='text-4xl font-bold text-green-600'>{approvalRate}%</p>
          <p className='text-sm text-gray-500 mt-2'>De créditos procesados</p>
        </div>

        <div className='bg-white rounded-2xl shadow-md p-6 border border-gray-100'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-lg font-semibold text-gray-700'>Pendientes</h3>
            <span className='text-3xl'>⏳</span>
          </div>
          <p className='text-4xl font-bold text-yellow-600'>{stats.pending + stats.inReview}</p>
          <p className='text-sm text-gray-500 mt-2'>Requieren atención</p>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className='bg-white rounded-2xl shadow-md p-6 border border-gray-100'>
        <h3 className='text-xl font-bold text-gray-900 mb-6'>Desglose por Estado</h3>
        <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
          <div className='text-center p-4 bg-blue-50 rounded-xl'>
            <p className='text-3xl font-bold text-blue-700'>{stats.pending}</p>
            <p className='text-sm text-blue-600 mt-1'>Pendientes</p>
          </div>
          <div className='text-center p-4 bg-yellow-50 rounded-xl'>
            <p className='text-3xl font-bold text-yellow-700'>{stats.inReview}</p>
            <p className='text-sm text-yellow-600 mt-1'>En Revisión</p>
          </div>
          <div className='text-center p-4 bg-green-50 rounded-xl'>
            <p className='text-3xl font-bold text-green-700'>{stats.approved}</p>
            <p className='text-sm text-green-600 mt-1'>Aprobados</p>
          </div>
          <div className='text-center p-4 bg-orange-50 rounded-xl'>
            <p className='text-3xl font-bold text-orange-700'>{stats.returned}</p>
            <p className='text-sm text-orange-600 mt-1'>Devueltos</p>
          </div>
          <div className='text-center p-4 bg-red-50 rounded-xl'>
            <p className='text-3xl font-bold text-red-700'>{stats.rejected}</p>
            <p className='text-sm text-red-600 mt-1'>Rechazados</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className='bg-white rounded-2xl shadow-md p-6 border border-gray-100'>
        <h3 className='text-xl font-bold text-gray-900 mb-4'>Progreso de Procesamiento</h3>
        <div className='space-y-4'>
          <div>
            <div className='flex justify-between mb-2'>
              <span className='text-sm font-medium text-gray-700'>Aprobados</span>
              <span className='text-sm font-medium text-green-600'>{stats.approved}</span>
            </div>
            <div className='w-full bg-gray-200 rounded-full h-3'>
              <div
                className='bg-green-500 h-3 rounded-full transition-all'
                style={{ width: `${stats.total > 0 ? (stats.approved / stats.total) * 100 : 0}%` }}
              />
            </div>
          </div>
          <div>
            <div className='flex justify-between mb-2'>
              <span className='text-sm font-medium text-gray-700'>En Proceso</span>
              <span className='text-sm font-medium text-yellow-600'>{stats.pending + stats.inReview}</span>
            </div>
            <div className='w-full bg-gray-200 rounded-full h-3'>
              <div
                className='bg-yellow-500 h-3 rounded-full transition-all'
                style={{ width: `${stats.total > 0 ? ((stats.pending + stats.inReview) / stats.total) * 100 : 0}%` }}
              />
            </div>
          </div>
          <div>
            <div className='flex justify-between mb-2'>
              <span className='text-sm font-medium text-gray-700'>Devueltos/Rechazados</span>
              <span className='text-sm font-medium text-red-600'>{stats.returned + stats.rejected}</span>
            </div>
            <div className='w-full bg-gray-200 rounded-full h-3'>
              <div
                className='bg-red-500 h-3 rounded-full transition-all'
                style={{ width: `${stats.total > 0 ? ((stats.returned + stats.rejected) / stats.total) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analyst2StatsPage

