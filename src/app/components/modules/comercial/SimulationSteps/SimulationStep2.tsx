'use client'
import React from 'react'
import { SimulationFormData } from '../SimulationModule/SimulationModule'

interface Props {
  formData: SimulationFormData
  onNext: () => void
  onPrevious: () => void
  onChange: (data: Partial<SimulationFormData>) => void
}

const SimulationStep2 = ({ formData, onNext, onPrevious, onChange }: Props) => {
  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-2xl font-bold text-gray-800 mb-2'>Selección de Producto</h3>
        <p className='text-gray-600'>Configura el producto y corretaje</p>
      </div>

      {/* Corretaje */}
      <div>
        <div className='flex justify-between mb-2'>
          <label className='block text-sm font-semibold text-gray-700'>
            Porcentaje de Corretaje
          </label>
          <span className='text-primary-color font-bold'>
            {formData.brokeragePercentage}%
          </span>
        </div>
        <input
          type='range'
          min='0'
          max='70'
          step='1'
          value={formData.brokeragePercentage}
          onChange={(e) => onChange({ brokeragePercentage: parseInt(e.target.value) })}
          className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-color'
        />
        <div className='flex justify-between text-xs text-gray-500 mt-2'>
          <span>0%</span>
          <span className='text-primary-color font-semibold'>Máximo: 70%</span>
          <span>70%</span>
        </div>
        <p className='text-xs text-gray-600 mt-2'>
          El corretaje máximo permitido es del 70% del monto total del crédito
        </p>
      </div>

      {/* Info Box */}
      <div className='bg-gradient-to-r from-cyan-50 to-blue-50 border border-primary-color rounded-lg p-4'>
        <h4 className='font-semibold text-gray-800 mb-2'>💡 Sobre el Corretaje</h4>
        <ul className='text-sm text-gray-700 space-y-1'>
          <li>
            • El corretaje es la comisión que se descuenta del monto total del crédito
          </li>
          <li>
            • Por ejemplo: Si el crédito es de $10M y el corretaje es 20%, el cliente recibirá
            $8M
          </li>
          <li>• El porcentaje máximo permitido es del 70%</li>
        </ul>
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
          className='px-6 py-3 bg-gradient-to-r from-primary-color to-accent-color text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300'
        >
          Continuar →
        </button>
      </div>
    </div>
  )
}

export default SimulationStep2

