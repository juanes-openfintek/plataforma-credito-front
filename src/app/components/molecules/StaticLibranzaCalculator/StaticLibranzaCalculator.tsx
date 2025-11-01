import RoundButton from '../../atoms/RoundButton/RoundButton'
import { useState } from 'react'

interface StaticExample {
  amount: number
  months: number
  interest: number
  insurance: number
  administration: number
  iva: number
  monthlyPayment: number
}

const examples: StaticExample[] = [
  {
    amount: 2000000,
    months: 12,
    interest: 480000,
    insurance: 120000,
    administration: 80000,
    iva: 144000,
    monthlyPayment: 234667,
  },
  {
    amount: 5000000,
    months: 24,
    interest: 1800000,
    insurance: 375000,
    administration: 250000,
    iva: 504000,
    monthlyPayment: 274583,
  },
  {
    amount: 10000000,
    months: 36,
    interest: 5400000,
    insurance: 1080000,
    administration: 720000,
    iva: 1814400,
    monthlyPayment: 427900,
  },
]

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

const getAmountDisplay = (amount: number): string => {
  return (amount / 1000000).toFixed(1)
}

export const StaticLibranzaCalculator = () => {
  const [selectedExample, setSelectedExample] = useState(0)
  const [showDetails, setShowDetails] = useState(false)
  const example = examples[selectedExample]
  const totalCost =
    example.interest + example.insurance + example.administration + example.iva

  return (
    <div className='bg-light-color-one self-auto px-6 py-4 lg:px-12 lg:py-8 text-black max-w-2xl rounded-2xl'>
      {/* Example Selector */}
      <div className='mb-6'>
        <p className='text-sm font-semibold text-gray-600 mb-3'>
          Ejemplos de simulación:
        </p>
        <div className='flex gap-2 flex-wrap'>
          {examples.map((exampleItem, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedExample(index)
                setShowDetails(false)
              }}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                selectedExample === index
                  ? 'bg-primary-color text-white shadow-lg'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              ${getAmountDisplay(exampleItem.amount)}M
            </button>
          ))}
        </div>
      </div>

      {/* Main Display */}
      <div className='space-y-4'>
        {/* Capital */}
        <div className='flex justify-between items-center border-b border-gray-300 pb-3'>
          <span className='text-gray-700 font-semibold'>Capital solicitado</span>
          <span className='text-lg font-bold text-primary-color'>
            {formatCurrency(example.amount)}
          </span>
        </div>

        {/* Plazo */}
        <div className='flex justify-between items-center border-b border-gray-300 pb-3'>
          <span className='text-gray-700 font-semibold'>Plazo</span>
          <span className='text-lg font-bold text-primary-color'>
            {example.months} meses
          </span>
        </div>

        {/* Total Loan Amount */}
        <div className='flex justify-between items-center border-b border-gray-300 pb-3'>
          <span className='text-gray-700 font-semibold'>Valor total a pagar</span>
          <span className='text-lg font-bold text-primary-color'>
            {formatCurrency(example.amount + totalCost)}
          </span>
        </div>

        {/* Monthly Payment Highlight */}
        <div className='bg-gradient-to-r from-cyan-50 to-blue-50 p-4 rounded-lg border-2 border-primary-color'>
          <p className='text-xs text-gray-600 mb-1'>Cuota mensual descuento de nómina</p>
          <p className='text-3xl font-bold text-primary-color'>
            {formatCurrency(example.monthlyPayment)}
          </p>
        </div>

        {/* Expandable Details */}
        <div className='mt-6'>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className='w-full flex justify-between items-center py-3 hover:bg-gray-100 rounded transition-colors'
          >
            <span className='font-semibold text-gray-700'>
              {showDetails ? 'Ocultar detalles' : 'Ver detalles'}
            </span>
            <span
              className={`text-primary-color font-bold text-xl transition-transform ${
                showDetails ? 'rotate-180' : ''
              }`}
            >
              ▼
            </span>
          </button>

          {/* Details Content */}
          {showDetails && (
            <div className='space-y-3 mt-4 pt-4 border-t border-gray-300 animate-in fade-in duration-300'>
              <div className='flex justify-between items-center'>
                <span className='text-gray-600'>Intereses</span>
                <span className='font-semibold text-gray-700'>
                  {formatCurrency(example.interest)}
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-gray-600'>Seguro de vida</span>
                <span className='font-semibold text-gray-700'>
                  {formatCurrency(example.insurance)}
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-gray-600'>Administración</span>
                <span className='font-semibold text-gray-700'>
                  {formatCurrency(example.administration)}
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-gray-600'>IVA</span>
                <span className='font-semibold text-gray-700'>
                  {formatCurrency(example.iva)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Call to Action */}
      <div className='flex mt-8 mx-auto w-[200px] max-lg:w-[250px]'>
        <RoundButton
          text='Solicita tu crédito'
          lightStyle
          onClickHandler={() => {
            // Navigate to application
            window.location.href = '/usuario/onboarding'
          }}
        />
      </div>
    </div>
  )
}

export default StaticLibranzaCalculator
