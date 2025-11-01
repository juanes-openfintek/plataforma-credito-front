'use client'
import React from 'react'
import { SimulationFormData } from '../SimulationModule/SimulationModule'

interface Props {
  formData: SimulationFormData
  onNext: () => void
  onChange: (data: Partial<SimulationFormData>) => void
}

const SimulationStep1 = ({ formData, onNext, onChange }: Props) => {
  const pensionTypes = [
    { value: 'propia-vejez', label: 'Propia por Vejez' },
    { value: 'sobreviviente', label: 'Sobreviviente' },
    { value: 'invalidez', label: 'Invalidez' },
    { value: 'otra', label: 'Otra' },
  ]

  const handleContinue = () => {
    if (formData.activityType === 'pensionado' && !formData.pensionType) {
      alert('Por favor selecciona el tipo de pensión')
      return
    }
    onNext()
  }

  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-2xl font-bold text-gray-800 mb-2'>Preguntas Iniciales</h3>
        <p className='text-gray-600'>Completa la información inicial para la simulación</p>
      </div>

      {/* Compra de cartera */}
      <div>
        <label className='block text-sm font-semibold text-gray-700 mb-3'>
          ¿Requiere compra de cartera?
        </label>
        <div className='flex gap-4'>
          <button
            type='button'
            onClick={() => onChange({ requiresPortfolioPurchase: true })}
            className={`flex-1 px-6 py-4 rounded-lg border-2 font-semibold transition-all duration-300 ${
              formData.requiresPortfolioPurchase
                ? 'border-primary-color bg-primary-color text-white shadow-lg'
                : 'border-gray-300 text-gray-700 hover:border-primary-color'
            }`}
          >
            Sí
          </button>
          <button
            type='button'
            onClick={() => onChange({ requiresPortfolioPurchase: false })}
            className={`flex-1 px-6 py-4 rounded-lg border-2 font-semibold transition-all duration-300 ${
              !formData.requiresPortfolioPurchase
                ? 'border-primary-color bg-primary-color text-white shadow-lg'
                : 'border-gray-300 text-gray-700 hover:border-primary-color'
            }`}
          >
            No
          </button>
        </div>
      </div>

      {/* Tipo de actividad */}
      <div>
        <label className='block text-sm font-semibold text-gray-700 mb-3'>
          Tipo de Actividad
        </label>
        <select
          value={formData.activityType}
          onChange={(e) => {
            onChange({ activityType: e.target.value })
            if (e.target.value !== 'pensionado') {
              onChange({ pensionType: undefined })
            }
          }}
          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
        >
          <option value='pensionado'>Pensionado</option>
          <option value='empleado'>Empleado</option>
          <option value='independiente'>Independiente</option>
        </select>
      </div>

      {/* Tipo de pensión (solo si es pensionado) */}
      {formData.activityType === 'pensionado' && (
        <div>
          <label className='block text-sm font-semibold text-gray-700 mb-3'>
            Tipo de Pensión
          </label>
          <select
            value={formData.pensionType || ''}
            onChange={(e) => onChange({ pensionType: e.target.value })}
            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
          >
            <option value=''>Selecciona un tipo</option>
            {pensionTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Info Box */}
      <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
        <h4 className='font-semibold text-blue-900 mb-2'>ℹ️ Información</h4>
        <ul className='text-sm text-blue-800 space-y-1 list-disc list-inside'>
          <li>La compra de cartera permite refinanciar deudas existentes</li>
          <li>El tipo de pensión afecta las condiciones del crédito</li>
          <li>Esta información se utilizará para calcular el crédito disponible</li>
        </ul>
      </div>

      {/* Navigation */}
      <div className='flex justify-end pt-4'>
        <button
          onClick={handleContinue}
          className='px-6 py-3 bg-gradient-to-r from-primary-color to-accent-color text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300'
        >
          Continuar →
        </button>
      </div>
    </div>
  )
}

export default SimulationStep1

