'use client'
import { useState, useEffect } from 'react'
import { CreditData } from '../../../interfaces/creditData.interface'
import {
  processCredit,
  getAutomaticValidations,
  ValidationResult,
} from '../../../services/analyst1.service'
import TagStatus from '../../atoms/TagStatus/TagStatus'
import { CreditStatusesProperties } from '../../../constants/CreditStatusesProperties'

interface Props {
  credit: CreditData
  onBack: () => void
  onRefresh: () => void
}

const Analyst1CreditDetail = ({ credit, onBack, onRefresh }: Props) => {
  const [validations, setValidations] = useState<ValidationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [action, setAction] = useState<'approve' | 'reject' | 'return' | null>(null)
  const [notes, setNotes] = useState('')
  const [reason, setReason] = useState('')
  const [activeTab, setActiveTab] = useState<'info' | 'validations' | 'documents' | 'history'>('info')
  const [requestedDocs, setRequestedDocs] = useState<string[]>([])
  const [newDocRequest, setNewDocRequest] = useState('')

  useEffect(() => {
    fetchValidations()
  }, [credit._id])

  const fetchValidations = async () => {
    try {
      const result = await getAutomaticValidations(credit._id)
      setValidations(result)
    } catch (error) {
      console.error('Error fetching validations:', error)
    }
  }

  const handleProcess = async () => {
    if (!action) return

    try {
      setLoading(true)
      await processCredit(credit._id, {
        action,
        notes: notes || undefined,
        reason: reason || undefined,
      })
      alert(`Crédito ${action === 'approve' ? 'aprobado' : action === 'reject' ? 'rechazado' : 'devuelto'} exitosamente`)
      onRefresh()
      onBack()
    } catch (error) {
      console.error('Error processing credit:', error)
      alert('Error al procesar el crédito')
    } finally {
      setLoading(false)
    }
  }

  const statusProp = CreditStatusesProperties.find((s) => s.status === credit.status)

  return (
    <div className='p-[1rem] xl:ml-[300px] xl:mr-[50px] max-lg:pt-14 text-primary-color'>
      <button
        onClick={onBack}
        className='mb-4 text-primary-color hover:underline flex items-center'
      >
        ← Volver a la lista
      </button>

      <div className='bg-white rounded-lg shadow-lg p-6'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-bold'>
            Detalle de Crédito - Analista 1
          </h1>
          <TagStatus
            text={statusProp?.text || credit.status}
            background={statusProp?.background}
          />
        </div>

        {/* Información básica */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
          <div>
            <h3 className='font-semibold text-lg mb-2'>Información del Crédito</h3>
            <p><strong>Radicado:</strong> {credit.radicationNumber || credit.code}</p>
            <p><strong>Monto:</strong> ${Number(credit.amount).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
            <p><strong>Cuotas:</strong> {credit.quotasNumber}</p>
            <p><strong>Fecha:</strong> {new Date(credit.radicationDate || credit.created).toLocaleDateString()}</p>
          </div>

          <div>
            <h3 className='font-semibold text-lg mb-2'>Información Personal</h3>
            <p><strong>Nombre:</strong> {credit.name} {credit.secondName} {credit.lastname} {credit.secondLastname}</p>
            <p><strong>Documento:</strong> {credit.documentType} {credit.documentNumber}</p>
            <p><strong>Teléfono:</strong> {credit.phoneNumber}</p>
            <p><strong>Fecha de Nacimiento:</strong> {new Date(credit.dateOfBirth).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Información financiera */}
        <div className='mb-6'>
          <h3 className='font-semibold text-lg mb-2'>Información Financiera</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <p><strong>Ingresos Mensuales:</strong> ${Number(credit.monthlyIncome).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
              <p><strong>Gastos Mensuales:</strong> ${Number(credit.monthlyExpenses).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
            </div>
            <div>
              <p><strong>Empresa:</strong> {credit.nameCompany}</p>
              <p><strong>Cargo:</strong> {credit.positionCompany}</p>
              <p><strong>Tipo de Contrato:</strong> {credit.typeContract}</p>
            </div>
          </div>
        </div>

        {/* Validaciones Automáticas */}
        {validations && validations.details && (
          <div className='mb-6 p-4 bg-gray-50 rounded-lg'>
            <h3 className='font-semibold text-lg mb-4'>Validaciones Automáticas</h3>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
              <div className='p-3 bg-white rounded'>
                <p className='text-sm text-gray-600'>Score KYC</p>
                <p className='text-2xl font-bold'>{validations.details.kycScore || 0}/100</p>
              </div>
              <div className='p-3 bg-white rounded'>
                <p className='text-sm text-gray-600'>Capacidad de Pago</p>
                <p className='text-2xl font-bold'>
                  {((validations.details.debtCapacityRatio || 0) * 100).toFixed(1)}%
                </p>
              </div>
              <div className='p-3 bg-white rounded'>
                <p className='text-sm text-gray-600'>Score Total</p>
                <p className='text-2xl font-bold'>{validations.score || 0}/100</p>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <p className={`flex items-center ${validations.details.blacklistCheck ? 'text-green-600' : 'text-red-600'}`}>
                  {validations.details.blacklistCheck ? '✓' : '✗'} Lista Restrictiva
                </p>
                <p className={`flex items-center ${validations.details.riskCentralsCheck ? 'text-green-600' : 'text-red-600'}`}>
                  {validations.details.riskCentralsCheck ? '✓' : '✗'} Centrales de Riesgo
                </p>
              </div>
              <div>
                <p className='text-sm'>Riesgo de Fraude: {validations.details.fraudScore || 0}/100</p>
                <p className='text-sm'>Documentación: {validations.details.documentCompletion || 0}%</p>
              </div>
            </div>

            {validations.errors && validations.errors.length > 0 && (
              <div className='mt-4 p-3 bg-red-50 border border-red-200 rounded'>
                <p className='font-semibold text-red-700 mb-2'>Errores:</p>
                <ul className='list-disc list-inside text-red-600'>
                  {validations.errors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {validations.warnings && validations.warnings.length > 0 && (
              <div className='mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded'>
                <p className='font-semibold text-yellow-700 mb-2'>Advertencias:</p>
                <ul className='list-disc list-inside text-yellow-600'>
                  {validations.warnings.map((warning, i) => (
                    <li key={i}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {!validations && (
          <div className='mb-6 p-4 bg-gray-50 rounded-lg'>
            <p className='text-center text-gray-500'>Cargando validaciones automáticas...</p>
          </div>
        )}

        {/* Acciones */}
        <div className='border-t pt-6'>
          <h3 className='font-semibold text-lg mb-4'>Acciones</h3>
          
          {!action && (
            <div className='flex gap-4'>
              <button
                onClick={() => setAction('approve')}
                className='flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors'
              >
                Aprobar
              </button>
              <button
                onClick={() => setAction('return')}
                className='flex-1 bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors'
              >
                Devolver
              </button>
              <button
                onClick={() => setAction('reject')}
                className='flex-1 bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors'
              >
                Rechazar
              </button>
            </div>
          )}

          {action && (
            <div className='space-y-4'>
              <div>
                <label className='block font-semibold mb-2'>Notas:</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className='w-full border rounded-lg p-3'
                  rows={3}
                  placeholder='Agregue notas sobre esta revisión...'
                />
              </div>

              {(action === 'reject' || action === 'return') && (
                <div>
                  <label className='block font-semibold mb-2'>
                    Motivo {action === 'reject' ? 'del rechazo' : 'de la devolución'} *:
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className='w-full border rounded-lg p-3'
                    rows={3}
                    placeholder='Explique el motivo...'
                    required
                  />
                </div>
              )}

              <div className='flex gap-4'>
                <button
                  onClick={handleProcess}
                  disabled={loading || ((action === 'reject' || action === 'return') && !reason)}
                  className='flex-1 bg-primary-color text-white py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {loading ? 'Procesando...' : `Confirmar ${action === 'approve' ? 'Aprobación' : action === 'reject' ? 'Rechazo' : 'Devolución'}`}
                </button>
                <button
                  onClick={() => {
                    setAction(null)
                    setNotes('')
                    setReason('')
                  }}
                  className='flex-1 bg-gray-400 text-white py-3 px-6 rounded-lg hover:bg-gray-500 transition-colors'
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Analyst1CreditDetail

