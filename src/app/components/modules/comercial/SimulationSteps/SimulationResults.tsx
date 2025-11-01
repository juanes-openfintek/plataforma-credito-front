'use client'
import React, { useState } from 'react'
import { SimulationFormData } from '../SimulationModule/SimulationModule'

interface Props {
  simulationResult: any
  formData: SimulationFormData
  onSave: () => void
  onBack: () => void
  onConvert: () => void
  loading: boolean
}

const SimulationResults = ({
  simulationResult,
  formData,
  onSave,
  onBack,
  onConvert,
  loading,
}: Props) => {
  const [showPaymentPlan, setShowPaymentPlan] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [clientName, setClientName] = useState(formData.clientName || '')
  const [clientDocument, setClientDocument] = useState(formData.clientDocument || '')
  const [notes, setNotes] = useState(formData.notes || '')

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const handleSave = () => {
    formData.clientName = clientName
    formData.clientDocument = clientDocument
    formData.notes = notes
    onSave()
    setShowSaveModal(false)
  }

  if (!simulationResult) {
    return (
      <div className='text-center py-12'>
        <p className='text-gray-600'>No hay resultados de simulación disponibles</p>
        <button
          onClick={onBack}
          className='mt-4 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors'
        >
          ← Volver
        </button>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h3 className='text-2xl font-bold text-gray-800 mb-2'>Resultados de la Simulación</h3>
        <p className='text-gray-600'>Revisa los detalles y opciones del crédito calculado</p>
      </div>

      {/* Main Results Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Monto Total Alcanzable */}
        <div className='bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200'>
          <div className='flex items-center justify-between mb-2'>
            <span className='text-sm font-semibold text-gray-700'>Monto Total Alcanzable</span>
            <span className='text-2xl'>💰</span>
          </div>
          <p className='text-3xl font-bold text-primary-color'>
            {formatCurrency(simulationResult.totalReachableAmount)}
          </p>
        </div>

        {/* Monto Máximo Entregable */}
        <div className='bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200'>
          <div className='flex items-center justify-between mb-2'>
            <span className='text-sm font-semibold text-gray-700'>Monto Máximo Entregable</span>
            <span className='text-2xl'>💵</span>
          </div>
          <p className='text-3xl font-bold text-green-600'>
            {formatCurrency(simulationResult.maxDeliverableAmount)}
          </p>
        </div>

        {/* Cuota Mensual */}
        <div className='bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-200'>
          <div className='flex items-center justify-between mb-2'>
            <span className='text-sm font-semibold text-gray-700'>Cuota Mensual</span>
            <span className='text-2xl'>📅</span>
          </div>
          <p className='text-3xl font-bold text-purple-600'>
            {formatCurrency(simulationResult.finalQuota)}
          </p>
          <p className='text-xs text-gray-600 mt-2'>Descuento automático de nómina</p>
        </div>

        {/* Plazo */}
        <div className='bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border-2 border-orange-200'>
          <div className='flex items-center justify-between mb-2'>
            <span className='text-sm font-semibold text-gray-700'>Plazo</span>
            <span className='text-2xl'>⏱️</span>
          </div>
          <p className='text-3xl font-bold text-orange-600'>
            {simulationResult.finalTerm} meses
          </p>
        </div>
      </div>

      {/* Distribution */}
      <div className='bg-white rounded-lg shadow-md p-6 border border-gray-200'>
        <h4 className='text-xl font-bold text-gray-800 mb-4'>Distribución del Crédito</h4>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          <div className='text-center p-4 bg-blue-50 rounded-lg'>
            <p className='text-sm text-gray-600 mb-1'>Corretaje</p>
            <p className='text-lg font-bold text-blue-600'>
              {formatCurrency(simulationResult.brokerageAmount)}
            </p>
            <p className='text-xs text-gray-500 mt-1'>
              ({formData.brokeragePercentage}%)
            </p>
          </div>
          <div className='text-center p-4 bg-green-50 rounded-lg'>
            <p className='text-sm text-gray-600 mb-1'>Seguro</p>
            <p className='text-lg font-bold text-green-600'>
              {formatCurrency(simulationResult.insuranceAmount)}
            </p>
          </div>
          <div className='text-center p-4 bg-purple-50 rounded-lg'>
            <p className='text-sm text-gray-600 mb-1'>Fianzas</p>
            <p className='text-lg font-bold text-purple-600'>
              {formatCurrency(simulationResult.guaranteeAmount)}
            </p>
          </div>
          <div className='text-center p-4 bg-yellow-50 rounded-lg'>
            <p className='text-sm text-gray-600 mb-1'>Cuota Disponible</p>
            <p className='text-lg font-bold text-yellow-600'>
              {formatCurrency(simulationResult.availableQuota)}
            </p>
          </div>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className='bg-white rounded-lg shadow-md p-6 border border-gray-200'>
        <h4 className='text-xl font-bold text-gray-800 mb-4'>Desglose de Costos</h4>
        <div className='space-y-3'>
          <div className='flex justify-between items-center py-2 border-b border-gray-200'>
            <span className='text-gray-700'>Intereses</span>
            <span className='font-bold text-gray-800'>
              {formatCurrency(simulationResult.totalInterest)}
            </span>
          </div>
          <div className='flex justify-between items-center py-2 border-b border-gray-200'>
            <span className='text-gray-700'>Seguro</span>
            <span className='font-bold text-gray-800'>
              {formatCurrency(simulationResult.totalInsurance)}
            </span>
          </div>
          <div className='flex justify-between items-center py-2 border-b border-gray-200'>
            <span className='text-gray-700'>Fianzas</span>
            <span className='font-bold text-gray-800'>
              {formatCurrency(simulationResult.totalGuarantee)}
            </span>
          </div>
          <div className='flex justify-between items-center py-2 border-b border-gray-200'>
            <span className='text-gray-700'>Administración</span>
            <span className='font-bold text-gray-800'>
              {formatCurrency(simulationResult.totalAdministration)}
            </span>
          </div>
          <div className='flex justify-between items-center py-2 border-b border-gray-200'>
            <span className='text-gray-700'>IVA</span>
            <span className='font-bold text-gray-800'>
              {formatCurrency(simulationResult.totalIVA)}
            </span>
          </div>
          <div className='flex justify-between items-center py-2 pt-4 border-t-2 border-gray-300'>
            <span className='text-lg font-bold text-gray-800'>Total a Pagar</span>
            <span className='text-xl font-bold text-primary-color'>
              {formatCurrency(
                simulationResult.maxDeliverableAmount + simulationResult.totalCost
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Plan */}
      {simulationResult.paymentPlan && (
        <div className='bg-white rounded-lg shadow-md p-6 border border-gray-200'>
          <button
            onClick={() => setShowPaymentPlan(!showPaymentPlan)}
            className='w-full flex justify-between items-center py-3 hover:bg-gray-50 rounded transition-colors'
          >
            <h4 className='text-xl font-bold text-gray-800'>Plan de Pagos</h4>
            <span
              className={`text-primary-color font-bold text-xl transition-transform ${
                showPaymentPlan ? 'rotate-180' : ''
              }`}
            >
              ▼
            </span>
          </button>

          {showPaymentPlan && (
            <div className='mt-4 overflow-x-auto'>
              <table className='w-full text-sm'>
                <thead>
                  <tr className='bg-gray-50'>
                    <th className='px-4 py-2 text-left font-semibold text-gray-700'>Mes</th>
                    <th className='px-4 py-2 text-right font-semibold text-gray-700'>Cuota</th>
                    <th className='px-4 py-2 text-right font-semibold text-gray-700'>Capital</th>
                    <th className='px-4 py-2 text-right font-semibold text-gray-700'>Interés</th>
                    <th className='px-4 py-2 text-right font-semibold text-gray-700'>Seguro</th>
                    <th className='px-4 py-2 text-right font-semibold text-gray-700'>Saldo</th>
                    <th className='px-4 py-2 text-right font-semibold text-gray-700'>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {simulationResult.paymentPlan.slice(0, 12).map((payment: any, index: number) => (
                    <tr key={index} className='border-b border-gray-200'>
                      <td className='px-4 py-2 text-gray-700'>{payment.month}</td>
                      <td className='px-4 py-2 text-right font-semibold text-gray-800'>
                        {formatCurrency(payment.payment)}
                      </td>
                      <td className='px-4 py-2 text-right text-gray-600'>
                        {formatCurrency(payment.principal)}
                      </td>
                      <td className='px-4 py-2 text-right text-gray-600'>
                        {formatCurrency(payment.interest)}
                      </td>
                      <td className='px-4 py-2 text-right text-gray-600'>
                        {formatCurrency(payment.insurance)}
                      </td>
                      <td className='px-4 py-2 text-right text-gray-600'>
                        {formatCurrency(payment.balance)}
                      </td>
                      <td className='px-4 py-2 text-right text-gray-600'>
                        {new Date(payment.dueDate).toLocaleDateString('es-CO')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {simulationResult.paymentPlan.length > 12 && (
                <p className='text-sm text-gray-600 mt-4 text-center'>
                  Mostrando primeros 12 meses de {simulationResult.paymentPlan.length} meses
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className='flex flex-col sm:flex-row gap-4 pt-4'>
        <button
          onClick={onBack}
          className='flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-300'
        >
          ← Volver
        </button>
        <button
          onClick={() => setShowSaveModal(true)}
          disabled={loading}
          className='flex-1 px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-all duration-300 disabled:opacity-50'
        >
          💾 Guardar Simulación
        </button>
        <button
          onClick={onConvert}
          disabled={loading}
          className='flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50'
        >
          📋 Continuar con Radicación →
        </button>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 max-w-md w-full mx-4'>
            <h4 className='text-xl font-bold text-gray-800 mb-4'>Guardar Simulación</h4>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Nombre del Cliente (opcional)
                </label>
                <input
                  type='text'
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder='Ej: Juan Pérez'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
                />
              </div>
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Documento del Cliente (opcional)
                </label>
                <input
                  type='text'
                  value={clientDocument}
                  onChange={(e) => setClientDocument(e.target.value)}
                  placeholder='Ej: 1234567890'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
                />
              </div>
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Notas (opcional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder='Notas adicionales sobre esta simulación...'
                  rows={3}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
                />
              </div>
            </div>
            <div className='flex gap-4 mt-6'>
              <button
                onClick={() => setShowSaveModal(false)}
                className='flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className='flex-1 px-4 py-2 bg-primary-color text-white rounded-lg hover:bg-accent-color transition-colors disabled:opacity-50'
              >
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SimulationResults

