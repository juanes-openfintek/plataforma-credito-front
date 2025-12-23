'use client'
import { useState } from 'react'
import { CreditData } from '../../../interfaces/creditData.interface'
import { processCredit } from '../../../services/analyst2.service'
import TagStatus from '../../atoms/TagStatus/TagStatus'
import { CreditStatusesProperties } from '../../../constants/CreditStatusesProperties'

interface Props {
  credit: CreditData
  onBack: () => void
  onRefresh: () => void
}

const Analyst2CreditDetail = ({ credit, onBack, onRefresh }: Props) => {
  const [loading, setLoading] = useState(false)
  const [action, setAction] = useState<'approve' | 'reject' | 'return' | null>(null)
  const [notes, setNotes] = useState('')
  const [reason, setReason] = useState('')

  const isPensioner = (credit.economicActivity || '').toLowerCase().includes('pension') || !!(credit as any).pensionType
  
  // Referencias
  const [personalRefVerified, setPersonalRefVerified] = useState(false)
  const [personalRefNotes, setPersonalRefNotes] = useState('')
  const [laboralRefVerified, setLaboralRefVerified] = useState(false)
  const [laboralRefNotes, setLaboralRefNotes] = useState('')
  const [pensionVerified, setPensionVerified] = useState(false)
  const [pensionNotes, setPensionNotes] = useState('')

  const handleProcess = async () => {
    if (!action) return

    try {
      setLoading(true)
      await processCredit(credit._id, {
        action,
        notes: notes || undefined,
        reason: reason || undefined,
        references: action === 'approve' ? {
          personalReferenceVerified: personalRefVerified,
          personalReferenceNotes: personalRefNotes,
          laboralReferenceVerified: isPensioner ? undefined : laboralRefVerified,
          laboralReferenceNotes: isPensioner ? undefined : laboralRefNotes,
          pensionVerified: isPensioner ? pensionVerified : undefined,
          pensionNotes: isPensioner ? pensionNotes : undefined,
        } : undefined,
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
      <button onClick={onBack} className='mb-4 text-primary-color hover:underline'>
        ← Volver a la lista
      </button>

      <div className='bg-white rounded-lg shadow-lg p-6'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-bold'>Detalle de Crédito - Analista 2</h1>
          <TagStatus text={statusProp?.text || credit.status} background={statusProp?.background} />
        </div>

        {/* Información básica */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
          <div>
            <h3 className='font-semibold text-lg mb-2'>Cliente</h3>
            <p><strong>Nombre:</strong> {credit.name} {credit.lastname}</p>
            <p><strong>Documento:</strong> {credit.documentNumber}</p>
            <p><strong>Teléfono:</strong> {credit.phoneNumber}</p>
          </div>
          <div>
            <h3 className='font-semibold text-lg mb-2'>{isPensioner ? 'Información de Pensión' : 'Información Laboral'}</h3>
            {!isPensioner && (
              <>
                <p><strong>Empresa:</strong> {credit.nameCompany}</p>
                <p><strong>Cargo:</strong> {credit.positionCompany}</p>
                <p><strong>Teléfono Empresa:</strong> {credit.phoneNumberCompany}</p>
                <p><strong>Dirección:</strong> {credit.addressCompany}</p>
                <p><strong>Antigüedad:</strong> {new Date(credit.dateOfAdmission).toLocaleDateString()}</p>
              </>
            )}
            {isPensioner && (
              <>
                <p><strong>Entidad / Fondo:</strong> {(credit as any).pensionIssuer || 'No especificado'}</p>
                <p><strong>Tipo de Pensión:</strong> {(credit as any).pensionType || 'No especificado'}</p>
                <p><strong>Ingreso Pensión:</strong> ${Number(credit.monthlyIncome || 0).toLocaleString('es-CO', { maximumFractionDigits: 0 })}</p>
              </>
            )}
          </div>
        </div>

        {/* Referencias Personales */}
        <div className='mb-6 p-4 bg-gray-50 rounded-lg'>
          <h3 className='font-semibold text-lg mb-4'>Referencias Personales</h3>
          <p><strong>Nombre:</strong> {credit.nameReferencePersonal}</p>
          <p><strong>Parentesco:</strong> {credit.parentescoReferencePersonal}</p>
          <p><strong>Teléfono:</strong> {credit.phoneNumberReferencePersonal}</p>
          <p><strong>Ubicación:</strong> {credit.municipalityReferencePersonal}, {credit.departamentReferencePersonal}</p>
        </div>

        {/* Verificación de Referencias */}
        <div className='mb-6 p-4 bg-blue-50 rounded-lg'>
          <h3 className='font-semibold text-lg mb-4'>Verificación de Referencias</h3>
          
          <div className='mb-4'>
            <label className='flex items-center mb-2'>
              <input
                type='checkbox'
                checked={personalRefVerified}
                onChange={(e) => setPersonalRefVerified(e.target.checked)}
                className='mr-2'
              />
              <span className='font-semibold'>Referencia Personal Verificada</span>
            </label>
            <textarea
              value={personalRefNotes}
              onChange={(e) => setPersonalRefNotes(e.target.value)}
              className='w-full border rounded-lg p-2'
              rows={2}
              placeholder='Notas sobre la verificación personal...'
            />
          </div>

          <div>
            <label className='flex items-center mb-2'>
              <input
                type='checkbox'
                checked={laboralRefVerified}
                onChange={(e) => setLaboralRefVerified(e.target.checked)}
                className='mr-2'
              />
              <span className='font-semibold'>Referencia Laboral Verificada</span>
            </label>
            <textarea
              value={laboralRefNotes}
              onChange={(e) => setLaboralRefNotes(e.target.value)}
              className='w-full border rounded-lg p-2'
              rows={2}
              placeholder='Notas sobre la verificación laboral...'
            />
          </div>
        </div>

        {/* Notas del Analista 1 */}
        {credit.analyst1Notes && (
          <div className='mb-6 p-4 bg-green-50 rounded-lg'>
            <h3 className='font-semibold text-lg mb-2'>Notas del Analista 1</h3>
            <p>{credit.analyst1Notes}</p>
          </div>
        )}

        {/* Acciones */}
        <div className='border-t pt-6'>
          <h3 className='font-semibold text-lg mb-4'>Acciones</h3>
          
          {!action && (
            <div className='flex gap-4'>
              <button
                onClick={() => setAction('approve')}
                className='flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700'
              >
                Aprobar
              </button>
              <button
                onClick={() => setAction('return')}
                className='flex-1 bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600'
              >
                Devolver a Analista 1
              </button>
              <button
                onClick={() => setAction('reject')}
                className='flex-1 bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700'
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
          )}
        </div>
      </div>
    </div>
  )
}

export default Analyst2CreditDetail

