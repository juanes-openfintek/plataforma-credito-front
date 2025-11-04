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

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockRiskData = {
        name: `${formData.firstName} ${formData.lastName}`,
        document: formData.identificationNumber,
        riskLevel: 'BAJO',
        score: 750,
        status: 'APTO',
        activeDebts: 2,
        totalDebt: 8500000,
        lastCheck: new Date().toLocaleDateString('es-CO'),
        details: {
          cajasCompensacion: {
            status: 'SIN DEUDA',
            amount: 0,
          },
          bancos: {
            status: 'APTO',
            amount: 3500000,
            activeLoans: 1,
          },
          tarjetasCredito: {
            status: 'APTO',
            amount: 5000000,
            activeCards: 2,
          },
          serviciosTecnicos: {
            status: 'SIN DEUDA',
            amount: 0,
          },
          datacrédito: {
            morosidad: 'NO',
            años: 8,
            score: 750,
          },
        },
      }
      setRiskData(mockRiskData)
      setIsLoading(false)
    }, 2000)
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
    onNext({
      riskStatus: riskData?.status === 'APTO' ? 'aprobado' : 'rechazado',
      riskScore: riskData?.score || 0,
      riskDetails: riskData?.details || {},
    })
  }

  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-2xl font-bold text-gray-800 mb-4'>Verificación de Centrales de Riesgo</h3>
        <p className='text-gray-600 mb-6'>Consultando datos de centrales de riesgo...</p>
      </div>

      {isLoading ? (
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-8 text-center'>
          <div className='inline-block'>
            <div className='w-12 h-12 border-4 border-primary-color border-t-accent-color rounded-full animate-spin mx-auto mb-4'></div>
          </div>
          <p className='text-gray-700 font-semibold mb-2'>Consultando centrales de riesgo...</p>
          <p className='text-gray-600 text-sm'>Por favor espera mientras verificamos el historial del cliente</p>
        </div>
      ) : riskData && riskData.status === 'APTO' ? (
        <>
          {/* Risk Summary */}
          <div className={`border-2 rounded-lg p-6 ${getRiskColor(riskData.riskLevel)}`}>
            <div className='flex justify-between items-start'>
              <div>
                <p className='font-semibold mb-1'>Nivel de Riesgo</p>
                <p className='text-3xl font-bold'>{riskData.riskLevel}</p>
              </div>
              <div className='text-center'>
                <p className='text-sm font-semibold mb-1'>Score de Riesgo</p>
                <p className='text-4xl font-bold'>{riskData.score}</p>
              </div>
              <div className='text-center'>
                <p className='text-sm font-semibold mb-1'>Estado</p>
                <p className='px-4 py-2 rounded-full bg-white font-bold'>✓ APTO</p>
              </div>
            </div>
          </div>

          {/* Risk Details Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='bg-gray-50 border border-gray-200 rounded-lg p-4'>
              <h4 className='font-semibold text-gray-800 mb-3'>Cajas de Compensación</h4>
              <p className='text-sm text-green-600 font-semibold'>Sin Deuda</p>
              <p className='text-sm text-gray-600'>$0 COP</p>
            </div>

            <div className='bg-gray-50 border border-gray-200 rounded-lg p-4'>
              <h4 className='font-semibold text-gray-800 mb-3'>Bancos</h4>
              <p className='text-sm text-blue-600 font-semibold'>Apto</p>
              <p className='text-sm text-gray-600'>${riskData.details.bancos.amount.toLocaleString('es-CO')} COP</p>
              <p className='text-xs text-gray-500 mt-1'>{riskData.details.bancos.activeLoans} crédito(s) activo(s)</p>
            </div>

            <div className='bg-gray-50 border border-gray-200 rounded-lg p-4'>
              <h4 className='font-semibold text-gray-800 mb-3'>Tarjetas de Crédito</h4>
              <p className='text-sm text-blue-600 font-semibold'>Apto</p>
              <p className='text-sm text-gray-600'>${riskData.details.tarjetasCredito.amount.toLocaleString('es-CO')} COP</p>
              <p className='text-xs text-gray-500 mt-1'>{riskData.details.tarjetasCredito.activeCards} tarjeta(s) activa(s)</p>
            </div>

            <div className='bg-gray-50 border border-gray-200 rounded-lg p-4'>
              <h4 className='font-semibold text-gray-800 mb-3'>DataCrédito</h4>
              <p className='text-sm text-green-600 font-semibold'>Sin Morosidad</p>
              <p className='text-sm text-gray-600'>Score: {riskData.details.datacrédito.score}</p>
              <p className='text-xs text-gray-500 mt-1'>{riskData.details.datacrédito.años} años de historial</p>
            </div>
          </div>

          {/* Recommendation */}
          <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
            <h4 className='font-semibold text-green-900 mb-2'>Recomendación</h4>
            <p className='text-sm text-green-800'>
              El cliente tiene un buen perfil de riesgo. Es apto para continuar con el proceso de crédito.
            </p>
          </div>
        </>
      ) : (
        <div className='bg-red-50 border border-red-200 rounded-lg p-6'>
          <h4 className='font-semibold text-red-900 mb-2'>Cliente No Apto</h4>
          <p className='text-sm text-red-800'>
            El cliente no cumple con los requisitos de riesgo. Por favor verifica los datos.
          </p>
        </div>
      )}

      {/* Info Box */}
      <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
        <h4 className='font-semibold text-blue-900 mb-2'>Información de Consulta</h4>
        <ul className='text-sm text-blue-800 space-y-1'>
          <li>✓ Última consulta: {riskData?.lastCheck}</li>
          <li>✓ Deudas activas: {riskData?.activeDebts}</li>
          <li>✓ Deuda total: ${riskData?.totalDebt.toLocaleString('es-CO')} COP</li>
          <li>✓ Datos obtenidos de DataCrédito y centrales de riesgo</li>
        </ul>
      </div>

      {/* Action Buttons */}
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
