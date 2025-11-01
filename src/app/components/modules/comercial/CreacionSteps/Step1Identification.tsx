'use client'
import React, { useState } from 'react'
import { CreacionFormData } from '../CreacionModule/CreacionModule'

interface Props {
  formData: CreacionFormData
  onNext: (data: Partial<CreacionFormData>) => void
}

const Step1Identification = ({ formData, onNext }: Props) => {
  const [idType, setIdType] = useState(formData.identificationType || 'CC')
  const [idNumber, setIdNumber] = useState(formData.identificationNumber || '')
  const [phone, setPhone] = useState(formData.phone || '')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!idNumber.trim() || !phone.trim()) {
      setError('Por favor completa todos los campos')
      return
    }

    if (!/^\d{6,}$/.test(idNumber)) {
      setError('El número de identificación debe tener al menos 6 dígitos')
      return
    }

    if (!/^\d{10}$/.test(phone)) {
      setError('El teléfono debe tener exactamente 10 dígitos')
      return
    }

    setError('')
    onNext({
      identificationType: idType,
      identificationNumber: idNumber,
      phone: phone,
    })
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div>
        <h3 className='text-2xl font-bold text-gray-800 mb-4'>Identificación del Cliente</h3>
        <p className='text-gray-600 mb-6'>
          Ingresa los datos de identificación del cliente que deseas crear
        </p>
      </div>

      {error && (
        <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg'>
          {error}
        </div>
      )}

      {/* Identification Type */}
      <div>
        <label className='block text-sm font-semibold text-gray-700 mb-2'>
          Tipo de Identificación
        </label>
        <select
          value={idType}
          onChange={(e) => setIdType(e.target.value)}
          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
        >
          <option value='CC'>Cédula de Ciudadanía (CC)</option>
          <option value='CE'>Cédula de Extranjería (CE)</option>
          <option value='PA'>Pasaporte</option>
          <option value='NIT'>NIT</option>
        </select>
      </div>

      {/* Identification Number */}
      <div>
        <label className='block text-sm font-semibold text-gray-700 mb-2'>
          Número de Identificación
        </label>
        <input
          type='text'
          value={idNumber}
          onChange={(e) => setIdNumber(e.target.value.replace(/\D/g, ''))}
          placeholder='Ej: 1234567890'
          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
        />
        <p className='text-gray-500 text-sm mt-1'>Solo números</p>
      </div>

      {/* Phone */}
      <div>
        <label className='block text-sm font-semibold text-gray-700 mb-2'>
          Teléfono (10 dígitos)
        </label>
        <div className='flex items-center'>
          <span className='text-gray-600 font-semibold mr-2'>+57</span>
          <input
            type='tel'
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
            placeholder='Ej: 3101234567'
            className='flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
          />
        </div>
        <p className='text-gray-500 text-sm mt-1'>Formato: 3XX XXX XXXX</p>
      </div>

      {/* Summary */}
      <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6'>
        <h4 className='font-semibold text-blue-900 mb-2'>Resumen de datos</h4>
        <div className='space-y-1 text-sm text-blue-800'>
          <p>Tipo: {idType === 'CC' ? 'Cédula de Ciudadanía' : idType}</p>
          <p>Número: {idNumber || '---'}</p>
          <p>Teléfono: {phone ? `+57 ${phone}` : '---'}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className='flex gap-4 pt-4'>
        <button
          type='submit'
          className='flex-1 bg-gradient-to-r from-primary-color to-accent-color text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all duration-300'
        >
          Continuar →
        </button>
      </div>
    </form>
  )
}

export default Step1Identification
