'use client'
import React, { useState, useEffect } from 'react'
import { getClientes } from '../../../../services/commercialClientes'

interface ClienteData {
  _id: string
  firstName: string
  lastName: string
  identificationNumber: string
  phone: string
  status: 'iniciado' | 'en-progreso' | 'completado' | 'aprobado' | 'rechazado' | 'desembolsado'
  createdAt: string
  creditAmount?: number
  completionPercentage: number
}

const ControlModule = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'todos' | string>('todos')
  const [clientes, setClientes] = useState<ClienteData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  const filteredClientes = clientes.filter((cliente) => {
    const matchesSearch =
      cliente.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.identificationNumber?.includes(searchTerm)

    const matchesStatus = filterStatus === 'todos' || cliente.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (estado: string): string => {
    switch (estado) {
      case 'iniciado':
        return 'bg-yellow-50 border-yellow-200'
      case 'en-progreso':
        return 'bg-blue-50 border-blue-200'
      case 'completado':
        return 'bg-purple-50 border-purple-200'
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

  return (
    <div className='space-y-8'>
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
              <option value='aprobado'>Aprobado</option>
              <option value='rechazado'>Rechazado</option>
              <option value='desembolsado'>Desembolsado</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6'>
          <div className='bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200'>
            <p className='text-blue-600 text-sm font-semibold'>En Progreso</p>
            <p className='text-2xl font-bold text-blue-800 mt-1'>
              {clientes.filter((c) => c.status === 'en-progreso').length}
            </p>
          </div>
          <div className='bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200'>
            <p className='text-purple-600 text-sm font-semibold'>Completados</p>
            <p className='text-2xl font-bold text-purple-800 mt-1'>
              {clientes.filter((c) => c.status === 'completado').length}
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
            className={`rounded-lg shadow-md p-6 border-2 transition-all duration-300 hover:shadow-lg cursor-pointer ${getStatusColor(
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

            {/* Action Button */}
            <button className='mt-6 w-full bg-gradient-to-r from-primary-color to-accent-color text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300'>
              Ver Detalles
            </button>
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
