'use client'
import React, { useState, useEffect } from 'react'
import { getClientes, submitClienteAsCredit, getClienteById } from '../../../../services/commercialClientes'

interface ClienteData {
  _id: string
  firstName: string
  lastName: string
  identificationNumber: string
  phone: string
  status: 'iniciado' | 'en-progreso' | 'completado' | 'radicado' | 'aprobado' | 'rechazado' | 'desembolsado' 
  createdAt: string
  creditAmount?: number
  completionPercentage: number
  email?: string
  birthDate?: string
  gender?: string
  pensionIssuer?: string
  pensionType?: string
  monthlyIncome?: number
  financialDetails?: {
    accountNumber?: string
    accountType?: string
    bank?: string
  }
  address?: string
  city?: string
  department?: string
}

interface ClienteDetailData extends ClienteData {
  // Campos adicionales que pueden venir del backend
  idIssuancePlace?: string
  idIssuanceDate?: string
  birthPlace?: string
  birthCountry?: string
}

const ControlModule = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'todos' | string>('todos')
  const [clientes, setClientes] = useState<ClienteData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [radicatingIds, setRadicatingIds] = useState<Set<string>>(new Set())
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [selectedCliente, setSelectedCliente] = useState<ClienteDetailData | null>(null)
  const [loadingDetail, setLoadingDetail] = useState(false)

  useEffect(() => {
    fetchClientes()
  }, [])

  const fetchClientes = async () => {
    try {
      setLoading(true)
      const data = await getClientes()
      setClientes(data)
      setError(null)
    } catch (err: any) {
      console.error('Error fetching clientes:', err)
      setError(err.response?.data?.message || 'Error al cargar los clientes')
    } finally {
      setLoading(false)
    }
  }

  const handleVerDetalles = async (clienteId: string) => {
    try {
      setLoadingDetail(true)
      const clienteData = await getClienteById(clienteId)
      setSelectedCliente(clienteData)
    } catch (err: any) {
      console.error('Error fetching cliente details:', err)
      alert(err.response?.data?.message || 'Error al cargar los detalles del cliente')
    } finally {
      setLoadingDetail(false)
    }
  }

  const filteredClientes = clientes.filter((cliente) => {
    const matchesSearch =
      cliente.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.identificationNumber?.includes(searchTerm)

    const matchesStatus = filterStatus === 'todos' || cliente.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const handleRadicar = async (clienteId: string, clienteName: string) => {
    if (!confirm(`¿Estás seguro de radicar el crédito de ${clienteName}? Esta acción enviará el crédito a los analistas.`)) {
      return
    }

    try {
      setRadicatingIds(prev => new Set(prev).add(clienteId))
      await submitClienteAsCredit(clienteId)
      
      setSuccessMessage(`Crédito de ${clienteName} radicado exitosamente`)
      setTimeout(() => setSuccessMessage(null), 5000)
      
      // Recargar la lista de clientes
      await fetchClientes()
    } catch (err: any) {
      console.error('Error radicando cliente:', err)
      alert(err.response?.data?.message || 'Error al radicar el crédito')
    } finally {
      setRadicatingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(clienteId)
        return newSet
      })
    }
  }

  const getStatusColor = (estado: string): string => {
    switch (estado) {
      case 'iniciado':
        return 'bg-yellow-50 border-yellow-200'
      case 'en-progreso':
        return 'bg-blue-50 border-blue-200'
      case 'completado':
        return 'bg-purple-50 border-purple-200'
      case 'radicado':
        return 'bg-indigo-50 border-indigo-200'
      case 'aprobado':
        return 'bg-green-50 border-green-200'
      case 'rechazado':
        return 'bg-red-50 border-red-200'
      case 'desembolsado':
        return 'bg-emerald-50 border-emerald-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const getStatusBadge = (estado: string): string => {
    switch (estado) {
      case 'iniciado':
        return 'bg-yellow-100 text-yellow-800'
      case 'en-progreso':
        return 'bg-blue-100 text-blue-800'
      case 'completado':
        return 'bg-purple-100 text-purple-800'
      case 'radicado':
        return 'bg-indigo-100 text-indigo-800'
      case 'aprobado':
        return 'bg-green-100 text-green-800'
      case 'rechazado':
        return 'bg-red-100 text-red-800'
      case 'desembolsado':
        return 'bg-emerald-100 text-emerald-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (estado: string): string => {
    switch (estado) {
      case 'iniciado':
        return 'Iniciado'
      case 'en-progreso':
        return 'En Progreso'
      case 'completado':
        return 'Completado'
      case 'radicado':
        return 'Radicado'
      case 'aprobado':
        return 'Aprobado'
      case 'rechazado':
        return 'Rechazado'
      case 'desembolsado':
        return 'Desembolsado'
      default:
        return estado
    }
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const getPensionIssuerLabel = (issuer: string): string => {
    const issuers: Record<string, string> = {
      'colpensiones': 'Colpensiones',
      'proteccion': 'Protección',
      'colfondos': 'Colfondos',
      'porvenir': 'Porvenir',
      'skandia': 'Skandia',
      'otro': 'Otra administradora'
    }
    return issuers[issuer] || issuer
  }

  const getPensionTypeLabel = (type: string): string => {
    const types: Record<string, string> = {
      'jubilacion': 'Jubilación / Vejez',
      'invalidez': 'Invalidez',
      'sobrevivencia': 'Sobrevivencia',
      'subsidio': 'Subsidio de desempleo'
    }
    return types[type] || type
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <div className='w-12 h-12 border-4 border-primary-color border-t-accent-color rounded-full animate-spin mx-auto mb-4'></div>
          <p className='text-gray-600 font-semibold'>Cargando clientes...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='bg-red-50 border border-red-300 rounded-lg p-6 text-center'>
        <p className='text-red-800 font-semibold mb-2'>Error al cargar clientes</p>
        <p className='text-red-600 text-sm mb-4'>{error}</p>
        <button
          onClick={fetchClientes}
          className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition'
        >
          Reintentar
        </button>
      </div>
    )
  }

  // Vista de detalle del cliente
  if (selectedCliente) {
    return (
      <div className='space-y-6'>
        {/* Header con botón volver */}
        <button
          onClick={() => setSelectedCliente(null)}
          className='flex items-center gap-2 text-primary-color hover:underline font-semibold'
        >
          <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 19l-7-7m0 0l7-7m-7 7h18' />
          </svg>
          Volver a la lista
        </button>

        {/* Tarjeta principal del cliente */}
        <div className='bg-white rounded-2xl shadow-lg overflow-hidden'>
          {/* Header con gradiente */}
          <div className='bg-gradient-to-r from-primary-color to-accent-color p-6 text-white'>
            <div className='flex justify-between items-start'>
              <div>
                <h2 className='text-3xl font-bold'>
                  {selectedCliente.firstName} {selectedCliente.lastName}
                </h2>
                <p className='text-white/80 mt-1'>Documento: {selectedCliente.identificationNumber}</p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold bg-white/20 backdrop-blur`}>
                {getStatusLabel(selectedCliente.status)}
              </span>
            </div>
            
            {selectedCliente.creditAmount && (
              <div className='mt-4 pt-4 border-t border-white/20'>
                <p className='text-white/80 text-sm'>Monto Solicitado</p>
                <p className='text-3xl font-bold'>{formatCurrency(selectedCliente.creditAmount)}</p>
              </div>
            )}
          </div>

          {/* Contenido */}
          <div className='p-6 space-y-6'>
            {/* Información de contacto */}
            <div>
              <h3 className='text-lg font-bold text-gray-800 mb-4 flex items-center gap-2'>
                <svg className='w-5 h-5 text-primary-color' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                </svg>
                Información Personal
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                <div className='bg-gray-50 p-4 rounded-lg'>
                  <p className='text-sm text-gray-500'>Teléfono</p>
                  <p className='font-semibold text-gray-800'>{selectedCliente.phone || 'No registrado'}</p>
                </div>
                <div className='bg-gray-50 p-4 rounded-lg'>
                  <p className='text-sm text-gray-500'>Correo Electrónico</p>
                  <p className='font-semibold text-gray-800'>{selectedCliente.email || 'No registrado'}</p>
                </div>
                <div className='bg-gray-50 p-4 rounded-lg'>
                  <p className='text-sm text-gray-500'>Fecha de Nacimiento</p>
                  <p className='font-semibold text-gray-800'>
                    {selectedCliente.birthDate ? formatDate(selectedCliente.birthDate) : 'No registrado'}
                  </p>
                </div>
                <div className='bg-gray-50 p-4 rounded-lg'>
                  <p className='text-sm text-gray-500'>Género</p>
                  <p className='font-semibold text-gray-800 capitalize'>{selectedCliente.gender || 'No registrado'}</p>
                </div>
                {selectedCliente.address && (
                  <div className='bg-gray-50 p-4 rounded-lg'>
                    <p className='text-sm text-gray-500'>Dirección</p>
                    <p className='font-semibold text-gray-800'>{selectedCliente.address}</p>
                  </div>
                )}
                {selectedCliente.city && (
                  <div className='bg-gray-50 p-4 rounded-lg'>
                    <p className='text-sm text-gray-500'>Ciudad</p>
                    <p className='font-semibold text-gray-800'>{selectedCliente.city}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Información de pensión */}
            {(selectedCliente.pensionIssuer || selectedCliente.pensionType || selectedCliente.monthlyIncome) && (
              <div>
                <h3 className='text-lg font-bold text-gray-800 mb-4 flex items-center gap-2'>
                  <svg className='w-5 h-5 text-green-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                  </svg>
                  Información de Pensión
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  {selectedCliente.pensionIssuer && (
                    <div className='bg-green-50 p-4 rounded-lg border border-green-200'>
                      <p className='text-sm text-green-600'>Administradora</p>
                      <p className='font-semibold text-green-800'>{getPensionIssuerLabel(selectedCliente.pensionIssuer)}</p>
                    </div>
                  )}
                  {selectedCliente.pensionType && (
                    <div className='bg-green-50 p-4 rounded-lg border border-green-200'>
                      <p className='text-sm text-green-600'>Tipo de Pensión</p>
                      <p className='font-semibold text-green-800'>{getPensionTypeLabel(selectedCliente.pensionType)}</p>
                    </div>
                  )}
                  {selectedCliente.monthlyIncome && (
                    <div className='bg-green-50 p-4 rounded-lg border border-green-200'>
                      <p className='text-sm text-green-600'>Ingreso Mensual</p>
                      <p className='font-semibold text-green-800'>{formatCurrency(selectedCliente.monthlyIncome)}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Información bancaria */}
            {selectedCliente.financialDetails && (
              <div>
                <h3 className='text-lg font-bold text-gray-800 mb-4 flex items-center gap-2'>
                  <svg className='w-5 h-5 text-blue-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' />
                  </svg>
                  Información Bancaria
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  {selectedCliente.financialDetails.bank && (
                    <div className='bg-blue-50 p-4 rounded-lg border border-blue-200'>
                      <p className='text-sm text-blue-600'>Banco</p>
                      <p className='font-semibold text-blue-800'>{selectedCliente.financialDetails.bank}</p>
                    </div>
                  )}
                  {selectedCliente.financialDetails.accountType && (
                    <div className='bg-blue-50 p-4 rounded-lg border border-blue-200'>
                      <p className='text-sm text-blue-600'>Tipo de Cuenta</p>
                      <p className='font-semibold text-blue-800 capitalize'>{selectedCliente.financialDetails.accountType}</p>
                    </div>
                  )}
                  {selectedCliente.financialDetails.accountNumber && (
                    <div className='bg-blue-50 p-4 rounded-lg border border-blue-200'>
                      <p className='text-sm text-blue-600'>Número de Cuenta</p>
                      <p className='font-semibold text-blue-800'>{selectedCliente.financialDetails.accountNumber}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Progreso y estado */}
            <div>
              <h3 className='text-lg font-bold text-gray-800 mb-4 flex items-center gap-2'>
                <svg className='w-5 h-5 text-purple-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' />
                </svg>
                Estado del Proceso
              </h3>
              <div className='bg-purple-50 p-6 rounded-xl border border-purple-200'>
                <div className='flex justify-between items-center mb-4'>
                  <div>
                    <p className='text-sm text-purple-600'>Estado Actual</p>
                    <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(selectedCliente.status)}`}>
                      {getStatusLabel(selectedCliente.status)}
                    </span>
                  </div>
                  <div className='text-right'>
                    <p className='text-sm text-purple-600'>Progreso</p>
                    <p className='text-2xl font-bold text-purple-800'>{selectedCliente.completionPercentage}%</p>
                  </div>
                </div>
                <div className='w-full bg-purple-200 rounded-full h-3'>
                  <div
                    className='bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-300'
                    style={{ width: `${selectedCliente.completionPercentage}%` }}
                  ></div>
                </div>
                <p className='text-sm text-purple-600 mt-3'>
                  Fecha de registro: {formatDate(selectedCliente.createdAt)}
                </p>
              </div>
            </div>

            {/* Botones de acción */}
            <div className='flex gap-4 pt-4 border-t'>
              {selectedCliente.status === 'completado' && (
                <button 
                  onClick={() => handleRadicar(selectedCliente._id, `${selectedCliente.firstName} ${selectedCliente.lastName}`)}
                  disabled={radicatingIds.has(selectedCliente._id)}
                  className='flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                >
                  {radicatingIds.has(selectedCliente._id) ? (
                    <>
                      <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                      Radicando...
                    </>
                  ) : (
                    <>
                      <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                      </svg>
                      Radicar Crédito
                    </>
                  )}
                </button>
              )}
              <button 
                onClick={() => setSelectedCliente(null)}
                className='flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-300'
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-8'>
      {/* Loading overlay para detalles */}
      {loadingDetail && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
          <div className='bg-white p-6 rounded-xl shadow-xl'>
            <div className='w-12 h-12 border-4 border-primary-color border-t-accent-color rounded-full animate-spin mx-auto mb-4'></div>
            <p className='text-gray-600 font-semibold'>Cargando detalles...</p>
          </div>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className='bg-green-50 border border-green-300 rounded-lg p-4 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <svg className='w-6 h-6 text-green-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
            </svg>
            <p className='text-green-800 font-semibold'>{successMessage}</p>
          </div>
          <button onClick={() => setSuccessMessage(null)} className='text-green-600 hover:text-green-800'>
            <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className='text-3xl font-bold text-gray-800 mb-2'>Control de Clientes</h2>
        <p className='text-gray-600'>Gestiona y monitorea el estado de tus clientes</p>
      </div>

      {/* Filters */}
      <div className='bg-white rounded-lg shadow-md p-6 space-y-4'>
        <div className='flex flex-col lg:flex-row gap-4'>
          {/* Search */}
          <div className='flex-1'>
            <input
              type='text'
              placeholder='Buscar por nombre, apellido o documento...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
            >
              <option value='todos'>Todos los estados</option>
              <option value='iniciado'>Iniciado</option>
              <option value='en-progreso'>En Progreso</option>
              <option value='completado'>Completado</option>
              <option value='radicado'>Radicado</option>
              <option value='aprobado'>Aprobado</option>
              <option value='rechazado'>Rechazado</option>
              <option value='desembolsado'>Desembolsado</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className='grid grid-cols-2 lg:grid-cols-5 gap-4 mt-6'>
          <div className='bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200'>
            <p className='text-blue-600 text-sm font-semibold'>En Progreso</p>
            <p className='text-2xl font-bold text-blue-800 mt-1'>
              {clientes.filter((c) => c.status === 'en-progreso').length}
            </p>
          </div>
          <div className='bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200'>
            <p className='text-purple-600 text-sm font-semibold'>Listos para Radicar</p>
            <p className='text-2xl font-bold text-purple-800 mt-1'>
              {clientes.filter((c) => c.status === 'completado').length}
            </p>
          </div>
          <div className='bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg border border-indigo-200'>
            <p className='text-indigo-600 text-sm font-semibold'>Radicados</p>
            <p className='text-2xl font-bold text-indigo-800 mt-1'>
              {clientes.filter((c) => c.status === 'radicado').length}
            </p>
          </div>
          <div className='bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200'>
            <p className='text-green-600 text-sm font-semibold'>Aprobados</p>
            <p className='text-2xl font-bold text-green-800 mt-1'>
              {clientes.filter((c) => c.status === 'aprobado').length}
            </p>
          </div>
          <div className='bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-lg border border-emerald-200'>
            <p className='text-emerald-600 text-sm font-semibold'>Desembolsados</p>
            <p className='text-2xl font-bold text-emerald-800 mt-1'>
              {clientes.filter((c) => c.status === 'desembolsado').length}
            </p>
          </div>
        </div>
      </div>

      {/* Clientes Cards */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {filteredClientes.map((cliente) => (
          <div
            key={cliente._id}
            className={`rounded-lg shadow-md p-6 border-2 transition-all duration-300 hover:shadow-lg ${getStatusColor(
              cliente.status
            )}`}
          >
            {/* Header */}
            <div className='flex justify-between items-start mb-4'>
              <div>
                <h3 className='text-xl font-bold text-gray-800'>
                  {cliente.firstName} {cliente.lastName}
                </h3>
                <p className='text-sm text-gray-600 mt-1'>
                  Doc: {cliente.identificationNumber} | Tel: {cliente.phone}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(cliente.status)}`}>
                {getStatusLabel(cliente.status)}
              </span>
            </div>

            {/* Divider */}
            <div className='border-t border-gray-300 my-4 opacity-40'></div>

            {/* Content */}
            <div className='space-y-3'>
              {cliente.creditAmount && (
                <div className='flex justify-between items-center'>
                  <span className='text-gray-700 font-semibold'>Monto Solicitado:</span>
                  <span className='text-lg font-bold text-primary-color'>
                    ${cliente.creditAmount?.toLocaleString('es-CO')}
                  </span>
                </div>
              )}

              <div className='flex justify-between items-center'>
                <span className='text-gray-700 font-semibold'>Fecha Creación:</span>
                <span className='text-gray-600'>{formatDate(cliente.createdAt)}</span>
              </div>

              {/* Progress Bar */}
              <div className='mt-4'>
                <div className='flex justify-between items-center mb-2'>
                  <span className='text-sm font-semibold text-gray-700'>Progreso</span>
                  <span className='text-sm font-bold text-primary-color'>{cliente.completionPercentage}%</span>
                </div>
                <div className='w-full bg-gray-300 rounded-full h-2.5'>
                  <div
                    className='bg-gradient-to-r from-primary-color to-accent-color h-2.5 rounded-full transition-all duration-300'
                    style={{ width: `${cliente.completionPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='mt-6 flex gap-3'>
              {cliente.status === 'completado' && (
                <button 
                  onClick={() => handleRadicar(cliente._id, `${cliente.firstName} ${cliente.lastName}`)}
                  disabled={radicatingIds.has(cliente._id)}
                  className='flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                >
                  {radicatingIds.has(cliente._id) ? (
                    <>
                      <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                      Radicando...
                    </>
                  ) : (
                    <>
                      <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                      </svg>
                      Radicar Crédito
                    </>
                  )}
                </button>
              )}
              <button 
                onClick={() => handleVerDetalles(cliente._id)}
                className={`${cliente.status === 'completado' ? 'flex-1' : 'w-full'} bg-gradient-to-r from-primary-color to-accent-color text-white py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all duration-300`}
              >
                Ver Detalles
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredClientes.length === 0 && (
        <div className='bg-white rounded-lg shadow-md p-12 text-center'>
          <p className='text-gray-600 text-lg mb-2'>No se encontraron clientes</p>
          <p className='text-gray-500'>Intenta cambiar los filtros de búsqueda</p>
        </div>
      )}
    </div>
  )
}

export default ControlModule
