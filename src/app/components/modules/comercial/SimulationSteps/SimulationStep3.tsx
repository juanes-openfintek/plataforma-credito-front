'use client'
import React, { useState } from 'react'
import { SimulationFormData } from '../SimulationModule/SimulationModule'

interface Props {
  formData: SimulationFormData
  onNext: () => void
  onPrevious: () => void
  onChange: (data: Partial<SimulationFormData>) => void
}

const SimulationStep3 = ({ formData, onNext, onPrevious, onChange }: Props) => {
  const [newDeduction, setNewDeduction] = useState({ amount: '', description: '' })

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const totalDeductions = formData.monthlyDeductions.reduce(
    (sum, d) => sum + d.amount,
    0
  )
  const availableIncome = formData.monthlyIncome - totalDeductions

  const addDeduction = () => {
    if (newDeduction.amount && newDeduction.description) {
      onChange({
        monthlyDeductions: [
          ...formData.monthlyDeductions,
          {
            amount: parseFloat(newDeduction.amount),
            description: newDeduction.description,
          },
        ],
      })
      setNewDeduction({ amount: '', description: '' })
    }
  }

  const removeDeduction = (index: number) => {
    onChange({
      monthlyDeductions: formData.monthlyDeductions.filter((_, i) => i !== index),
    })
  }

  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-2xl font-bold text-gray-800 mb-2'>Ingresos y Descuentos</h3>
        <p className='text-gray-600'>Ingresa los ingresos mensuales y descuentos del cliente</p>
      </div>

      {/* Ingresos mensuales */}
      <div>
        <label className='block text-sm font-semibold text-gray-700 mb-2'>
          Ingresos Mensuales
        </label>
        <div className='relative'>
          <span className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600'>
            $
          </span>
          <input
            type='number'
            value={formData.monthlyIncome || ''}
            onChange={(e) => onChange({ monthlyIncome: parseFloat(e.target.value) || 0 })}
            placeholder='0'
            className='w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
          />
        </div>
      </div>

      {/* Descuentos mensuales */}
      <div>
        <label className='block text-sm font-semibold text-gray-700 mb-2'>
          Descuentos Mensuales
        </label>

        {/* Lista de descuentos */}
        {formData.monthlyDeductions.length > 0 && (
          <div className='space-y-2 mb-4'>
            {formData.monthlyDeductions.map((deduction, index) => (
              <div
                key={index}
                className='flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200'
              >
                <div className='flex-1'>
                  <p className='font-semibold text-gray-800'>{deduction.description}</p>
                  <p className='text-sm text-gray-600'>{formatCurrency(deduction.amount)}</p>
                </div>
                <button
                  onClick={() => removeDeduction(index)}
                  className='ml-4 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm font-semibold'
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Formulario para agregar descuento */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-3 mb-2'>
          <input
            type='text'
            value={newDeduction.description}
            onChange={(e) => setNewDeduction({ ...newDeduction, description: e.target.value })}
            placeholder='Descripción (ej: Seguro, Retención)'
            className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
          />
          <div className='relative'>
            <span className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600'>
              $
            </span>
            <input
              type='number'
              value={newDeduction.amount}
              onChange={(e) => setNewDeduction({ ...newDeduction, amount: e.target.value })}
              placeholder='Monto'
              className='w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
            />
          </div>
        </div>
        <button
          onClick={addDeduction}
          className='w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold text-sm'
        >
          + Agregar Descuento
        </button>
      </div>

      {/* Resumen */}
      <div className='bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6'>
        <h4 className='font-semibold text-gray-800 mb-3'>Resumen Financiero</h4>
        <div className='space-y-2'>
          <div className='flex justify-between'>
            <span className='text-gray-700'>Ingresos Mensuales:</span>
            <span className='font-bold text-gray-800'>
              {formatCurrency(formData.monthlyIncome)}
            </span>
          </div>
          <div className='flex justify-between'>
            <span className='text-gray-700'>Total Descuentos:</span>
            <span className='font-bold text-red-600'>{formatCurrency(totalDeductions)}</span>
          </div>
          <div className='border-t border-green-300 pt-2 mt-2'>
            <div className='flex justify-between'>
              <span className='font-semibold text-gray-800'>Ingreso Disponible:</span>
              <span className='font-bold text-green-600 text-lg'>
                {formatCurrency(availableIncome)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modo de simulación */}
      <div>
        <label className='block text-sm font-semibold text-gray-700 mb-3'>
          Modo de Simulación
        </label>
        <div className='grid grid-cols-2 gap-4 mb-4'>
          <button
            type='button'
            onClick={() => onChange({ simulationMode: 'by-amount' })}
            className={`px-6 py-4 rounded-lg border-2 font-semibold transition-all duration-300 ${
              formData.simulationMode === 'by-amount'
                ? 'border-primary-color bg-primary-color text-white shadow-lg'
                : 'border-gray-300 text-gray-700 hover:border-primary-color'
            }`}
          >
            Por Monto
          </button>
          <button
            type='button'
            onClick={() => onChange({ simulationMode: 'by-quota' })}
            className={`px-6 py-4 rounded-lg border-2 font-semibold transition-all duration-300 ${
              formData.simulationMode === 'by-quota'
                ? 'border-primary-color bg-primary-color text-white shadow-lg'
                : 'border-gray-300 text-gray-700 hover:border-primary-color'
            }`}
          >
            Por Cuota
          </button>
        </div>

        {formData.simulationMode === 'by-amount' && (
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                Monto Deseado
              </label>
              <div className='relative'>
                <span className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600'>
                  $
                </span>
                <input
                  type='number'
                  value={formData.desiredAmount || ''}
                  onChange={(e) =>
                    onChange({ desiredAmount: parseFloat(e.target.value) || undefined })
                  }
                  placeholder='Ej: 10000000'
                  className='w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
                />
              </div>
            </div>
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                Plazo Deseado (meses)
              </label>
              <input
                type='number'
                value={formData.desiredTerm || ''}
                onChange={(e) =>
                  onChange({ desiredTerm: parseInt(e.target.value) || undefined })
                }
                placeholder='Ej: 36'
                min='6'
                max='72'
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
              />
            </div>
          </div>
        )}

        {formData.simulationMode === 'by-quota' && (
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                Cuota Deseada
              </label>
              <div className='relative'>
                <span className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600'>
                  $
                </span>
                <input
                  type='number'
                  value={formData.desiredQuota || ''}
                  onChange={(e) =>
                    onChange({ desiredQuota: parseFloat(e.target.value) || undefined })
                  }
                  placeholder='Ej: 300000'
                  className='w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
                />
              </div>
            </div>
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                Plazo Deseado (meses)
              </label>
              <input
                type='number'
                value={formData.desiredTerm || ''}
                onChange={(e) =>
                  onChange({ desiredTerm: parseInt(e.target.value) || undefined })
                }
                placeholder='Ej: 36'
                min='6'
                max='72'
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
              />
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className='flex justify-between pt-4'>
        <button
          onClick={onPrevious}
          className='px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-300'
        >
          ← Anterior
        </button>
        <button
          onClick={onNext}
          disabled={formData.monthlyIncome === 0}
          className='px-6 py-3 bg-gradient-to-r from-primary-color to-accent-color text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          Calcular Simulación →
        </button>
      </div>
    </div>
  )
}

export default SimulationStep3

