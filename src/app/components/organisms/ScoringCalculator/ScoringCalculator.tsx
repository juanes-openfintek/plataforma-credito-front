'use client'

import { useState } from 'react'
import calculateScore, {
  ScoreResponse,
  CalculateScoreRequest,
} from '../../../services/calculateScore'
import getPreApproval, {
  PreApprovalResponse,
} from '../../../services/getPreApproval'

interface ScoringCalculatorProps {
  showPreApproval?: boolean
  onScoreCalculated?: (score: number) => void
}

/**
 * ScoringCalculator allows users to calculate their credit score before applying
 * @param {boolean} showPreApproval - Show pre-approval estimation with payments (default: false)
 * @param {function} onScoreCalculated - Callback when score is calculated
 * @example <ScoringCalculator showPreApproval={true} />
 * @returns The ScoringCalculator component
 */
const ScoringCalculator = ({
  showPreApproval = false,
  onScoreCalculated,
}: ScoringCalculatorProps) => {
  const [formData, setFormData] = useState<CalculateScoreRequest>({
    monthlyIncome: undefined,
    currentDebt: undefined,
    creditHistoryMonths: undefined,
    employmentMonths: undefined,
    requestedAmount: undefined,
    requestedTerm: undefined,
  })

  const [result, setResult] = useState<ScoreResponse | PreApprovalResponse | null>(
    null
  )
  const [loading, setLoading] = useState(false)

  const handleInputChange = (field: keyof CalculateScoreRequest, value: string) => {
    const numValue = value === '' ? undefined : parseFloat(value)
    setFormData((prev) => ({
      ...prev,
      [field]: numValue,
    }))
  }

  const handleCalculate = async () => {
    setLoading(true)
    setResult(null)

    try {
      let data: ScoreResponse | PreApprovalResponse | null

      if (showPreApproval) {
        data = await getPreApproval(formData)
      } else {
        data = await calculateScore(formData)
      }

      setResult(data)

      if (data && onScoreCalculated) {
        onScoreCalculated(data.score)
      }
    } catch (error) {
      console.error('Error calculating:', error)
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score < 40) return 'text-red-600'
    if (score < 60) return 'text-orange-600'
    if (score < 70) return 'text-yellow-600'
    if (score < 80) return 'text-lime-600'
    if (score < 90) return 'text-green-600'
    return 'text-emerald-700'
  }

  const getScoreBarColor = (score: number) => {
    if (score < 40) return 'bg-red-500'
    if (score < 60) return 'bg-orange-500'
    if (score < 70) return 'bg-yellow-500'
    if (score < 80) return 'bg-lime-500'
    if (score < 90) return 'bg-green-500'
    return 'bg-emerald-600'
  }

  return (
    <div className='w-full bg-white rounded-3xl shadow-lg p-8'>
      {/* Title */}
      <div className='mb-6'>
        <h2 className='text-2xl font-bold text-gray-900 mb-2'>
          {showPreApproval ? 'Calculadora de Pre-Aprobación' : 'Calculadora de Score Crediticio'}
        </h2>
        <p className='text-gray-600'>
          {showPreApproval
            ? 'Descubre cuánto puedes solicitar y el pago mensual estimado'
            : 'Calcula tu score crediticio antes de solicitar un crédito'}
        </p>
      </div>

      {/* Form */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
        {/* Monthly Income */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Ingreso Mensual
          </label>
          <input
            type='number'
            placeholder='Ej: 3000'
            value={formData.monthlyIncome || ''}
            onChange={(e) => handleInputChange('monthlyIncome', e.target.value)}
            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          />
        </div>

        {/* Current Debt */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Deuda Mensual Actual
          </label>
          <input
            type='number'
            placeholder='Ej: 500'
            value={formData.currentDebt || ''}
            onChange={(e) => handleInputChange('currentDebt', e.target.value)}
            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          />
        </div>

        {/* Credit History */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Historial Crediticio (meses)
          </label>
          <input
            type='number'
            placeholder='Ej: 24'
            value={formData.creditHistoryMonths || ''}
            onChange={(e) => handleInputChange('creditHistoryMonths', e.target.value)}
            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          />
        </div>

        {/* Employment Months */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Tiempo de Empleo (meses)
          </label>
          <input
            type='number'
            placeholder='Ej: 36'
            value={formData.employmentMonths || ''}
            onChange={(e) => handleInputChange('employmentMonths', e.target.value)}
            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          />
        </div>

        {showPreApproval && (
          <>
            {/* Requested Amount */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Monto Solicitado (opcional)
              </label>
              <input
                type='number'
                placeholder='Ej: 10000'
                value={formData.requestedAmount || ''}
                onChange={(e) => handleInputChange('requestedAmount', e.target.value)}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>

            {/* Requested Term */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Plazo (meses, opcional)
              </label>
              <input
                type='number'
                placeholder='Ej: 12'
                value={formData.requestedTerm || ''}
                onChange={(e) => handleInputChange('requestedTerm', e.target.value)}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>
          </>
        )}
      </div>

      {/* Calculate Button */}
      <button
        onClick={handleCalculate}
        disabled={loading}
        className='w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all'
      >
        {loading ? 'Calculando...' : showPreApproval ? 'Calcular Pre-Aprobación' : 'Calcular Score'}
      </button>

      {/* Results */}
      {result && (
        <div className='mt-8 space-y-6'>
          {/* Score Display */}
          <div className='bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-semibold text-gray-900'>Tu Score Crediticio</h3>
              <div className={`text-5xl font-bold ${getScoreColor(result.score)}`}>
                {result.score}
                <span className='text-2xl text-gray-600'>/100</span>
              </div>
            </div>

            {/* Score Bar */}
            <div className='w-full bg-gray-200 rounded-full h-4 mb-2'>
              <div
                className={`h-4 rounded-full transition-all duration-500 ${getScoreBarColor(
                  result.score
                )}`}
                style={{ width: `${result.score}%` }}
              ></div>
            </div>

            <p className='text-sm text-gray-700 mt-3'>{result.message}</p>

            {/* Approval Likelihood */}
            <div className='mt-4 flex items-center justify-between'>
              <span className='text-sm text-gray-600'>Probabilidad de aprobación:</span>
              <span className='text-lg font-bold text-gray-900'>
                {result.approvalLikelihood}%
              </span>
            </div>
          </div>

          {/* Breakdown */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <div className='bg-white border border-gray-200 rounded-lg p-4'>
              <p className='text-xs text-gray-600 mb-1'>Base</p>
              <p className='text-2xl font-bold text-gray-900'>{result.breakdown.baseScore}</p>
            </div>
            <div className='bg-white border border-gray-200 rounded-lg p-4'>
              <p className='text-xs text-gray-600 mb-1'>Ingresos</p>
              <p className='text-2xl font-bold text-gray-900'>
                +{result.breakdown.incomeRatioScore}
              </p>
            </div>
            <div className='bg-white border border-gray-200 rounded-lg p-4'>
              <p className='text-xs text-gray-600 mb-1'>Historial</p>
              <p className='text-2xl font-bold text-gray-900'>
                +{result.breakdown.creditHistoryScore}
              </p>
            </div>
            <div className='bg-white border border-gray-200 rounded-lg p-4'>
              <p className='text-xs text-gray-600 mb-1'>Empleo</p>
              <p className='text-2xl font-bold text-gray-900'>
                +{result.breakdown.employmentStabilityScore}
              </p>
            </div>
          </div>

          {/* Recommendations */}
          <div className='bg-white border border-gray-200 rounded-lg p-6'>
            <h4 className='font-semibold text-gray-900 mb-3'>Recomendaciones</h4>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <p className='text-sm text-gray-600'>Monto recomendado:</p>
                <p className='text-xl font-bold text-gray-900'>
                  ${result.recommendedAmount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className='text-sm text-gray-600'>Plazo recomendado:</p>
                <p className='text-xl font-bold text-gray-900'>{result.recommendedTerm} meses</p>
              </div>
            </div>
          </div>

          {/* Pre-Approval Details */}
          {showPreApproval && 'estimatedMonthlyPayment' in result && (
            <div className='bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6'>
              <h4 className='font-semibold text-gray-900 mb-4 text-lg'>
                Estimación de Pre-Aprobación
              </h4>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div>
                  <p className='text-sm text-gray-600 mb-1'>Pago Mensual</p>
                  <p className='text-2xl font-bold text-gray-900'>
                    ${result.estimatedMonthlyPayment.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className='text-sm text-gray-600 mb-1'>Costo Total</p>
                  <p className='text-2xl font-bold text-gray-900'>
                    ${result.estimatedTotalCost.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className='text-sm text-gray-600 mb-1'>Intereses</p>
                  <p className='text-2xl font-bold text-gray-900'>
                    ${result.estimatedTotalInterest.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className='mt-4 pt-4 border-t border-green-200'>
                <p className='text-sm text-gray-600'>
                  Tasa de interés aplicada: <strong>{result.interestRate}% anual</strong>
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ScoringCalculator
