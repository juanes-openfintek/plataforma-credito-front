'use client'

import { useEffect, useState } from 'react'
import getApprovalStatus, {
  ApprovalStatus,
} from '../../../services/getApprovalStatus'

interface ApprovalStatusCardProps {
  creditId: string
  showDetails?: boolean
}

/**
 * ApprovalStatusCard displays the approval status and evaluation of a credit
 * @param {string} creditId - The credit ID
 * @param {boolean} showDetails - Whether to show detailed validation information
 * @example <ApprovalStatusCard creditId="123" showDetails={true} />
 * @returns The ApprovalStatusCard component
 */
const ApprovalStatusCard = ({
  creditId,
  showDetails = false,
}: ApprovalStatusCardProps) => {
  const [approvalData, setApprovalData] = useState<ApprovalStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApprovalStatus = async () => {
      setLoading(true)
      const data = await getApprovalStatus(creditId)
      setApprovalData(data)
      setLoading(false)
    }

    if (creditId) {
      fetchApprovalStatus()
    }
  }, [creditId])

  if (loading) {
    return (
      <div className='w-full bg-light-color-one rounded-3xl p-6 animate-pulse'>
        <div className='h-8 bg-gray-300 rounded w-1/3 mb-4'></div>
        <div className='h-4 bg-gray-300 rounded w-2/3 mb-2'></div>
        <div className='h-4 bg-gray-300 rounded w-1/2'></div>
      </div>
    )
  }

  if (!approvalData) {
    return (
      <div className='w-full bg-light-color-one rounded-3xl p-6'>
        <p className='text-gray-600'>
          No se pudo cargar la información de aprobación
        </p>
      </div>
    )
  }

  const getApprovalLevelColor = (level: string) => {
    switch (level) {
      case 'AUTO':
        return 'bg-green-100 text-green-800'
      case 'LEVEL1':
        return 'bg-blue-100 text-blue-800'
      case 'LEVEL2':
        return 'bg-yellow-100 text-yellow-800'
      case 'COMMITTEE':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getApprovalLevelText = (level: string) => {
    switch (level) {
      case 'AUTO':
        return 'Aprobación Automática'
      case 'LEVEL1':
        return 'Nivel 1 (hasta $25,000)'
      case 'LEVEL2':
        return 'Nivel 2 (hasta $100,000)'
      case 'COMMITTEE':
        return 'Comité de Crédito'
      default:
        return level
    }
  }

  return (
    <div className='w-full bg-light-color-one rounded-3xl mb-6'>
      {/* Header */}
      <div
        className={`flex flex-row items-center justify-between p-6 rounded-t-3xl ${
          approvalData.canAutoApprove
            ? 'bg-green-50 border-l-4 border-green-500'
            : 'bg-yellow-50 border-l-4 border-yellow-500'
        }`}
      >
        <div>
          <h3 className='text-xl font-semibold text-gray-900 mb-1'>
            Estado de Aprobación
          </h3>
          <p className='text-sm text-gray-600'>
            Radicado No. {approvalData.radicationNumber}
          </p>
        </div>
        <div className='text-right'>
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium ${getApprovalLevelColor(
              approvalData.approvalLevel
            )}`}
          >
            {getApprovalLevelText(approvalData.approvalLevel)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className='p-6 space-y-4'>
        {/* Auto Approve Status */}
        <div className='flex items-center justify-between pb-4 border-b border-gray-200'>
          <div>
            <p className='font-medium text-gray-900'>
              {approvalData.canAutoApprove
                ? '✅ Califica para aprobación automática'
                : '⚠️ Requiere aprobación manual'}
            </p>
            <p className='text-sm text-gray-600 mt-1'>
              Tiempo estimado: {approvalData.expectedApprovalDays}{' '}
              {approvalData.expectedApprovalDays === 1
                ? 'día hábil'
                : 'días hábiles'}
            </p>
          </div>
        </div>

        {/* Credit Info */}
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <p className='text-sm text-gray-600'>Estado actual</p>
            <p className='font-medium text-gray-900'>
              {approvalData.currentStatus}
            </p>
          </div>
          <div>
            <p className='text-sm text-gray-600'>Monto solicitado</p>
            <p className='font-medium text-gray-900'>
              ${approvalData.context.creditAmount.toLocaleString()}
            </p>
          </div>
          <div>
            <p className='text-sm text-gray-600'>Plazo</p>
            <p className='font-medium text-gray-900'>
              {approvalData.context.creditTerm} meses
            </p>
          </div>
          <div>
            <p className='text-sm text-gray-600'>Score de crédito</p>
            <p className='font-medium text-gray-900'>
              {approvalData.context.userScore}/100
            </p>
          </div>
        </div>

        {/* Detailed Context (Optional) */}
        {showDetails && (
          <div className='mt-6 pt-4 border-t border-gray-200'>
            <h4 className='font-medium text-gray-900 mb-3'>
              Información Financiera
            </h4>
            <div className='grid grid-cols-2 gap-4 text-sm'>
              <div>
                <p className='text-gray-600'>Ingreso mensual</p>
                <p className='font-medium'>
                  ${approvalData.context.monthlyIncome.toLocaleString()}
                </p>
              </div>
              <div>
                <p className='text-gray-600'>Deuda mensual</p>
                <p className='font-medium'>
                  ${approvalData.context.currentMonthlyDebt.toLocaleString()}
                </p>
              </div>
              <div>
                <p className='text-gray-600'>Meses de empleo</p>
                <p className='font-medium'>
                  {approvalData.context.employmentMonths} meses
                </p>
              </div>
              <div>
                <p className='text-gray-600'>Historial crediticio</p>
                <p className='font-medium'>
                  {approvalData.context.creditHistoryMonths} meses
                </p>
              </div>
            </div>

            {/* Debt to Income Ratio */}
            <div className='mt-4 p-4 bg-gray-50 rounded-lg'>
              <p className='text-sm text-gray-600 mb-1'>
                Relación Deuda/Ingreso
              </p>
              <div className='flex items-center'>
                <div className='flex-1 bg-gray-200 rounded-full h-2 mr-3'>
                  <div
                    className={`h-2 rounded-full ${
                      approvalData.context.currentMonthlyDebt /
                        approvalData.context.monthlyIncome <
                      0.4
                        ? 'bg-green-500'
                        : approvalData.context.currentMonthlyDebt /
                              approvalData.context.monthlyIncome <
                            0.7
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                    }`}
                    style={{
                      width: `${Math.min(
                        (approvalData.context.currentMonthlyDebt /
                          approvalData.context.monthlyIncome) *
                          100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
                <span className='text-sm font-medium'>
                  {(
                    (approvalData.context.currentMonthlyDebt /
                      approvalData.context.monthlyIncome) *
                    100
                  ).toFixed(1)}
                  %
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ApprovalStatusCard
