'use client'
import React, { useState, useEffect } from 'react'
import { useCommercialAuth } from '../../../../context/CommercialAuthContext'
import { getCommercialStats } from '../../../../services/commercialSimulation'
import { getClientes, getRadicatedCredits } from '../../../../services/commercialClientes'
import { mapToSimplifiedStatus, CreditStatus } from '../../../../constants/CreditStatusesProperties'

interface DashboardStats {
  totalClients: number
  statusBreakdown: {
    perfilados: number
    radicados: number
    enEstudio: number
    devueltos: number
    rechazados: number
    desembolsados: number
  }
  totalCreditRequested: number
  approvedCredits: number
  disbursedAmount: number
}

interface ClienteData {
  _id: string
  firstName: string
  lastName: string
  identificationNumber: string
  phone: string
  status: string
  createdAt: string
  creditAmount?: number
  completionPercentage: number
}

interface RadicatedCredit {
  _id: string
  status: string
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
  const { isAuthenticated, user } = useCommercialAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [clientes, setClientes] = useState<ClienteData[]>([])
  const [radicatedCredits, setRadicatedCredits] = useState<RadicatedCredit[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) return
      
      try {
        const [statsData, clientesData, radicatedCreditsData] = await Promise.all([
          getCommercialStats(),
          getClientes(),
          getRadicatedCredits(),
        ])
        setStats(statsData)
        setClientes(clientesData || [])
        setRadicatedCredits((radicatedCreditsData || []) as RadicatedCredit[])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [isAuthenticated])

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='w-12 h-12 border-4 border-primary-color border-t-accent-color rounded-full animate-spin'></div>
      </div>
    )
  }

  // Calcular estadísticas con los nuevos estados simplificados
  const totalClientes = clientes.length
  
  // Perfilados: iniciado, en-progreso, completado (no radicados)
  const clientesPerfilados = clientes.filter(c => 
    ['iniciado', 'en-progreso', 'completado'].includes(c.status) ||
    mapToSimplifiedStatus(c.status) === CreditStatus.PERFILADO
  ).length
  
  // Radicados
  const clientesRadicados = clientes.filter(c => 
    c.status === 'radicado' || 
    mapToSimplifiedStatus(c.status) === CreditStatus.RADICADO
  ).length
  
  // En estudio (cualquier estado de análisis)
  const clientesEnEstudio = clientes.filter(c => 
    c.status === 'aprobado' || // legacy
    mapToSimplifiedStatus(c.status) === CreditStatus.EN_ESTUDIO
  ).length
  
  // Devueltos
  const clientesDevueltos = clientes.filter(c => 
    mapToSimplifiedStatus(c.status) === CreditStatus.DEVUELTO
  ).length
  
  // Rechazados
  const clientesRechazados = clientes.filter(c => 
    c.status === 'rechazado' ||
    mapToSimplifiedStatus(c.status) === CreditStatus.RECHAZADO
  ).length
  
  // Desembolsados
  const clientesDesembolsados = clientes.filter(c => 
    c.status === 'desembolsado' ||
    mapToSimplifiedStatus(c.status) === CreditStatus.DESEMBOLSADO
  ).length

  // Calcular montos reales
  const montoTotalSolicitado = clientes.reduce((acc, c) => acc + (c.creditAmount || 0), 0)
  const montoDesembolsado = clientes
    .filter(c => c.status === 'desembolsado' || mapToSimplifiedStatus(c.status) === CreditStatus.DESEMBOLSADO)
    .reduce((acc, c) => acc + (c.creditAmount || 0), 0)

  // Obtener créditos recientes reales
  const creditosRecientes = clientes
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  const countByStatuses = (statuses: string[]) =>
    radicatedCredits.filter((c) => statuses.includes(c.status)).length

  // Trazabilidad por analista (basado en estados internos del crédito)
  const analyst1Queue = countByStatuses(['SUBMITTED'])
  const analyst1Working = countByStatuses(['ANALYST1_REVIEW', 'ANALYST1_VERIFICATION'])
  const analyst1Returned = countByStatuses(['ANALYST1_RETURNED', 'ANALYST2_RETURNED', 'COMMERCIAL_RETURNED'])
  const analyst1Approved = countByStatuses(['ANALYST1_APPROVED'])

  const analyst2Queue = countByStatuses(['ANALYST1_APPROVED'])
  const analyst2Working = countByStatuses(['ANALYST2_REVIEW', 'ANALYST2_VERIFICATION'])
  const analyst2Returned = countByStatuses(['ANALYST2_RETURNED', 'ANALYST3_RETURNED', 'COMMERCIAL_RETURNED'])
  const analyst2Approved = countByStatuses(['ANALYST2_APPROVED'])

  const analyst3Queue = countByStatuses(['ANALYST2_APPROVED'])
  const analyst3Working = countByStatuses(['ANALYST3_REVIEW', 'ANALYST3_VERIFICATION'])
  const analyst3Returned = countByStatuses(['ANALYST3_RETURNED', 'COMMERCIAL_RETURNED'])
  const analyst3Approved = countByStatuses(['ANALYST3_APPROVED', 'PENDING_SIGNATURE', 'READY_TO_DISBURSE'])

  const getStatusColor = (status: string) => {
    const simplified = mapToSimplifiedStatus(status)
    switch (simplified) {
      case CreditStatus.PERFILADO: return 'bg-purple-100 text-purple-700'
      case CreditStatus.RADICADO: return 'bg-blue-100 text-blue-700'
      case CreditStatus.EN_ESTUDIO: return 'bg-yellow-100 text-yellow-700'
      case CreditStatus.DEVUELTO: return 'bg-orange-100 text-orange-700'
      case CreditStatus.RECHAZADO: return 'bg-red-100 text-red-700'
      case CreditStatus.DESEMBOLSADO: return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusLabel = (status: string) => {
    const simplified = mapToSimplifiedStatus(status)
    switch (simplified) {
      case CreditStatus.PERFILADO: return 'Perfilado'
      case CreditStatus.RADICADO: return 'Radicado'
      case CreditStatus.EN_ESTUDIO: return 'En estudio'
      case CreditStatus.DEVUELTO: return 'Devuelto'
      case CreditStatus.RECHAZADO: return 'Rechazado'
      case CreditStatus.DESEMBOLSADO: return 'Desembolsado'
      default: return status
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  // Calcular tasa de conversión (desembolsados / total)
  const tasaConversion = totalClientes > 0 
    ? ((clientesDesembolsados) / totalClientes * 100).toFixed(1)
    : '0'

  // Calcular promedio de crédito
  const promedioCredito = totalClientes > 0 
    ? montoTotalSolicitado / totalClientes
    : 0

  return (
    <div className='space-y-6'>
      {/* Header con saludo */}
      <div className='mb-8'>
        <h2 className='text-4xl font-bold text-gray-900 mb-2'>
          ¡Hola{user?.name ? `, ${user.name}` : ''}! 👋
        </h2>
        <p className='text-gray-600'>Este es el resumen de tu actividad comercial</p>
      </div>

      {/* Tarjetas principales de métricas */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <div className='bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-blue-100 text-sm font-medium'>Total Clientes</p>
              <p className='text-3xl font-bold mt-1'>{totalClientes}</p>
            </div>
            <div className='bg-white/20 p-3 rounded-xl'>
              <svg className='w-8 h-8' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' />
              </svg>
            </div>
          </div>
          <p className='text-blue-100 text-xs mt-3'>
            {clientesPerfilados} perfilados
          </p>
        </div>

        <div className='bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-green-100 text-sm font-medium'>Monto Solicitado</p>
              <p className='text-2xl font-bold mt-1'>{formatCurrency(montoTotalSolicitado)}</p>
            </div>
            <div className='bg-white/20 p-3 rounded-xl'>
              <svg className='w-8 h-8' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
            </div>
          </div>
          <p className='text-green-100 text-xs mt-3'>
            Promedio: {formatCurrency(promedioCredito)}
          </p>
        </div>

        <div className='bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-purple-100 text-sm font-medium'>Desembolsado</p>
              <p className='text-2xl font-bold mt-1'>{formatCurrency(montoDesembolsado)}</p>
            </div>
            <div className='bg-white/20 p-3 rounded-xl'>
              <svg className='w-8 h-8' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
            </div>
          </div>
          <p className='text-purple-100 text-xs mt-3'>
            {clientesDesembolsados} créditos desembolsados
          </p>
        </div>

        <div className='bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-orange-100 text-sm font-medium'>Tasa de Conversión</p>
              <p className='text-3xl font-bold mt-1'>{tasaConversion}%</p>
            </div>
            <div className='bg-white/20 p-3 rounded-xl'>
              <svg className='w-8 h-8' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' />
              </svg>
            </div>
          </div>
          <p className='text-orange-100 text-xs mt-3'>
            Desembolsados / Total
          </p>
        </div>
      </div>

      {/* Pipeline de Créditos con nuevos estados */}
      <div className='bg-white rounded-2xl shadow-md p-6 border border-gray-100'>
        <h3 className='text-xl font-bold text-gray-900 mb-6'>Pipeline de Créditos</h3>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
          <div className='text-center p-4 bg-purple-50 rounded-xl border-2 border-purple-200'>
            <p className='text-3xl font-bold text-purple-700'>{clientesPerfilados}</p>
            <p className='text-sm text-purple-600 mt-1 font-semibold'>Perfilados</p>
            <p className='text-xs text-purple-500 mt-1'>Sin radicar</p>
          </div>
          <div className='text-center p-4 bg-blue-50 rounded-xl border-2 border-blue-200'>
            <p className='text-3xl font-bold text-blue-700'>{clientesRadicados}</p>
            <p className='text-sm text-blue-600 mt-1 font-semibold'>Radicados</p>
            <p className='text-xs text-blue-500 mt-1'>En fábrica</p>
          </div>
          <div className='text-center p-4 bg-yellow-50 rounded-xl border-2 border-yellow-200'>
            <p className='text-3xl font-bold text-yellow-700'>{clientesEnEstudio}</p>
            <p className='text-sm text-yellow-600 mt-1 font-semibold'>En estudio</p>
            <p className='text-xs text-yellow-500 mt-1'>Analizando</p>
          </div>
          <div className='text-center p-4 bg-orange-50 rounded-xl border-2 border-orange-200'>
            <p className='text-3xl font-bold text-orange-700'>{clientesDevueltos}</p>
            <p className='text-sm text-orange-600 mt-1 font-semibold'>Devueltos</p>
            <p className='text-xs text-orange-500 mt-1'>Requieren acción</p>
          </div>
          <div className='text-center p-4 bg-red-50 rounded-xl border-2 border-red-200'>
            <p className='text-3xl font-bold text-red-700'>{clientesRechazados}</p>
            <p className='text-sm text-red-600 mt-1 font-semibold'>Rechazados</p>
            <p className='text-xs text-red-500 mt-1'>No aprobados</p>
          </div>
          <div className='text-center p-4 bg-green-50 rounded-xl border-2 border-green-200'>
            <p className='text-3xl font-bold text-green-700'>{clientesDesembolsados}</p>
            <p className='text-sm text-green-600 mt-1 font-semibold'>Desembolsados</p>
            <p className='text-xs text-green-500 mt-1'>Completados</p>
          </div>
        </div>
      </div>

      {/* Dos columnas: Créditos recientes y Datos del mercado */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Créditos activos recientes */}
        <div className='bg-white rounded-2xl shadow-md p-6 border border-gray-100'>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='text-lg font-bold text-gray-900'>Créditos Recientes</h3>
            <span className='text-sm text-gray-500'>Últimos {creditosRecientes.length}</span>
          </div>
          
          {creditosRecientes.length > 0 ? (
          <div className='space-y-3'>
              {creditosRecientes.map((cliente) => (
                <div key={cliente._id} className='flex justify-between items-center py-3 border-b border-gray-100 last:border-0'>
                <div>
                    <p className='text-sm font-semibold text-gray-800'>
                      {cliente.firstName} {cliente.lastName}
                    </p>
                    <p className='text-xs text-gray-500'>
                      Doc: {cliente.identificationNumber} • {formatDate(cliente.createdAt)}
                    </p>
                </div>
                <div className='text-right'>
                    <p className='text-sm font-bold text-gray-900'>
                      {cliente.creditAmount ? formatCurrency(cliente.creditAmount) : 'Sin monto'}
                    </p>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(cliente.status)}`}>
                      {getStatusLabel(cliente.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
          ) : (
            <div className='text-center py-8'>
              <p className='text-gray-500'>No hay créditos registrados aún</p>
              <p className='text-sm text-gray-400 mt-1'>Comienza creando un nuevo cliente</p>
            </div>
          )}
        </div>

        {/* Trazabilidad por analista */}
        <div className='bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-md p-6 border border-indigo-100'>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='text-lg font-bold text-gray-900'>Trazabilidad por analista</h3>
            <span className='text-xs text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full'>Créditos radicados</span>
          </div>

          <div className='space-y-4'>
            {/* Analista 1 */}
            <div className='bg-white/70 rounded-xl p-4'>
              <div className='flex items-start gap-3'>
                <div className='bg-blue-100 p-2 rounded-lg'>
                  <svg className='w-5 h-5 text-blue-700' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                  </svg>
                </div>
                <div className='flex-1'>
                  <div className='flex items-center justify-between'>
                    <p className='text-sm font-bold text-gray-900'>Analista 1</p>
                    <p className='text-sm font-semibold text-gray-700'>Total: {analyst1Queue + analyst1Working + analyst1Returned + analyst1Approved}</p>
                  </div>
                  <div className='mt-3 grid grid-cols-2 gap-2 text-xs'>
                    <div className='flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-gray-200'>
                      <span className='text-gray-600'>En cola</span>
                      <span className='font-bold text-gray-900'>{analyst1Queue}</span>
                    </div>
                    <div className='flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-gray-200'>
                      <span className='text-gray-600'>En estudio</span>
                      <span className='font-bold text-gray-900'>{analyst1Working}</span>
                    </div>
                    <div className='flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-gray-200'>
                      <span className='text-gray-600'>Devueltos</span>
                      <span className='font-bold text-gray-900'>{analyst1Returned}</span>
                    </div>
                    <div className='flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-gray-200'>
                      <span className='text-gray-600'>Aprobados</span>
                      <span className='font-bold text-gray-900'>{analyst1Approved}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Analista 2 */}
            <div className='bg-white/70 rounded-xl p-4'>
              <div className='flex items-start gap-3'>
                <div className='bg-teal-100 p-2 rounded-lg'>
                  <svg className='w-5 h-5 text-teal-700' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                  </svg>
                </div>
                <div className='flex-1'>
                  <div className='flex items-center justify-between'>
                    <p className='text-sm font-bold text-gray-900'>Analista 2</p>
                    <p className='text-sm font-semibold text-gray-700'>Total: {analyst2Queue + analyst2Working + analyst2Returned + analyst2Approved}</p>
                  </div>
                  <div className='mt-3 grid grid-cols-2 gap-2 text-xs'>
                    <div className='flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-gray-200'>
                      <span className='text-gray-600'>En cola</span>
                      <span className='font-bold text-gray-900'>{analyst2Queue}</span>
                    </div>
                    <div className='flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-gray-200'>
                      <span className='text-gray-600'>En estudio</span>
                      <span className='font-bold text-gray-900'>{analyst2Working}</span>
                    </div>
                    <div className='flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-gray-200'>
                      <span className='text-gray-600'>Devueltos</span>
                      <span className='font-bold text-gray-900'>{analyst2Returned}</span>
                    </div>
                    <div className='flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-gray-200'>
                      <span className='text-gray-600'>Aprobados</span>
                      <span className='font-bold text-gray-900'>{analyst2Approved}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Analista 3 */}
            <div className='bg-white/70 rounded-xl p-4'>
              <div className='flex items-start gap-3'>
                <div className='bg-purple-100 p-2 rounded-lg'>
                  <svg className='w-5 h-5 text-purple-700' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                  </svg>
                </div>
                <div className='flex-1'>
                  <div className='flex items-center justify-between'>
                    <p className='text-sm font-bold text-gray-900'>Analista 3</p>
                    <p className='text-sm font-semibold text-gray-700'>Total: {analyst3Queue + analyst3Working + analyst3Returned + analyst3Approved}</p>
                  </div>
                  <div className='mt-3 grid grid-cols-2 gap-2 text-xs'>
                    <div className='flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-gray-200'>
                      <span className='text-gray-600'>En cola</span>
                      <span className='font-bold text-gray-900'>{analyst3Queue}</span>
                    </div>
                    <div className='flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-gray-200'>
                      <span className='text-gray-600'>En estudio</span>
                      <span className='font-bold text-gray-900'>{analyst3Working}</span>
                    </div>
                    <div className='flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-gray-200'>
                      <span className='text-gray-600'>Devueltos</span>
                      <span className='font-bold text-gray-900'>{analyst3Returned}</span>
                    </div>
                    <div className='flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-gray-200'>
                      <span className='text-gray-600'>Aprob./Firma</span>
                      <span className='font-bold text-gray-900'>{analyst3Approved}</span>
                    </div>
                  </div>
                  <p className='text-[11px] text-gray-500 mt-2'>
                    Aprob./Firma incluye: pre-aprobado, pendiente firma y listo para desembolso.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resumen financiero */}
      <div className='bg-white rounded-2xl shadow-md p-6 border border-gray-100'>
        <h3 className='text-xl font-bold text-gray-900 mb-6'>Resumen Financiero</h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200'>
            <p className='text-blue-600 text-sm font-semibold'>Total Solicitado</p>
            <p className='text-2xl font-bold text-blue-800 mt-2'>{formatCurrency(montoTotalSolicitado)}</p>
            <p className='text-blue-600 text-xs mt-2'>{totalClientes} solicitudes</p>
          </div>
          <div className='bg-gradient-to-br from-yellow-50 to-yellow-100 p-5 rounded-xl border border-yellow-200'>
            <p className='text-yellow-600 text-sm font-semibold'>En Estudio</p>
            <p className='text-2xl font-bold text-yellow-800 mt-2'>{clientesEnEstudio + clientesRadicados}</p>
            <p className='text-yellow-600 text-xs mt-2'>En proceso de análisis</p>
          </div>
          <div className='bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl border border-green-200'>
            <p className='text-green-600 text-sm font-semibold'>Total Desembolsado</p>
            <p className='text-2xl font-bold text-green-800 mt-2'>{formatCurrency(montoDesembolsado)}</p>
            <p className='text-green-600 text-xs mt-2'>{clientesDesembolsados} desembolsos</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommercialDashboard
