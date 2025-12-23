'use client'
import React, { useState } from 'react'
import { CreacionFormData } from '../CreacionModule/CreacionModule'
import ClientDocumentReminder from '../../../atoms/ClientDocumentReminder/ClientDocumentReminder'

interface Props {
  formData: CreacionFormData
  onNext: (data: Partial<CreacionFormData>) => void
}

const Step3Pension = ({ formData, onNext }: Props) => {
  const [pensionIssuer, setPensionIssuer] = useState(formData.pensioneRaIssuer || '')
  const [pensionType, setPensionType] = useState(formData.pensionType || '')
  const [error, setError] = useState('')

  const pensionIssuers = [
    { value: 'colpensiones', label: 'Colpensiones' },
    { value: 'afc-protección', label: 'Protección (AFC)' },
    { value: 'afc-colfondos', label: 'Colfondos (AFC)' },
    { value: 'afc-porvenir', label: 'Porvenir (AFC)' },
    { value: 'afc-skandia', label: 'Skandia (AFC)' },
    { value: 'afc-aporta', label: 'Aporta (AFC)' },
    { value: 'otro', label: 'Otra Administradora' },
  ]

  const pensionTypes = [
    { value: 'jubilacion', label: 'Jubilación / Pensión por Vejez' },
    { value: 'invalidez', label: 'Pensión por Invalidez' },
    { value: 'sobrevivencia', label: 'Pensión de Sobrevivencia' },
    { value: 'subsidio', label: 'Subsidio de Desempleo' },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!pensionIssuer.trim() || !pensionType.trim()) {
      setError('Por favor completa todos los campos')
      return
    }

    setError('')
    onNext({
      pensioneRaIssuer: pensionIssuer,
      pensionType: pensionType,
    })
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div>
        <h3 className='text-2xl font-bold text-gray-800 mb-4'>Información de Pensión / Nómina</h3>
        <p className='text-gray-600 mb-6'>
          Selecciona la administradora de pensiones y el tipo de pension del cliente con la informacion soportada en su documento.
        </p>
        <ClientDocumentReminder className='mb-6' message='Cruza estos datos con el desprendible o resolucion del cliente.' />
      </div>

      {error && (
        <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg'>
          {error}
        </div>
      )}

      {/* Pension Issuer */}
      <div>
        <label className='block text-sm font-semibold text-gray-700 mb-2'>
          Administradora de Pensiones / Pagaduría
        </label>
        <select
          value={pensionIssuer}
          onChange={(e) => setPensionIssuer(e.target.value)}
          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
        >
          <option value=''>-- Selecciona una opción --</option>
          {pensionIssuers.map((issuer) => (
            <option key={issuer.value} value={issuer.value}>
              {issuer.label}
            </option>
          ))}
        </select>
        <p className='text-gray-500 text-sm mt-1'>
          La administradora de pensiones o empresa pagadora del cliente
        </p>
      </div>

      {/* Pension Type */}
      <div>
        <label className='block text-sm font-semibold text-gray-700 mb-2'>
          Tipo de Pensión / Ingreso
        </label>
        <select
          value={pensionType}
          onChange={(e) => setPensionType(e.target.value)}
          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
        >
          <option value=''>-- Selecciona una opción --</option>
          {pensionTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        <p className='text-gray-500 text-sm mt-1'>
          Tipo de ingreso o pensión del cliente
        </p>
      </div>

      {/* Summary */}
      {pensionIssuer && pensionType && (
        <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6'>
          <h4 className='font-semibold text-yellow-900 mb-2'>Resumen de datos</h4>
          <div className='space-y-1 text-sm text-yellow-800'>
            <p>
              Administradora:{' '}
              {pensionIssuers.find((p) => p.value === pensionIssuer)?.label}
            </p>
            <p>
              Tipo de Pensión:{' '}
              {pensionTypes.find((p) => p.value === pensionType)?.label}
            </p>
          </div>
        </div>
      )}

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

export default Step3Pension
