'use client'
import React, { useState } from 'react'

interface ClienteData {
  id: string
  nombre: string
  apellido: string
  documento: string
  telefono: string
  estado: 'pendiente' | 'en-proceso' | 'aprobado' | 'rechazado'
  fechaCreacion: string
  montoSolicitado?: number
  progreso: number
}

const ControlModule = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'todos' | 'pendiente' | 'en-proceso' | 'aprobado' | 'rechazado'>('todos')

  // Mock data de clientes
  const clientes: ClienteData[] = [
    {
      id: '1',
      nombre: 'Juan',
      apellido: 'García López',
      documento: '1234567890',
      telefono: '3101234567',
      estado: 'en-proceso',
      fechaCreacion: '2024-10-28',
      montoSolicitado: 5000000,
      progreso: 65,
    },
    {
      id: '2',
      nombre: 'María',
      apellido: 'Rodríguez Pérez',
      documento: '9876543210',
      telefono: '3109876543',
      estado: 'pendiente',
      fechaCreacion: '2024-10-29',
      montoSolicitado: 2000000,
      progreso: 25,
    },
    {
      id: '3',
      nombre: 'Carlos',
      apellido: 'Martínez Silva',
      documento: '5555555555',
      telefono: '3105555555',
      estado: 'aprobado',
      fechaCreacion: '2024-10-25',
      montoSolicitado: 10000000,
      progreso: 100,
    },
    {
      id: '4',
      nombre: 'Ana',
      apellido: 'López González',
      documento: '4444444444',
      telefono: '3104444444',
      estado: 'rechazado',
      fechaCreacion: '2024-10-20',
      progreso: 0,
    },
  ]

  const filteredClientes = clientes.filter((cliente) => {
    const matchesSearch =
      cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.documento.includes(searchTerm)

    const matchesStatus = filterStatus === 'todos' || cliente.estado === filterStatus

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (
    estado: 'pendiente' | 'en-proceso' | 'aprobado' | 'rechazado'
  ): string => {
    switch (estado) {
      case 'pendiente':
        return 'bg-yellow-50 border-yellow-200'
      case 'en-proceso':
        return 'bg-blue-50 border-blue-200'
      case 'aprobado':
        return 'bg-green-50 border-green-200'
      case 'rechazado':
        return 'bg-red-50 border-red-200'
    }
  }

  const getStatusBadge = (
    estado: 'pendiente' | 'en-proceso' | 'aprobado' | 'rechazado'
  ): string => {
    switch (estado) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800'
      case 'en-proceso':
        return 'bg-blue-100 text-blue-800'
      case 'aprobado':
        return 'bg-green-100 text-green-800'
      case 'rechazado':
        return 'bg-red-100 text-red-800'
    }
  }

  const getStatusLabel = (
    estado: 'pendiente' | 'en-proceso' | 'aprobado' | 'rechazado'
  ): string => {
    switch (estado) {
      case 'pendiente':
        return 'Pendiente'
      case 'en-proceso':
        return 'En Proceso'
      case 'aprobado':
        return 'Aprobado'
      case 'rechazado':
        return 'Rechazado'
    }
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
              <option value='pendiente'>Pendiente</option>
              <option value='en-proceso'>En Proceso</option>
              <option value='aprobado'>Aprobado</option>
              <option value='rechazado'>Rechazado</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6'>
          <div className='bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200'>
            <p className='text-blue-600 text-sm font-semibold'>En Proceso</p>
            <p className='text-2xl font-bold text-blue-800 mt-1'>
              {clientes.filter((c) => c.estado === 'en-proceso').length}
            </p>
          </div>
          <div className='bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200'>
            <p className='text-yellow-600 text-sm font-semibold'>Pendiente</p>
            <p className='text-2xl font-bold text-yellow-800 mt-1'>
              {clientes.filter((c) => c.estado === 'pendiente').length}
            </p>
          </div>
          <div className='bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200'>
            <p className='text-green-600 text-sm font-semibold'>Aprobado</p>
            <p className='text-2xl font-bold text-green-800 mt-1'>
              {clientes.filter((c) => c.estado === 'aprobado').length}
            </p>
          </div>
          <div className='bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200'>
            <p className='text-red-600 text-sm font-semibold'>Rechazado</p>
            <p className='text-2xl font-bold text-red-800 mt-1'>
              {clientes.filter((c) => c.estado === 'rechazado').length}
            </p>
          </div>
        </div>
      </div>

      {/* Clientes Cards */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {filteredClientes.map((cliente) => (
          <div
            key={cliente.id}
            className={`rounded-lg shadow-md p-6 border-2 transition-all duration-300 hover:shadow-lg cursor-pointer ${getStatusColor(
              cliente.estado
            )}`}
          >
            {/* Header */}
            <div className='flex justify-between items-start mb-4'>
              <div>
                <h3 className='text-xl font-bold text-gray-800'>
                  {cliente.nombre} {cliente.apellido}
                </h3>
                <p className='text-sm text-gray-600 mt-1'>
                  Doc: {cliente.documento} | Tel: {cliente.telefono}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(cliente.estado)}`}>
                {getStatusLabel(cliente.estado)}
              </span>
            </div>

            {/* Divider */}
            <div className='border-t border-gray-300 my-4 opacity-40'></div>

            {/* Content */}
            <div className='space-y-3'>
              {cliente.montoSolicitado && (
                <div className='flex justify-between items-center'>
                  <span className='text-gray-700 font-semibold'>Monto Solicitado:</span>
                  <span className='text-lg font-bold text-primary-color'>
                    ${cliente.montoSolicitado?.toLocaleString('es-CO')}
                  </span>
                </div>
              )}

              <div className='flex justify-between items-center'>
                <span className='text-gray-700 font-semibold'>Fecha Creación:</span>
                <span className='text-gray-600'>{cliente.fechaCreacion}</span>
              </div>

              {/* Progress Bar */}
              <div className='mt-4'>
                <div className='flex justify-between items-center mb-2'>
                  <span className='text-sm font-semibold text-gray-700'>Progreso</span>
                  <span className='text-sm font-bold text-primary-color'>{cliente.progreso}%</span>
                </div>
                <div className='w-full bg-gray-300 rounded-full h-2.5'>
                  <div
                    className='bg-gradient-to-r from-primary-color to-accent-color h-2.5 rounded-full transition-all duration-300'
                    style={{ width: `${cliente.progreso}%` }}
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
