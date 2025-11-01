'use client'
import React, { useState } from 'react'
import { CreacionFormData } from '../CreacionModule/CreacionModule'

interface Props {
  formData: CreacionFormData
  onNext: (data: Partial<CreacionFormData>) => void
}

const Step5FinancialInfo = ({ formData, onNext }: Props) => {
  const [monthlyIncome, setMonthlyIncome] = useState(formData.monthlyIncome?.toString() || '')
  const [monthlyExpenses, setMonthlyExpenses] = useState(formData.monthlyExpenses?.toString() || '')
  const [creditExperience, setCreditExperience] = useState(formData.creditExperience || '')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!monthlyIncome.trim() || !monthlyExpenses.trim() || !creditExperience) {
      setError('Por favor completa todos los campos')
      return
    }

    const income = parseFloat(monthlyIncome)
    const expenses = parseFloat(monthlyExpenses)

    if (isNaN(income) || isNaN(expenses) || income <= 0 || expenses < 0) {
      setError('Los montos deben ser números válidos y mayores a 0')
      return
    }

    if (expenses > income) {
      setError('Los gastos no pueden ser mayores que los ingresos')
      return
    }

    setError('')
    onNext({
      monthlyIncome: income,
      monthlyExpenses: expenses,
      creditExperience,
    })
  }

  const monthlyDifference = monthlyIncome && monthlyExpenses
    ? parseFloat(monthlyIncome) - parseFloat(monthlyExpenses)
    : 0

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div>
        <h3 className='text-2xl font-bold text-gray-800 mb-4'>Información Financiera</h3>
        <p className='text-gray-600 mb-6'>Ingresa los detalles financieros del cliente</p>
      </div>

      {error && (
        <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg'>
          {error}
        </div>
      )}

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Monthly Income */}
        <div>
          <label className='block text-sm font-semibold text-gray-700 mb-2'>
            Ingresos Mensuales (COP)
          </label>
          <div className='flex items-center'>
            <span className='text-gray-600 font-semibold mr-2'>$</span>
            <input
              type='number'
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(e.target.value)}
              placeholder='2000000'
              className='flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
            />
          </div>
        </div>

        {/* Monthly Expenses */}
        <div>
          <label className='block text-sm font-semibold text-gray-700 mb-2'>
            Gastos Mensuales (COP)
          </label>
          <div className='flex items-center'>
            <span className='text-gray-600 font-semibold mr-2'>$</span>
            <input
              type='number'
              value={monthlyExpenses}
              onChange={(e) => setMonthlyExpenses(e.target.value)}
              placeholder='1000000'
              className='flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
            />
          </div>
        </div>
      </div>

      {/* Credit Experience */}
      <div>
        <label className='block text-sm font-semibold text-gray-700 mb-2'>
          Experiencia de Crédito
        </label>
        <select
          value={creditExperience}
          onChange={(e) => setCreditExperience(e.target.value)}
          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
        >
          <option value=''>-- Selecciona una opción --</option>
          <option value='excelente'>Excelente (Sin atrasos, buen historial)</option>
          <option value='buena'>Buena (Pocos atrasos, historial aceptable)</option>
          <option value='regular'>Regular (Algunos atrasos, historial mixto)</option>
          <option value='pobre'>Pobre (Múltiples atrasos o morosidad)</option>
          <option value='sin-historial'>Sin Historial de Crédito</option>
        </select>
      </div>

      {/* Financial Summary */}
      {monthlyIncome && monthlyExpenses && (
        <div className='bg-green-50 border border-green-200 rounded-lg p-6'>
          <h4 className='font-semibold text-green-900 mb-4'>Resumen Financiero</h4>
          <div className='space-y-2 text-sm text-green-800'>
            <div className='flex justify-between'>
              <span>Ingresos Mensuales:</span>
              <span className='font-bold'>${parseFloat(monthlyIncome).toLocaleString('es-CO')}</span>
            </div>
            <div className='flex justify-between'>
              <span>Gastos Mensuales:</span>
              <span className='font-bold'>${parseFloat(monthlyExpenses).toLocaleString('es-CO')}</span>
            </div>
            <div className='border-t border-green-300 pt-2 mt-2 flex justify-between'>
              <span>Disponibilidad Mensual:</span>
              <span className={`font-bold ${monthlyDifference > 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${monthlyDifference.toLocaleString('es-CO')}
              </span>
            </div>
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

export default Step5FinancialInfo
