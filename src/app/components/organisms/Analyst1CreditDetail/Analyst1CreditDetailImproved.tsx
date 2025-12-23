'use client'
import { useState, useEffect } from 'react'
import { CreditData } from '../../../interfaces/creditData.interface'
import {
  processCredit,
  getAutomaticValidations,
  ValidationResult,
  updateCreditData,
} from '../../../services/analyst1.service'
import TagStatus from '../../atoms/TagStatus/TagStatus'
import { CreditStatusesProperties } from '../../../constants/CreditStatusesProperties'

interface Props {
  credit: CreditData
  onBack: () => void
  onRefresh: () => void
}

const Analyst1CreditDetailImproved = ({ credit, onBack, onRefresh }: Props) => {
  const [validations, setValidations] = useState<ValidationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [action, setAction] = useState<'approve' | 'reject' | 'return' | null>(null)
  const [notes, setNotes] = useState('')
  const [reason, setReason] = useState('')
  const [returnTarget, setReturnTarget] = useState<'previous' | 'commercial'>('previous')
  const [activeTab, setActiveTab] = useState<'info' | 'validations' | 'documents' | 'portfolio' | 'history'>('validations')
  const [requestedDocs, setRequestedDocs] = useState<string[]>([])
  const [newDocRequest, setNewDocRequest] = useState('')
  const [checklistSaving, setChecklistSaving] = useState(false)
  const [checklistError, setChecklistError] = useState<string | null>(null)
  const [analyst1Checklist, setAnalyst1Checklist] = useState({
    kyc: !!credit.analyst1Checklist?.kyc,
    riskCentral: !!credit.analyst1Checklist?.riskCentral,
    debtCapacity: !!credit.analyst1Checklist?.debtCapacity,
  })

  useEffect(() => {
    fetchValidations()
  }, [credit._id])

  useEffect(() => {
    setAnalyst1Checklist({
      kyc: !!credit.analyst1Checklist?.kyc,
      riskCentral: !!credit.analyst1Checklist?.riskCentral,
      debtCapacity: !!credit.analyst1Checklist?.debtCapacity,
    })
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
        returnTo: action === 'return' ? returnTarget : undefined,
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

  const handleRequestDocument = () => {
    if (newDocRequest.trim()) {
      setRequestedDocs([...requestedDocs, newDocRequest])
      setNewDocRequest('')
      alert(`Documento "${newDocRequest}" solicitado exitosamente`)
    }
  }

  const statusProp = CreditStatusesProperties.find((s) => s.status === credit.status)

  const toggleChecklist = async (key: 'kyc' | 'riskCentral' | 'debtCapacity') => {
    const prev = analyst1Checklist
    const next = { ...prev, [key]: !prev[key] }
    setAnalyst1Checklist(next)
    setChecklistError(null)
    try {
      setChecklistSaving(true)
      await updateCreditData(credit._id, { analyst1Checklist: next })
    } catch (e) {
      console.error(e)
      setChecklistError('No se pudo guardar el checklist. Intenta nuevamente.')
      // rollback
      setAnalyst1Checklist(prev)
    } finally {
      setChecklistSaving(false)
    }
  }

  const TabButton = ({ tab, label, icon }: { tab: typeof activeTab; label: string; icon: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all ${
        activeTab === tab
          ? 'border-b-4 border-primary-color text-primary-color'
          : 'text-gray-500 hover:text-primary-color'
      }`}
    >
      <span className='text-xl'>{icon}</span>
      {label}
    </button>
  )

  return (
    <div className='text-primary-color'>
      <button
        onClick={onBack}
        className='mb-4 text-primary-color hover:underline flex items-center gap-2 font-semibold'
      >
        ← Volver a la lista
      </button>

      <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
        {/* Header */}
        <div className='bg-gradient-to-r from-primary-color to-accent-color p-6 text-white'>
          <div className='flex justify-between items-center'>
            <div>
              <h1 className='text-3xl font-bold mb-2'>Análisis de Crédito - Validación Inicial</h1>
              <p className='text-lg opacity-90'>{credit.name} {credit.lastname}</p>
              <p className='text-sm opacity-75'>Doc: {credit.documentNumber} | Radicado: {credit.radicationNumber || credit.code}</p>
            </div>
            <div className='text-right'>
              <TagStatus
                text={statusProp?.text || credit.status}
                background='bg-white text-primary-color'
              />
              <p className='mt-2 text-2xl font-bold'>${Number(credit.amount).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
              <p className='text-sm opacity-75'>{credit.quotasNumber} cuotas</p>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className='border-b flex overflow-x-auto'>
          <TabButton tab='info' label='Información' icon='📋' />
          <TabButton tab='validations' label='Validaciones' icon='✓' />
          <TabButton tab='documents' label='Documentos' icon='📄' />
          <TabButton tab='portfolio' label='Compras de cartera' icon='💳' />
          <TabButton tab='history' label='Historial' icon='🕐' />
        </div>

        {/* Tab Content */}
        <div className='p-6'>
          {/* Información General */}
          {activeTab === 'info' && (
            <div className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {/* Información Personal */}
                <div className='bg-gray-50 p-4 rounded-lg'>
                  <h3 className='font-bold text-lg mb-4 flex items-center gap-2'>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Información Personal</span>
                  </h3>
                  <div className='space-y-2'>
                    <InfoRow label='Nombre Completo' value={`${credit.name} ${credit.secondName || ''} ${credit.lastname} ${credit.secondLastname || ''}`} />
                    <InfoRow label='Tipo de Documento' value={credit.documentType} />
                    <InfoRow label='Número de Documento' value={credit.documentNumber} />
                    <InfoRow label='Teléfono' value={credit.phoneNumber} />
                    <InfoRow label='Fecha de Nacimiento' value={new Date(credit.dateOfBirth).toLocaleDateString()} />
                    <InfoRow label='Edad' value={`${calculateAge(new Date(credit.dateOfBirth))} años`} />
                  </div>
                </div>

                {/* Información Laboral */}
                <div className='bg-gray-50 p-4 rounded-lg'>
                  <h3 className='font-bold text-lg mb-4 flex items-center gap-2'>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>Información Laboral</span>
                  </h3>
                  <div className='space-y-2'>
                    <InfoRow label='Empresa' value={credit.nameCompany} />
                    <InfoRow label='Cargo' value={credit.positionCompany} />
                    <InfoRow label='Tipo de Contrato' value={credit.typeContract} />
                    <InfoRow label='Fecha de Ingreso' value={credit.dateOfAdmission ? new Date(credit.dateOfAdmission).toLocaleDateString() : 'No especificado'} />
                    <InfoRow label='Teléfono Empresa' value={credit.phoneNumberCompany} />
                  </div>
                </div>

                {/* Información Bancaria */}
                <div className='bg-green-50 p-4 rounded-lg'>
                  <h3 className='font-bold text-lg mb-4 flex items-center gap-2'>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                    </svg>
                    <span>Información Bancaria</span>
                  </h3>
                  <div className='space-y-2'>
                    <InfoRow label='Banco' value={credit.bankName || 'No especificado'} />
                    <InfoRow label='Tipo de Cuenta' value={credit.bankAccountType || 'No especificado'} />
                    <InfoRow label='Número de Cuenta' value={credit.bankAccountNumber || 'No especificado'} />
                  </div>
                </div>
              </div>

              {/* Información Financiera */}
              <div className='bg-blue-50 p-4 rounded-lg'>
                <h3 className='font-bold text-lg mb-4 flex items-center gap-2'>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Información Financiera</span>
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <div>
                    <p className='text-sm text-gray-600'>Ingresos Mensuales</p>
                    <p className='text-2xl font-bold text-green-600'>${Number(credit.monthlyIncome).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-600'>Gastos Mensuales</p>
                    <p className='text-2xl font-bold text-red-600'>${Number(credit.monthlyExpenses).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-600'>Capacidad Disponible</p>
                    <p className='text-2xl font-bold text-blue-600'>
                      ${(Number(credit.monthlyIncome) - Number(credit.monthlyExpenses)).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Validaciones Automáticas */}
          {activeTab === 'validations' && validations && validations.details && (
            <div className='space-y-6'>
              {checklistError && (
                <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg'>
                  {checklistError}
                </div>
              )}

              {/* Detalles de Validaciones - Solo botones de validación */}
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                <ValidationCard
                  title='Score KYC'
                  value={0}
                  max={100}
                  icon='🔐'
                  description='Conocimiento del cliente y verificación de identidad'
                  checklist={{
                    checked: analyst1Checklist.kyc,
                    label: 'Marcar KYC como verificado',
                    onToggle: () => toggleChecklist('kyc'),
                    disabled: checklistSaving,
                    saving: checklistSaving,
                  }}
                  hideNumbers={true}
                />
                <ValidationCard
                  title='Capacidad de Pago'
                  value={0}
                  max={100}
                  icon='💳'
                  description='Ratio entre ingresos y gastos mensuales'
                  checklist={{
                    checked: analyst1Checklist.debtCapacity,
                    label: 'Marcar capacidad como verificada',
                    onToggle: () => toggleChecklist('debtCapacity'),
                    disabled: checklistSaving,
                    saving: checklistSaving,
                  }}
                  hideNumbers={true}
                />
              </div>

              {/* Checks Binarios */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <CheckCard
                  title='Listas Restrictivas'
                  passed={validations.details.blacklistCheck}
                  description='Verificación en listas OFAC, ONU, PEPs'
                />
                <CheckCard
                  title='Centrales de Riesgo'
                  passed={validations.details.riskCentralsCheck}
                  description='Consulta en Datacrédito, TransUnion, etc.'
                  checklist={{
                    checked: analyst1Checklist.riskCentral,
                    label: 'Marcar centrales como verificadas',
                    onToggle: () => toggleChecklist('riskCentral'),
                    disabled: checklistSaving,
                    saving: checklistSaving,
                  }}
                />
              </div>

              {/* Alertas y Advertencias */}
              {validations.errors && validations.errors.length > 0 && (
                <div className='bg-red-50 border-l-4 border-red-500 p-4 rounded'>
                  <h4 className='font-bold text-red-800 mb-2 flex items-center gap-2'>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>Errores Críticos ({validations.errors.length})</span>
                  </h4>
                  <ul className='list-disc list-inside space-y-1 text-red-700'>
                    {validations.errors.map((error, i) => (
                      <li key={i}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {validations.warnings && validations.warnings.length > 0 && (
                <div className='bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded'>
                  <h4 className='font-bold text-yellow-800 mb-2 flex items-center gap-2'>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Advertencias ({validations.warnings.length})</span>
                  </h4>
                  <ul className='list-disc list-inside space-y-1 text-yellow-700'>
                    {validations.warnings.map((warning, i) => (
                      <li key={i}>{warning}</li>
                    ))}
                  </ul>
                </div>
              )}

              {(!validations.errors || validations.errors.length === 0) && (!validations.warnings || validations.warnings.length === 0) && (
                <div className='bg-green-50 border-l-4 border-green-500 p-4 rounded'>
                  <p className='text-green-800 font-semibold flex items-center gap-2'>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Todas las validaciones pasaron exitosamente</span>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Documentos */}
          {activeTab === 'documents' && (
            <div className='space-y-6'>
              <div className='bg-gray-50 p-4 rounded-lg'>
                <h3 className='font-bold text-lg mb-4'>Solicitar Documentos Adicionales</h3>
                <div className='flex gap-2'>
                  <input
                    type='text'
                    value={newDocRequest}
                    onChange={(e) => setNewDocRequest(e.target.value)}
                    placeholder='Ej: Certificado laboral actualizado'
                    className='flex-1 px-4 py-2 border rounded-lg'
                    onKeyPress={(e) => e.key === 'Enter' && handleRequestDocument()}
                  />
                  <button
                    onClick={handleRequestDocument}
                    className='px-6 py-2 bg-primary-color text-white rounded-lg hover:opacity-90'
                  >
                    Solicitar
                  </button>
                </div>
              </div>

              {requestedDocs.length > 0 && (
                <div>
                  <h4 className='font-bold mb-3'>Documentos Solicitados:</h4>
                  <ul className='space-y-2'>
                    {requestedDocs.map((doc, i) => (
                      <li key={i} className='flex items-center gap-2 p-3 bg-blue-50 rounded'>
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>{doc}</span>
                        <span className='ml-auto text-xs text-blue-600'>Pendiente</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h4 className='font-bold mb-3'>Documentos Estándar Requeridos:</h4>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                  {['Cédula de Ciudadanía', 'Certificado Laboral', 'Desprendibles de Pago', 'Extracto Bancario'].map((doc, i) => (
                    <div key={i} className='flex items-center gap-2 p-3 bg-gray-50 rounded'>
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>{doc}</span>
                      <span className='ml-auto text-xs text-gray-500'>Por verificar</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Compras de cartera */}
          {activeTab === 'portfolio' && (
            <div className='space-y-4'>
              <h3 className='text-xl font-bold text-gray-900'>Compras de cartera</h3>
              {!credit.requiresPortfolioPurchase && (
                <p className='text-sm text-gray-600'>Este crédito no marcó compra de cartera.</p>
              )}
              {credit.requiresPortfolioPurchase && (
                <div className='space-y-2'>
                  {(credit.portfolioDebts || []).map((debt, idx) => {
                    const isSelected = !!debt.selected
                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded border space-y-1 ${
                          isSelected ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className='flex items-start justify-between gap-3'>
                          <div>
                            <p className='font-semibold text-gray-900'>
                              {debt.entity || 'Entidad'}
                              {isSelected && <span className='text-green-700 text-xs ml-2'>(Seleccionada)</span>}
                            </p>
                            <p className='text-xs text-gray-600'>
                              Línea: {debt.lineOfCredit || 'N/D'} · Obligación: {debt.obligationNumber || debt.id || 'N/D'}
                            </p>
                          </div>
                          <div className='text-right text-sm text-gray-700'>
                            <p>Saldo: {debt.balance ? debt.balance.toLocaleString('es-CO') : '--'}</p>
                            <p>Cuota: {debt.installment ? debt.installment.toLocaleString('es-CO') : '--'}</p>
                          </div>
                        </div>
                        <div className='flex flex-wrap items-center gap-2 text-xs text-gray-600'>
                          <span className='px-2 py-1 rounded bg-white border border-gray-200'>
                            Estado: {debt.status || 'N/D'}
                          </span>
                          {debt.rating && (
                            <span className='px-2 py-1 rounded bg-white border border-gray-200'>
                              Calificación: {debt.rating}
                            </span>
                          )}
                          {debt.selected && (
                            <span className='px-2 py-1 rounded bg-green-100 border border-green-300 text-green-800 font-semibold'>
                              Incluida en compra
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                  {(credit.portfolioDebts || []).length === 0 && (
                    <p className='text-sm text-gray-600'>No se registraron deudas detalladas.</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Historial */}
          {activeTab === 'history' && (
            <div className='space-y-4'>
              <TimelineItem
                date={credit.radicationDate || credit.created}
                title='Crédito Radicado'
                description='El crédito fue radicado desde el módulo comercial'
                icon='📝'
                color='blue'
              />
              <TimelineItem
                date={new Date().toISOString()}
                title='En Revisión - Analista 1'
                description='Validación inicial de capacidad y KYC en proceso'
                icon='🔍'
                color='yellow'
                active
              />
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className='border-t p-6 bg-gray-50'>
          <h3 className='font-semibold text-lg mb-4'>Acciones del Analista</h3>
          
          {!action && (
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <button
                onClick={() => setAction('approve')}
                className='flex flex-col items-center justify-center gap-3 p-6 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all transform hover:scale-105'
              >
                <span className='text-4xl'>✓</span>
                <span className='font-bold'>Aprobar</span>
                <span className='text-sm opacity-90'>Pasar a Analista 2</span>
              </button>
              <button
                onClick={() => setAction('return')}
                className='flex flex-col items-center justify-center gap-3 p-6 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all transform hover:scale-105'
              >
                <span className='text-4xl'>↩</span>
                <span className='font-bold'>Devolver</span>
                <span className='text-sm opacity-90'>Solicitar correcciones</span>
              </button>
              <button
                onClick={() => setAction('reject')}
                className='flex flex-col items-center justify-center gap-3 p-6 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all transform hover:scale-105'
              >
                <span className='text-4xl'>✗</span>
                <span className='font-bold'>Rechazar</span>
                <span className='text-sm opacity-90'>Denegar el crédito</span>
              </button>
            </div>
          )}

          {action && (
            <div className='space-y-4 bg-white p-6 rounded-lg'>
              <div>
                <label className='block font-semibold mb-2'>Notas Internas:</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className='w-full border rounded-lg p-3'
                  rows={3}
                  placeholder='Agregue observaciones sobre esta revisión...'
                />
              </div>

              {(action === 'reject' || action === 'return') && (
                <div>
                  <label className='block font-semibold mb-2 text-red-600'>
                    Motivo {action === 'reject' ? 'del Rechazo' : 'de la Devolución'} *:
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className='w-full border-2 border-red-300 rounded-lg p-3'
                    rows={3}
                    placeholder='Explique detalladamente el motivo...'
                    required
                  />
                  {action === 'return' && (
                    <div className='mt-3'>
                      <label className='block text-sm font-semibold text-gray-700 mb-1'>Destino de la devolución</label>
                      <select
                        value={returnTarget}
                        onChange={(e) => setReturnTarget(e.target.value as 'previous' | 'commercial')}
                        className='w-full md:w-1/2 border rounded-lg px-3 py-2'
                      >
                        <option value='previous'>Volver al paso anterior</option>
                        <option value='commercial'>Devolver al comercial</option>
                      </select>
                    </div>
                  )}
                </div>
              )}

              <div className='flex gap-4'>
                <button
                  onClick={handleProcess}
                  disabled={loading || ((action === 'reject' || action === 'return') && !reason)}
                  className='flex-1 bg-primary-color text-white py-4 px-6 rounded-lg font-bold hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {loading ? 'Procesando...' : `Confirmar ${action === 'approve' ? 'Aprobación' : action === 'reject' ? 'Rechazo' : 'Devolución'}`}
                </button>
                <button
                  onClick={() => {
                    setAction(null)
                    setNotes('')
                    setReason('')
                    setReturnTarget('previous')
                  }}
                  className='px-8 py-4 bg-gray-400 text-white rounded-lg font-bold hover:bg-gray-500 transition-colors'
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

// Helper Components
const InfoRow = ({ label, value }: { label: string; value: string | number }) => (
  <div className='flex justify-between border-b pb-2'>
    <span className='text-gray-600 text-sm'>{label}:</span>
    <span className='font-semibold text-sm'>{value}</span>
  </div>
)

const ValidationCard = ({
  title,
  value,
  max,
  icon,
  description,
  suffix = '',
  inverted = false,
  checklist,
  hideNumbers = false,
}: {
  title: string
  value: number
  max: number
  icon: string
  description: string
  suffix?: string
  inverted?: boolean
  checklist?: {
    checked: boolean
    label: string
    onToggle: () => void
    disabled?: boolean
    saving?: boolean
  }
  hideNumbers?: boolean
}) => {
  const percentage = (value / max) * 100
  const colorClass = inverted
    ? percentage >= 70
      ? 'text-red-600'
      : percentage >= 40
      ? 'text-yellow-600'
      : 'text-green-600'
    : percentage >= 70
    ? 'text-green-600'
    : percentage >= 40
    ? 'text-yellow-600'
    : 'text-red-600'

  return (
    <div className='bg-white border-2 rounded-lg p-4 hover:shadow-lg transition-shadow'>
      <div className='flex items-center gap-2 mb-2'>
        <span className='text-2xl'>{icon}</span>
        <h4 className='font-bold'>{title}</h4>
      </div>
      {checklist && (
        <button
          type='button'
          disabled={checklist.disabled}
          onClick={checklist.onToggle}
          className={`w-full mt-2 mb-3 flex items-center justify-between gap-3 px-3 py-2 rounded-lg border text-left transition ${
            checklist.checked ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
          } ${checklist.disabled ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          <div className='flex items-center gap-3'>
            <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${checklist.checked ? 'bg-green-600 border-green-600' : 'bg-white border-gray-300'}`}>
              {checklist.checked && (
                <svg className='w-3.5 h-3.5 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={3} d='M5 13l4 4L19 7' />
                </svg>
              )}
            </div>
            <span className='text-sm font-semibold text-gray-800'>{checklist.label}</span>
          </div>
          <span className={`text-xs font-bold ${checklist.checked ? 'text-green-700' : 'text-gray-500'}`}>
            {checklist.saving ? 'Guardando...' : checklist.checked ? 'Hecho' : 'Pendiente'}
          </span>
        </button>
      )}
      {!hideNumbers && (
        <>
          <div className={`text-3xl font-bold ${colorClass} mb-1`}>
            {Math.round(value)}{suffix}
          </div>
          <div className='w-full bg-gray-200 rounded-full h-2 mb-2'>
            <div
              className={`h-2 rounded-full ${inverted ? 'bg-gradient-to-r from-green-500 to-red-500' : 'bg-gradient-to-r from-red-500 to-green-500'}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </>
      )}
      <p className='text-xs text-gray-600'>{description}</p>
    </div>
  )
}

const CheckCard = ({
  title,
  passed,
  description,
  checklist,
}: {
  title: string
  passed: boolean
  description: string
  checklist?: {
    checked: boolean
    label: string
    onToggle: () => void
    disabled?: boolean
    saving?: boolean
  }
}) => (
  <div className={`border-2 rounded-lg p-4 ${passed ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
    <div className='flex items-center gap-3'>
      <span className='text-3xl'>{passed ? '✅' : '❌'}</span>
      <div>
        <h4 className='font-bold'>{title}</h4>
        <p className='text-sm text-gray-600'>{description}</p>
        <p className={`text-sm font-semibold mt-1 ${passed ? 'text-green-700' : 'text-red-700'}`}>
          {passed ? 'APROBADO' : 'NO APROBADO'}
        </p>
      </div>
    </div>
    {checklist && (
      <button
        type='button'
        disabled={checklist.disabled}
        onClick={checklist.onToggle}
        className={`w-full mt-4 flex items-center justify-between gap-3 px-3 py-2 rounded-lg border text-left transition ${
          checklist.checked ? 'bg-white border-green-300' : 'bg-white/60 border-gray-200 hover:bg-white'
        } ${checklist.disabled ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        <div className='flex items-center gap-3'>
          <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${checklist.checked ? 'bg-green-600 border-green-600' : 'bg-white border-gray-300'}`}>
            {checklist.checked && (
              <svg className='w-3.5 h-3.5 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={3} d='M5 13l4 4L19 7' />
              </svg>
            )}
          </div>
          <span className='text-sm font-semibold text-gray-800'>{checklist.label}</span>
        </div>
        <span className={`text-xs font-bold ${checklist.checked ? 'text-green-700' : 'text-gray-500'}`}>
          {checklist.saving ? 'Guardando...' : checklist.checked ? 'Hecho' : 'Pendiente'}
        </span>
      </button>
    )}
  </div>
)

const TimelineItem = ({
  date,
  title,
  description,
  icon,
  active = false,
}: {
  date: string | Date
  title: string
  description: string
  icon: string
  active?: boolean
}) => (
  <div className='flex gap-4'>
    <div className='flex flex-col items-center'>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${active ? 'bg-blue-500 text-white animate-pulse' : 'bg-gray-100'}`}>
        {icon}
      </div>
      <div className='w-1 h-full bg-gray-200 mt-2' />
    </div>
    <div className='flex-1 pb-8'>
      <p className='text-sm text-gray-500'>{new Date(date).toLocaleString()}</p>
      <h4 className='font-bold text-lg'>{title}</h4>
      <p className='text-gray-600'>{description}</p>
    </div>
  </div>
)

const calculateAge = (birthDate: Date): number => {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

export default Analyst1CreditDetailImproved

