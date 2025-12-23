'use client'
import { useState } from 'react'
import { CreditData } from '../../../interfaces/creditData.interface'
import {
  processCredit,
  generateSignatureLink,
  confirmDisburse,
} from '../../../services/analyst3.service'
import TagStatus from '../../atoms/TagStatus/TagStatus'
import { CreditStatusesProperties } from '../../../constants/CreditStatusesProperties'

interface Props {
  credit: CreditData
  onBack: () => void
  onRefresh: () => void
}

const Analyst3CreditDetail = ({ credit, onBack, onRefresh }: Props) => {
  const [loading, setLoading] = useState(false)
  const [action, setAction] = useState<'approve' | 'reject' | 'return' | null>(null)
  const [notes, setNotes] = useState('')
  const [reason, setReason] = useState('')
  const [signatureLink, setSignatureLink] = useState('')

  const handleProcess = async () => {
    if (!action) return

    try {
      setLoading(true)
      await processCredit(credit._id, {
        action,
        notes: notes || undefined,
        reason: reason || undefined,
      })
      alert(`Crédito ${action === 'approve' ? 'pre-aprobado' : action === 'reject' ? 'rechazado' : 'devuelto'} exitosamente`)
      onRefresh()
      onBack()
    } catch (error) {
      console.error('Error processing credit:', error)
      alert('Error al procesar el crédito')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateSignatureLink = async () => {
    try {
      setLoading(true)
      const result = await generateSignatureLink(credit._id)
      setSignatureLink(result.link)
      alert('Link de firma generado exitosamente')
      onRefresh()
    } catch (error) {
      console.error('Error generating signature link:', error)
      alert('Error al generar link de firma')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmDisburse = async () => {
    try {
      setLoading(true)
      await confirmDisburse(credit._id, {
        confirmedBy: 'analyst3',
        confirmedAt: new Date().toISOString(),
      })
      alert('Crédito confirmado para desembolso')
      onRefresh()
      onBack()
    } catch (error) {
      console.error('Error confirming disburse:', error)
      alert('Error al confirmar desembolso')
    } finally {
      setLoading(false)
    }
  }

  const statusProp = CreditStatusesProperties.find((s) => s.status === credit.status)

  return (
    <div className='p-[1rem] xl:ml-[300px] xl:mr-[50px] max-lg:pt-14 text-primary-color'>
      <button onClick={onBack} className='mb-4 text-primary-color hover:underline'>
        ← Volver a la lista
      </button>

      <div className='bg-white rounded-lg shadow-lg p-6'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-bold'>Detalle de Crédito - Analista 3</h1>
          <TagStatus text={statusProp?.text || credit.status} background={statusProp?.background} />
        </div>

        {/* Información del crédito */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
          <div>
            <h3 className='font-semibold text-lg mb-2'>Información del Crédito</h3>
            <p><strong>Radicado:</strong> {credit.radicationNumber || credit.code}</p>
            <p><strong>Monto:</strong> ${Number(credit.amount).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
            <p><strong>Cuotas:</strong> {credit.quotasNumber}</p>
            <p><strong>Cliente:</strong> {credit.name} {credit.lastname}</p>
          </div>
          <div>
            <h3 className='font-semibold text-lg mb-2'>Información Financiera</h3>
            <p><strong>Ingresos:</strong> ${Number(credit.monthlyIncome).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
            <p><strong>Gastos:</strong> ${Number(credit.monthlyExpenses).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
            <p><strong>Empresa:</strong> {credit.nameCompany}</p>
          </div>
        </div>

        {/* Notas de analistas anteriores */}
        <div className='mb-6'>
          <h3 className='font-semibold text-lg mb-4'>Historial de Revisión</h3>
          
          {credit.analyst1Notes && (
            <div className='mb-3 p-3 bg-green-50 border-l-4 border-green-500 rounded'>
              <p className='font-semibold text-green-700'>Analista 1:</p>
              <p className='text-sm'>{credit.analyst1Notes}</p>
            </div>
          )}
          
          {credit.analyst2Notes && (
            <div className='mb-3 p-3 bg-blue-50 border-l-4 border-blue-500 rounded'>
              <p className='font-semibold text-blue-700'>Analista 2:</p>
              <p className='text-sm'>{credit.analyst2Notes}</p>
            </div>
          )}
        </div>

        {/* Sección específica según estado */}
        {credit.status === 'ANALYST2_APPROVED' && !action && (
          <div className='mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg'>
            <h3 className='font-semibold text-lg mb-4'>Validación Documental</h3>
            <p className='mb-4'>
              Este crédito ha sido aprobado por los Analistas 1 y 2. 
              Revise la documentación y proceda con la pre-aprobación.
            </p>
            
            <div className='flex gap-4'>
              <button
                onClick={() => setAction('approve')}
                className='flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700'
              >
                Pre-aprobar
              </button>
              <button
                onClick={() => setAction('return')}
                className='flex-1 bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600'
              >
                Devolver a Analista 2
              </button>
              <button
                onClick={() => setAction('reject')}
                className='flex-1 bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700'
              >
                Rechazar
              </button>
            </div>
          </div>
        )}

        {credit.status === 'ANALYST3_APPROVED' && (
          <div className='mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
            <h3 className='font-semibold text-lg mb-4'>Generar Firma Electrónica</h3>
            <p className='mb-4'>
              El crédito ha sido pre-aprobado. Genere el link de firma electrónica para el cliente.
            </p>
            
            <button
              onClick={handleGenerateSignatureLink}
              disabled={loading}
              className='w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50'
            >
              {loading ? 'Generando...' : 'Generar Link de Firma Electrónica'}
            </button>
            
            {signatureLink && (
              <div className='mt-4 p-3 bg-white border rounded'>
                <p className='font-semibold mb-2'>Link generado:</p>
                <a
                  href={signatureLink}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-600 hover:underline break-all'
                >
                  {signatureLink}
                </a>
              </div>
            )}
          </div>
        )}

        {credit.status === 'PENDING_SIGNATURE' && (
          <div className='mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg'>
            <h3 className='font-semibold text-lg mb-4'>Esperando Firma del Cliente</h3>
            <p className='mb-4'>
              El link de firma ha sido enviado al cliente. Una vez firmado, confirme el desembolso.
            </p>
            
            <button
              onClick={handleConfirmDisburse}
              disabled={loading}
              className='w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 disabled:opacity-50'
            >
              {loading ? 'Confirmando...' : 'Confirmar Desembolso'}
            </button>
          </div>
        )}

        {credit.status === 'READY_TO_DISBURSE' && (
          <div className='mb-6 p-4 bg-green-50 border border-green-200 rounded-lg'>
            <h3 className='font-semibold text-lg mb-4'>✓ Listo para Desembolso</h3>
            <p>
              Este crédito está listo para ser desembolsado por el área financiera.
            </p>
          </div>
        )}

        {/* Formulario de acción */}
        {action && (
          <div className='border-t pt-6'>
            <h3 className='font-semibold text-lg mb-4'>
              {action === 'approve' ? 'Pre-aprobar Crédito' :
               action === 'reject' ? 'Rechazar Crédito' : 'Devolver Crédito'}
            </h3>
            
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
                  <label className='block font-semibold mb-2'>Motivo *:</label>
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
                  className='flex-1 bg-primary-color text-white py-3 px-6 rounded-lg disabled:opacity-50'
                >
                  {loading ? 'Procesando...' : 'Confirmar'}
                </button>
                <button
                  onClick={() => {
                    setAction(null)
                    setNotes('')
                    setReason('')
                  }}
                  className='flex-1 bg-gray-400 text-white py-3 px-6 rounded-lg'
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Analyst3CreditDetail

