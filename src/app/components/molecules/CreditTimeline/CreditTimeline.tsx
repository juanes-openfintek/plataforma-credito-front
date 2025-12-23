'use client'
import React from 'react'

export interface TimelineStep {
  id: string
  title: string
  description: string
  status: 'completed' | 'active' | 'pending' | 'rejected'
  date?: string | Date
  analyst?: string
  notes?: string
}

interface CreditTimelineProps {
  steps: TimelineStep[]
}

const CreditTimeline: React.FC<CreditTimelineProps> = ({ steps }) => {
  const getStatusColor = (status: TimelineStep['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500'
      case 'active':
        return 'bg-blue-500 animate-pulse'
      case 'pending':
        return 'bg-gray-300'
      case 'rejected':
        return 'bg-red-500'
      default:
        return 'bg-gray-300'
    }
  }

  const getStatusIcon = (status: TimelineStep['status']) => {
    switch (status) {
      case 'completed':
        return '✓'
      case 'active':
        return '🔄'
      case 'pending':
        return '○'
      case 'rejected':
        return '✗'
      default:
        return '○'
    }
  }

  const getLineColor = (currentStatus: TimelineStep['status'], nextStatus: TimelineStep['status']) => {
    if (currentStatus === 'completed' && nextStatus === 'completed') {
      return 'bg-green-500'
    }
    if (currentStatus === 'completed' && nextStatus === 'active') {
      return 'bg-gradient-to-b from-green-500 to-blue-500'
    }
    if (currentStatus === 'rejected') {
      return 'bg-red-500'
    }
    return 'bg-gray-300'
  }

  return (
    <div className='relative'>
      {steps.map((step, index) => (
        <div key={step.id} className='flex gap-4 pb-8 last:pb-0'>
          {/* Timeline Line and Icon */}
          <div className='relative flex flex-col items-center'>
            {/* Icon Circle */}
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg z-10 ${getStatusColor(
                step.status
              )}`}
            >
              {getStatusIcon(step.status)}
            </div>
            
            {/* Connecting Line */}
            {index < steps.length - 1 && (
              <div
                className={`w-1 h-full absolute top-12 ${getLineColor(step.status, steps[index + 1]?.status)}`}
                style={{ minHeight: '60px' }}
              />
            )}
          </div>

          {/* Content */}
          <div className='flex-1 pb-4'>
            <div className='bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow'>
              <div className='flex justify-between items-start mb-2'>
                <h3 className='font-bold text-lg'>{step.title}</h3>
                {step.date && (
                  <span className='text-sm text-gray-500'>
                    {new Date(step.date).toLocaleDateString('es-CO', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                )}
              </div>
              
              <p className='text-gray-600 mb-2'>{step.description}</p>
              
              {step.analyst && (
                <p className='text-sm text-gray-500 flex items-center gap-1'>
                  <span>👤</span>
                  <span>Analista: {step.analyst}</span>
                </p>
              )}
              
              {step.notes && (
                <div className='mt-2 p-2 bg-yellow-50 border-l-4 border-yellow-400 rounded'>
                  <p className='text-sm text-yellow-800'>
                    <strong>Nota:</strong> {step.notes}
                  </p>
                </div>
              )}

              {/* Status Badge */}
              <div className='mt-2'>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    step.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : step.status === 'active'
                      ? 'bg-blue-100 text-blue-800'
                      : step.status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {step.status === 'completed'
                    ? 'Completado'
                    : step.status === 'active'
                    ? 'En Proceso'
                    : step.status === 'rejected'
                    ? 'Rechazado'
                    : 'Pendiente'}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default CreditTimeline

