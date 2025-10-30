'use client'

import { useEffect, useState } from 'react'
import getMySuggestions, {
  SuggestionItem,
  SuggestionsResponse,
} from '../../../services/getMySuggestions'

interface SuggestionsCardProps {
  userId?: string
  compact?: boolean
}

/**
 * SuggestionsCard displays personalized profile improvement suggestions
 * @param {string} userId - Optional user ID (defaults to current user)
 * @param {boolean} compact - Show compact version (default: false)
 * @example <SuggestionsCard compact={false} />
 * @returns The SuggestionsCard component
 */
const SuggestionsCard = ({ compact = false }: SuggestionsCardProps) => {
  const [suggestions, setSuggestions] = useState<SuggestionsResponse | null>(
    null
  )
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSuggestions = async () => {
      setLoading(true)
      const data = await getMySuggestions()
      setSuggestions(data)
      setLoading(false)
    }

    fetchSuggestions()
  }, [])

  if (loading) {
    return (
      <div className='w-full bg-light-color-one rounded-3xl p-6 animate-pulse'>
        <div className='h-6 bg-gray-300 rounded w-1/3 mb-4'></div>
        <div className='h-4 bg-gray-300 rounded w-2/3 mb-2'></div>
        <div className='h-4 bg-gray-300 rounded w-1/2'></div>
      </div>
    )
  }

  if (!suggestions || suggestions.suggestions.length === 0) {
    return (
      <div className='w-full bg-light-color-one rounded-3xl p-6'>
        <div className='flex items-center'>
          <span className='text-2xl mr-3'>✅</span>
          <div>
            <h3 className='text-lg font-semibold text-gray-900'>
              ¡Perfil completo!
            </h3>
            <p className='text-sm text-gray-600'>
              No tienes sugerencias pendientes
            </p>
          </div>
        </div>
      </div>
    )
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800 border-red-300'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'LOW':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'Alta prioridad'
      case 'MEDIUM':
        return 'Prioridad media'
      case 'LOW':
        return 'Baja prioridad'
      default:
        return priority
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'DOCUMENTS':
        return '📄'
      case 'EMPLOYMENT':
        return '💼'
      case 'FINANCIAL':
        return '💰'
      case 'PERSONAL_INFO':
        return '👤'
      case 'CREDIT_HISTORY':
        return '📊'
      default:
        return '📋'
    }
  }

  // Sort suggestions by priority
  const sortedSuggestions = [...suggestions.suggestions].sort((a, b) => {
    const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })

  if (compact) {
    return (
      <div className='w-full bg-light-color-one rounded-3xl p-6'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-lg font-semibold text-gray-900'>
            Sugerencias de mejora
          </h3>
          <span className='px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium'>
            {suggestions.suggestions.length} pendiente
            {suggestions.suggestions.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className='space-y-2'>
          {sortedSuggestions.slice(0, 3).map((suggestion, index) => (
            <div
              key={index}
              className='flex items-start p-3 bg-white rounded-lg border border-gray-200'
            >
              <span className='text-xl mr-3'>
                {getCategoryIcon(suggestion.category)}
              </span>
              <div className='flex-1'>
                <p className='text-sm font-medium text-gray-900'>
                  {suggestion.message}
                </p>
                <p className='text-xs text-gray-600 mt-1'>
                  {suggestion.action}
                </p>
              </div>
              <span className='text-sm font-medium text-gray-900'>
                {suggestion.impactOnScore > 0 ? '+' : ''}
                {suggestion.impactOnScore}
              </span>
            </div>
          ))}
        </div>

        {suggestions.suggestions.length > 3 && (
          <p className='text-center text-sm text-gray-600 mt-3'>
            + {suggestions.suggestions.length - 3} más
          </p>
        )}
      </div>
    )
  }

  return (
    <div className='w-full bg-light-color-one rounded-3xl mb-6'>
      {/* Header */}
      <div className='bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-t-3xl border-l-4 border-blue-500'>
        <div className='flex items-center justify-between'>
          <div>
            <h3 className='text-xl font-semibold text-gray-900 mb-1'>
              Sugerencias para mejorar tu perfil
            </h3>
            <p className='text-sm text-gray-600'>
              Completa estos pasos para aumentar tu probabilidad de aprobación
            </p>
          </div>
          <div className='text-right'>
            <div className='text-3xl font-bold text-gray-900'>
              {suggestions.currentScore}
              <span className='text-lg text-gray-600'>/100</span>
            </div>
            <p className='text-xs text-gray-600'>Score actual</p>
          </div>
        </div>
      </div>

      {/* Score Impact */}
      <div className='p-6 bg-white border-b border-gray-200'>
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-sm text-gray-600'>
              Potencial de mejora si completas todas las sugerencias
            </p>
            <p className='text-2xl font-bold text-green-600 mt-1'>
              {suggestions.potentialScore} puntos
            </p>
          </div>
          <div className='text-right'>
            <p className='text-sm text-gray-600'>Impacto total</p>
            <p
              className={`text-2xl font-bold mt-1 ${
                suggestions.totalImpact < 0 ? 'text-orange-600' : 'text-green-600'
              }`}
            >
              {suggestions.totalImpact > 0 ? '+' : ''}
              {suggestions.totalImpact} pts
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className='mt-4'>
          <div className='flex items-center justify-between mb-2'>
            <span className='text-sm text-gray-600'>
              Completitud del perfil
            </span>
            <span className='text-sm font-medium text-gray-900'>
              {suggestions.completionPercentage}%
            </span>
          </div>
          <div className='w-full bg-gray-200 rounded-full h-3'>
            <div
              className='bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500'
              style={{ width: `${suggestions.completionPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Suggestions List */}
      <div className='p-6 space-y-4'>
        {sortedSuggestions.map((suggestion: SuggestionItem, index: number) => (
          <div
            key={index}
            className={`p-4 rounded-lg border-2 ${getPriorityColor(
              suggestion.priority
            )}`}
          >
            <div className='flex items-start'>
              <span className='text-2xl mr-3'>
                {getCategoryIcon(suggestion.category)}
              </span>
              <div className='flex-1'>
                <div className='flex items-center justify-between mb-2'>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded ${getPriorityColor(
                      suggestion.priority
                    )}`}
                  >
                    {getPriorityText(suggestion.priority)}
                  </span>
                  <span className='text-sm font-bold text-gray-900'>
                    {suggestion.impactOnScore > 0 ? '+' : ''}
                    {suggestion.impactOnScore} puntos
                  </span>
                </div>
                <h4 className='font-semibold text-gray-900 mb-1'>
                  {suggestion.message}
                </h4>
                <p className='text-sm text-gray-700 mb-2'>
                  <strong>Acción:</strong> {suggestion.action}
                </p>
                <p className='text-xs text-gray-600'>
                  ⏱️ Tiempo estimado: {suggestion.timeEstimate}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SuggestionsCard
