'use client'
import React, { useState, useEffect } from 'react'
import { CreacionFormData } from '../CreacionModule/CreacionModule'

interface Props {
  formData: CreacionFormData
  onNext: (data: Partial<CreacionFormData>) => void
}

const Step6RiskCentral = ({ formData, onNext }: Props) => {
  const [isLoading, setIsLoading] = useState(true)
  const [riskData, setRiskData] = useState<any>(null)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(value)
  }

  useEffect(() => {
    setIsLoading(true)
    const timeout = setTimeout(() => {
      const monthlyIncome = formData.monthlyIncome || 0
      const monthlyExpenses = formData.monthlyExpenses || 0
      const availableIncome = Math.max(monthlyIncome - monthlyExpenses, 0)
      const maxQuota = Math.max(availableIncome * 0.5, 0)
      const currentQuotaUsage = 0.37

      const mockRiskData = {
        name: 'Cliente consultado',
        document: formData.identificationNumber || 'Sin documento',
        riskLevel: 'BAJO',
        score: 742,
        status: 'VIABLE',
        activeDebts: 3,
        totalDebt: 12500000,
        monthlyIncome,
        monthlyExpenses,
        lastCheck: new Date().toLocaleDateString('es-CO'),
        consultedEntities: ['DataCredito (Experian)', 'TransUnion', 'Listas restrictivas SAGRILAFT'],
        summary: {
          availableIncome,
          maxQuota,
          currentQuotaUsage,
          recommendedQuota: Math.max(Math.round(maxQuota * (1 - currentQuotaUsage)), 0),
        },
        detailSegments: [
          {
            id: 'bancos',
            title: 'Sector financiero',
            status: 'AL DIA',
            amount: 4200000,
            items: ['Credito libre inversion Bancolombia', 'Cuota $420.000 - plazo restante 18 meses'],
          },
          {
            id: 'tarjetas',
            title: 'Sector Solidario',
            status: 'UTILIZACION 38%',
            amount: 2800000,
            items: ['2 tarjetas activas (Visa y MasterCard)', 'Pagos realizados antes del corte los ultimos 12 meses'],
          },
          {
            id: 'microcreditos',
            title: 'Sector Real',
            status: 'CANCELADO',
            amount: 0,
            items: ['Ultimo microcredito cancelado en 2023', 'Sin obligaciones vigentes con fintech'],
          },
          {
            id: 'servicios',
            title: 'Telcos',
            status: 'SIN REPORTE NEGATIVO',
            amount: 0,
            items: ['Pagos al dia con operadores moviles y energia', 'Sin suspensiones ni acuerdos activos'],
          },
        ],
        paymentBehavior: {
          monthsReported: 96,
          enquiries90Days: 1,
          lastEnquiry: 'OpenFintek demo - hace 12 dias',
          maxDaysPastDue: 0,
        },
        alerts: [
          { label: 'Consultas ultimos 90 dias', value: '1 (OpenFintek demo)' },
          { label: 'Reportes negativos', value: 'Sin registros vigentes' },
          { label: 'Listas restrictivas', value: 'No aparece' },
        ],
      }

      setRiskData(mockRiskData)
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timeout)
  }, [formData])

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'BAJO':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'MEDIO':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'ALTO':
        return 'bg-red-100 text-red-800 border-red-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const handleContinue = () => {
    const isViable = riskData?.status === 'VIABLE'
    onNext({
      riskStatus: isViable ? 'aprobado' : 'rechazado',
      riskScore: riskData?.score || 0,
      riskDetails: riskData || {},
    })
  }

  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-2xl font-bold text-gray-800 mb-4'>Verificacion de Centrales de Riesgo</h3>
        <p className='text-gray-600 mb-6'>Consultando datos de centrales de riesgo y listas restrictivas...</p>
      </div>

      {isLoading ? (
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-8 text-center'>
          <div className='inline-block'>
            <div className='w-12 h-12 border-4 border-primary-color border-t-accent-color rounded-full animate-spin mx-auto mb-4'></div>
          </div>
          <p className='text-gray-700 font-semibold mb-2'>Consultando centrales de riesgo...</p>
          <p className='text-gray-600 text-sm'>Por favor espera mientras verificamos el historial del cliente</p>
        </div>
      ) : riskData && riskData.status === 'VIABLE' ? (
        <>
          <div className={`border-2 rounded-lg p-6 space-y-4 ${getRiskColor(riskData.riskLevel)}`}>
            <div className='flex flex-wrap gap-6 justify-between items-start'>
              <div>
                <p className='font-semibold mb-1'>Nivel de riesgo</p>
                <p className='text-3xl font-bold'>{riskData.riskLevel}</p>
              </div>
              <div className='text-center'>
                <p className='text-sm font-semibold mb-1'>Score</p>
                <p className='text-4xl font-bold'>{riskData.score}</p>
              </div>
              <div className='text-center'>
                <p className='text-sm font-semibold mb-1'>Estado</p>
                <p className='px-4 py-2 rounded-full bg-white font-bold'>Viable</p>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
              <div>
                <p className='font-semibold text-gray-700'>Cliente consultado</p>
                <p className='text-gray-600'>{riskData.name}</p>
                <p className='text-gray-500'>{riskData.document}</p>
              </div>
              <div>
                <p className='font-semibold text-gray-700'>Fuentes consultadas</p>
                <ul className='text-gray-600 list-disc list-inside'>
                  {riskData.consultedEntities.map((entity: string) => (
                    <li key={entity}>{entity}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className='font-semibold text-gray-700'>Capacidad estimada</p>
                <p className='text-gray-600'>Ingreso libre: {formatCurrency(riskData.summary.availableIncome)}</p>
                <p className='text-gray-600'>Cupo maximo sugerido: {formatCurrency(riskData.summary.maxQuota)}</p>
              </div>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {riskData.detailSegments.map((segment: any) => (
              <div key={segment.id} className='bg-white border border-gray-200 rounded-lg p-5'>
                <div className='flex items-center justify-between'>
                  <h4 className='font-semibold text-gray-800'>{segment.title}</h4>
                  <span className='text-xs font-bold text-primary-color'>{segment.status}</span>
                </div>
                <p className='text-sm text-gray-600 mt-2'>Saldo reportado: {formatCurrency(segment.amount)}</p>
                <ul className='mt-3 text-xs text-gray-500 space-y-1 list-disc list-inside'>
                  {segment.items.map((item: string) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='bg-white border border-gray-200 rounded-lg p-5'>
              <h4 className='font-semibold text-gray-800 mb-3'>Comportamiento de pago</h4>
              <ul className='text-sm text-gray-600 space-y-1'>
                <li>Meses reportados: {riskData.paymentBehavior.monthsReported}</li>
                <li>Consultas ultimos 90 dias: {riskData.paymentBehavior.enquiries90Days}</li>
                <li>Ultima consulta: {riskData.paymentBehavior.lastEnquiry}</li>
                <li>Maximo de dias en mora: {riskData.paymentBehavior.maxDaysPastDue}</li>
              </ul>
            </div>
            <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-5'>
              <h4 className='font-semibold text-yellow-900 mb-3'>Alertas y monitoreo</h4>
              <ul className='text-sm text-yellow-800 space-y-1'>
                {riskData.alerts.map((alert: any) => (
                  <li key={alert.label}>
                    <span className='font-semibold'>{alert.label}:</span> {alert.value}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
            <h4 className='font-semibold text-green-900 mb-2'>Recomendacion</h4>
            <p className='text-sm text-green-800'>El cliente mantiene un perfil saludable y su estado es viable para continuar con el proceso de credito. No se evidencian alertas que bloqueen la desembolsacion.</p>
          </div>
        </>
      ) : (
        <div className='bg-red-50 border border-red-200 rounded-lg p-6'>
          <h4 className='font-semibold text-red-900 mb-2'>Cliente No Viable</h4>
          <p className='text-sm text-red-800'>El cliente no cumple con los requisitos de riesgo. Por favor verifica los datos.</p>
        </div>
      )}

      <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
        <h4 className='font-semibold text-blue-900 mb-2'>Informacion de consulta</h4>
        <ul className='text-sm text-blue-800 space-y-1'>
          <li>Ultima consulta: {riskData?.lastCheck || 'En proceso'}</li>
          <li>Fuentes: {riskData?.consultedEntities?.join(', ') || 'No disponible'}</li>
          <li>Deudas activas: {riskData?.activeDebts ?? '-'}</li>
          <li>Deuda total: {riskData ? formatCurrency(riskData.totalDebt) : '$0'}</li>
        </ul>
      </div>

      <div className='flex gap-4 pt-4'>
        <button
          onClick={handleContinue}
          className='flex-1 bg-gradient-to-r from-primary-color to-accent-color text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all duration-300'
        >
          Continuar →
        </button>
      </div>
    </div>
  )
}

export default Step6RiskCentral
