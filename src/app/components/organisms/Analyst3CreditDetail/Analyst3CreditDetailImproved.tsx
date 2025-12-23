'use client'
  const formatCurrency = (val: any) =>
    Number(val || 0).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })


import { useState, useEffect } from 'react'
import { CreditData } from '../../../interfaces/creditData.interface'
import {
  processCredit,
  generateSignatureLink,
  confirmDisburse,
  updateCreditData,
} from '../../../services/analyst3.service'
import TagStatus from '../../atoms/TagStatus/TagStatus'
import { CreditStatusesProperties } from '../../../constants/CreditStatusesProperties'
import CreditTimeline, { TimelineStep } from '../../molecules/CreditTimeline/CreditTimeline'

interface Props {
  credit: CreditData
  onBack: () => void
  onRefresh: () => void
}

interface DocumentItem {
  id: string
  name: string
  type: string
  status: 'pending' | 'approved' | 'rejected'
  url?: string
  uploadDate?: string
  reviewNotes?: string
}

const Analyst3CreditDetailImproved = ({ credit, onBack, onRefresh }: Props) => {
  const [loading, setLoading] = useState(false)
  const [action, setAction] = useState<'approve' | 'reject' | 'return' | null>(null)
  const [notes, setNotes] = useState('')
  const [reason, setReason] = useState('')
  const [returnTarget, setReturnTarget] = useState<'previous' | 'commercial'>('previous')
  const [activeTab, setActiveTab] = useState<'summary' | 'rectification' | 'documents' | 'contract' | 'disburse' | 'portfolio' | 'history'>('summary')
  const [checklistSaving, setChecklistSaving] = useState(false)
  const [checklistError, setChecklistError] = useState<string | null>(null)
  const [analyst3Checklist, setAnalyst3Checklist] = useState({
    reviewAnalyst1: !!credit.analyst3Checklist?.reviewAnalyst1,
    reviewAnalyst2: !!credit.analyst3Checklist?.reviewAnalyst2,
    finalRectification: !!credit.analyst3Checklist?.finalRectification,
  })
  const [showAnalyst1Popup, setShowAnalyst1Popup] = useState(false)
  const [showAnalyst2Popup, setShowAnalyst2Popup] = useState(false)
  
  // Documentos
  const [documents, setDocuments] = useState<DocumentItem[]>([
    { id: '1', name: 'Cédula de Ciudadanía', type: 'identity', status: 'approved', uploadDate: '2025-11-01' },
    { id: '2', name: 'Certificado Laboral', type: 'employment', status: 'approved', uploadDate: '2025-11-02' },
    { id: '3', name: 'Desprendibles de Pago (3 últimos)', type: 'income', status: 'pending' },
    { id: '4', name: 'Extracto Bancario', type: 'financial', status: 'pending' },
  ])
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null)
  const [docReviewNotes, setDocReviewNotes] = useState('')

  // Contrato
  const [contractGenerated, setContractGenerated] = useState(false)
  const [signatureLink, setSignatureLink] = useState('')
  const [contractSigned, setContractSigned] = useState(false)

  // Desembolso
  const [disburseMethod, setDisburseMethod] = useState<'transfer' | 'check' | 'cash'>('transfer')
  const [bankName, setBankName] = useState('')
  const [accountType, setAccountType] = useState<'savings' | 'checking'>('savings')
  const [accountNumber, setAccountNumber] = useState('')
  const [accountHolder, setAccountHolder] = useState('')

  useEffect(() => {
    // Inicializar datos del crédito
    setAccountHolder(`${credit.name} ${credit.lastname}`)
  }, [credit])

  useEffect(() => {
    setAnalyst3Checklist({
      reviewAnalyst1: !!credit.analyst3Checklist?.reviewAnalyst1,
      reviewAnalyst2: !!credit.analyst3Checklist?.reviewAnalyst2,
      finalRectification: !!credit.analyst3Checklist?.finalRectification,
    })
  }, [credit._id])

  const toggleChecklist = async (key: 'reviewAnalyst1' | 'reviewAnalyst2' | 'finalRectification') => {
    const prev = analyst3Checklist
    const next = { ...prev, [key]: !prev[key] }
    setAnalyst3Checklist(next)
    setChecklistError(null)
    try {
      setChecklistSaving(true)
      await updateCreditData(credit._id, { analyst3Checklist: next })
    } catch (e) {
      console.error(e)
      setChecklistError('No se pudo guardar el checklist. Intenta nuevamente.')
      setAnalyst3Checklist(prev)
    } finally {
      setChecklistSaving(false)
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

  const handleGenerateContract = async () => {
    try {
      setLoading(true)
      const result = await generateSignatureLink(credit._id)
      setContractGenerated(true)
      setSignatureLink(result.link || 'https://firma.ejemplo.com/contrato-12345')
      alert('Contrato generado y enlace de firma enviado al cliente')
    } catch (error) {
      console.error('Error generating contract:', error)
      alert('Error al generar el contrato')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmDisburse = async () => {
    if (!disburseMethod || (disburseMethod === 'transfer' && (!bankName || !accountNumber))) {
      alert('Por favor complete todos los datos de desembolso')
      return
    }

    try {
      setLoading(true)
      await confirmDisburse(credit._id, {
        method: disburseMethod,
        bankName,
        accountType,
        accountNumber,
        accountHolder,
      })
      alert('Desembolso configurado exitosamente. El crédito está listo para transferencia.')
      onRefresh()
      onBack()
    } catch (error) {
      console.error('Error confirming disburse:', error)
      alert('Error al configurar el desembolso')
    } finally {
      setLoading(false)
    }
  }

  const handleDocumentReview = (docId: string, newStatus: 'approved' | 'rejected') => {
    setDocuments(docs =>
      docs.map(doc =>
        doc.id === docId
          ? { ...doc, status: newStatus, reviewNotes: docReviewNotes }
          : doc
      )
    )
    setSelectedDoc(null)
    setDocReviewNotes('')
    alert(`Documento ${newStatus === 'approved' ? 'aprobado' : 'rechazado'} exitosamente`)
  }

  const allDocsApproved = documents.every(doc => doc.status === 'approved')
  const statusProp = CreditStatusesProperties.find((s) => s.status === credit.status)

  const TabButton = ({ tab, label, icon, badge }: { tab: typeof activeTab; label: string; icon: string; badge?: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`relative flex items-center gap-2 px-6 py-3 font-semibold transition-all ${
        activeTab === tab
          ? 'border-b-4 border-primary-color text-primary-color'
          : 'text-gray-500 hover:text-primary-color'
      }`}
    >
      <span className='text-xl'>{icon}</span>
      {label}
      {badge && (
        <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
          {badge}
        </span>
      )}
    </button>
  )

  const getTimelineSteps = (): TimelineStep[] => {
    return [
      {
        id: 'submitted',
        title: 'Crédito Radicado',
        description: 'El crédito fue radicado desde el módulo comercial',
        status: 'completed',
        date: credit.radicationDate || credit.created,
      },
      {
        id: 'analyst1',
        title: 'Analista 1 - Validación Completada',
        description: 'Capacidad de pago y KYC verificados exitosamente',
        status: 'completed',
      },
      {
        id: 'analyst2',
        title: 'Analista 2 - Análisis Completado',
        description: 'Referencias verificadas y asegurabilidad confirmada',
        status: 'completed',
      },
      {
        id: 'analyst3',
        title: 'Analista 3 - Pre-aprobación (Actual)',
        description: 'Revisión de documentos y aprobación final en proceso',
        status: 'active',
        analyst: 'Analista 3',
      },
      {
        id: 'signature',
        title: 'Firma Electrónica',
        description: 'Pendiente de firma del contrato',
        status: contractSigned ? 'completed' : 'pending',
      },
      {
        id: 'disburse',
        title: 'Desembolso',
        description: 'Transferencia de fondos',
        status: 'pending',
      },
    ]
  }

  const pendingDocsCount = documents.filter(d => d.status === 'pending').length

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
        <div className='bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white'>
          <div className='flex justify-between items-center'>
            <div>
              <h1 className='text-3xl font-bold mb-2'>Analista 3 - Pre-aprobación y Documentos</h1>
              <p className='text-lg opacity-90'>{credit.name} {credit.lastname}</p>
              <p className='text-sm opacity-75'>Doc: {credit.documentNumber} | Radicado: {credit.radicationNumber || credit.code}</p>
            </div>
            <div className='text-right'>
              <TagStatus
                text={statusProp?.text || credit.status}
                background='bg-white text-purple-600'
              />
              <p className='mt-2 text-2xl font-bold'>${formatCurrency(credit.amount)}</p>
              <p className='text-sm opacity-75'>{credit.quotasNumber} cuotas mensuales</p>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className='border-b flex overflow-x-auto'>
          <TabButton tab='summary' label='Resumen' icon='📊' />
          <TabButton tab='rectification' label='Rectificación' icon='✅' />
          <TabButton tab='documents' label='Documentos' icon='📄' badge={pendingDocsCount > 0 ? String(pendingDocsCount) : undefined} />
          <TabButton tab='contract' label='Contrato' icon='📝' />
          <TabButton tab='disburse' label='Desembolso' icon='💰' />
          <TabButton tab='portfolio' label='Compras de cartera' icon='💳' />
          <TabButton tab='history' label='Historial' icon='🕐' />
        </div>

        {/* Tab Content */}
        <div className='p-6'>
          {/* Rectificación (paso a paso) */}
          {activeTab === 'rectification' && (
            <div className='space-y-6'>
              {checklistError && (
                <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg'>
                  {checklistError}
                </div>
              )}

              <div className='bg-white border border-gray-200 rounded-lg p-6'>
                <div className='flex items-center justify-between gap-4'>
                  <div>
                    <h3 className='text-lg font-bold text-gray-900'>Rectificación</h3>
                    <p className='text-sm text-gray-600'>Marca cada paso cuando termines esa sección</p>
                  </div>
                  <div className='text-right'>
                    <p className='text-sm font-semibold text-gray-700'>
                      Completado: {Object.values(analyst3Checklist).filter(Boolean).length}/3
                    </p>
                    {checklistSaving && (
                      <p className='text-xs text-blue-600 font-semibold'>Guardando...</p>
                    )}
                  </div>
                </div>

                <div className='mt-5 space-y-3'>
                  {/* Rectificación Analista 1 - Botón con popup */}
                  <div className='relative'>
                    <button
                      type='button'
                      disabled={checklistSaving}
                      onClick={() => setShowAnalyst1Popup(true)}
                      className={`w-full flex items-start gap-4 p-4 rounded-xl border transition-all text-left ${
                        analyst3Checklist.reviewAnalyst1 ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white hover:bg-gray-50'
                      } ${checklistSaving ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className={`mt-0.5 w-6 h-6 rounded-md border flex items-center justify-center ${analyst3Checklist.reviewAnalyst1 ? 'bg-green-600 border-green-600' : 'bg-white border-gray-300'}`}>
                        {analyst3Checklist.reviewAnalyst1 && (
                          <svg className='w-4 h-4 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={3} d='M5 13l4 4L19 7' />
                          </svg>
                        )}
                      </div>
                      <div className='flex-1'>
                        <p className='font-bold text-gray-900'>Paso: Rectificación Analista 1</p>
                        <p className='text-sm text-gray-600'>Revisión robusta de KYC, riesgo y capacidad</p>
                        <p className='text-xs text-blue-600 mt-1'>Haz clic para ver resumen →</p>
                      </div>
                      <div className='mt-1 text-sm font-semibold'>
                        <span className={analyst3Checklist.reviewAnalyst1 ? 'text-green-700' : 'text-gray-500'}>
                          {analyst3Checklist.reviewAnalyst1 ? 'Hecho' : 'Pendiente'}
                        </span>
                      </div>
                    </button>
                  </div>

                  {/* Rectificación Analista 2 - Botón con popup */}
                  <div className='relative'>
                    <button
                      type='button'
                      disabled={checklistSaving}
                      onClick={() => setShowAnalyst2Popup(true)}
                      className={`w-full flex items-start gap-4 p-4 rounded-xl border transition-all text-left ${
                        analyst3Checklist.reviewAnalyst2 ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white hover:bg-gray-50'
                      } ${checklistSaving ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className={`mt-0.5 w-6 h-6 rounded-md border flex items-center justify-center ${analyst3Checklist.reviewAnalyst2 ? 'bg-green-600 border-green-600' : 'bg-white border-gray-300'}`}>
                        {analyst3Checklist.reviewAnalyst2 && (
                          <svg className='w-4 h-4 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={3} d='M5 13l4 4L19 7' />
                          </svg>
                        )}
                      </div>
                      <div className='flex-1'>
                        <p className='font-bold text-gray-900'>Paso: Rectificación Analista 2</p>
                        <p className='text-sm text-gray-600'>Revisión robusta de referencias, asegurabilidad y verificación</p>
                        <p className='text-xs text-blue-600 mt-1'>Haz clic para ver resumen →</p>
                      </div>
                      <div className='mt-1 text-sm font-semibold'>
                        <span className={analyst3Checklist.reviewAnalyst2 ? 'text-green-700' : 'text-gray-500'}>
                          {analyst3Checklist.reviewAnalyst2 ? 'Hecho' : 'Pendiente'}
                        </span>
                      </div>
                    </button>
                  </div>

                  {/* Rectificación Final - Solo botón de checklist */}
                  <button
                    type='button'
                    disabled={checklistSaving}
                    onClick={() => toggleChecklist('finalRectification')}
                    className={`w-full flex items-start gap-4 p-4 rounded-xl border transition-all text-left ${
                      analyst3Checklist.finalRectification ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white hover:bg-gray-50'
                    } ${checklistSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    <div className={`mt-0.5 w-6 h-6 rounded-md border flex items-center justify-center ${analyst3Checklist.finalRectification ? 'bg-green-600 border-green-600' : 'bg-white border-gray-300'}`}>
                      {analyst3Checklist.finalRectification && (
                        <svg className='w-4 h-4 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={3} d='M5 13l4 4L19 7' />
                        </svg>
                      )}
                    </div>
                    <div className='flex-1'>
                      <p className='font-bold text-gray-900'>Paso: Rectificación final</p>
                      <p className='text-sm text-gray-600'>Conclusión final y consistencia general del caso</p>
                    </div>
                    <div className='mt-1 text-sm font-semibold'>
                      <span className={analyst3Checklist.finalRectification ? 'text-green-700' : 'text-gray-500'}>
                        {checklistSaving ? 'Guardando...' : analyst3Checklist.finalRectification ? 'Hecho' : 'Pendiente'}
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Resumen */}
          {activeTab === 'summary' && (
            <div className='space-y-6'>
              {/* Información del Crédito */}
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='bg-blue-50 p-4 rounded-lg border border-blue-200'>
                  <p className='text-sm text-blue-600 font-semibold'>Monto Solicitado</p>
                  <p className='text-2xl font-bold text-blue-800'>${formatCurrency(credit.amount)}</p>
                </div>
                <div className='bg-green-50 p-4 rounded-lg border border-green-200'>
                  <p className='text-sm text-green-600 font-semibold'>Plazo</p>
                  <p className='text-2xl font-bold text-green-800'>{credit.quotasNumber} meses</p>
                </div>
                <div className='bg-purple-50 p-4 rounded-lg border border-purple-200'>
                  <p className='text-sm text-purple-600 font-semibold'>Cuota Estimada</p>
                  <p className='text-2xl font-bold text-purple-800'>
                    ${formatCurrency(Math.round((Number(credit.amount) * 1.15) / credit.quotasNumber))}
                  </p>
                </div>
              </div>

              {/* Estado de Documentos */}
              <div className='bg-gray-50 p-6 rounded-lg'>
                <h3 className='font-bold text-lg mb-4 flex items-center gap-2'>
                  <span>📄</span> Estado de Documentación
                </h3>
                <div className='grid grid-cols-3 gap-4 mb-4'>
                  <div className='text-center'>
                    <div className='text-3xl font-bold text-green-600'>
                      {documents.filter(d => d.status === 'approved').length}
                    </div>
                    <div className='text-sm text-gray-600'>Aprobados</div>
                  </div>
                  <div className='text-center'>
                    <div className='text-3xl font-bold text-yellow-600'>
                      {documents.filter(d => d.status === 'pending').length}
                    </div>
                    <div className='text-sm text-gray-600'>Pendientes</div>
                  </div>
                  <div className='text-center'>
                    <div className='text-3xl font-bold text-red-600'>
                      {documents.filter(d => d.status === 'rejected').length}
                    </div>
                    <div className='text-sm text-gray-600'>Rechazados</div>
                  </div>
                </div>
                <div className='w-full bg-gray-200 rounded-full h-4'>
                  <div
                    className='bg-green-500 h-4 rounded-full transition-all'
                    style={{ width: `${(documents.filter(d => d.status === 'approved').length / documents.length) * 100}%` }}
                  />
                </div>
                <p className='text-center text-sm text-gray-600 mt-2'>
                  {Math.round((documents.filter(d => d.status === 'approved').length / documents.length) * 100)}% completado
                </p>
              </div>

              {/* Checklist de Pre-aprobación */}
              <div className='bg-white border-2 border-gray-200 rounded-lg p-6'>
                <h3 className='font-bold text-lg mb-4 flex items-center gap-2'>
                  <span>✓</span> Checklist de Pre-aprobación
                </h3>
                <div className='space-y-3'>
                  <ChecklistItem
                    label='Análisis de Capacidad (Analista 1)'
                    completed={true}
                  />
                  <ChecklistItem
                    label='Verificación de Referencias (Analista 2)'
                    completed={true}
                  />
                  <ChecklistItem
                    label='Documentos Aprobados'
                    completed={allDocsApproved}
                  />
                  <ChecklistItem
                    label='Contrato Generado'
                    completed={contractGenerated}
                  />
                  <ChecklistItem
                    label='Firma Electrónica'
                    completed={contractSigned}
                  />
                  <ChecklistItem
                    label='Datos de Desembolso'
                    completed={!!accountNumber}
                  />
                </div>
              </div>

              {/* Alertas */}
              {!allDocsApproved && (
                <div className='bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded'>
                  <p className='font-semibold text-yellow-800'>⚠️ Acción Requerida</p>
                  <p className='text-yellow-700'>Hay {pendingDocsCount} documento(s) pendiente(s) de revisión</p>
                </div>
              )}
            </div>
          )}

          {/* Documentos */}
          {activeTab === 'documents' && (
            <div className='space-y-6'>
              <div className='flex justify-between items-center'>
                <h3 className='font-bold text-xl'>Documentos del Cliente</h3>
                <div className='flex gap-2'>
                  <button
                    onClick={() => setDocuments(docs => docs.map(d => ({ ...d, status: 'approved' })))}
                    className='px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm'
                  >
                    Aprobar Todos
                  </button>
                </div>
              </div>

              <div className='grid grid-cols-1 gap-4'>
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className={`border-2 rounded-lg p-4 transition-all ${
                      doc.status === 'approved'
                        ? 'border-green-500 bg-green-50'
                        : doc.status === 'rejected'
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300 bg-white hover:border-primary-color'
                    }`}
                  >
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-4'>
                        <div className='text-4xl'>
                          {doc.status === 'approved' ? '✅' : doc.status === 'rejected' ? '❌' : '📄'}
                        </div>
                        <div>
                          <h4 className='font-bold text-lg'>{doc.name}</h4>
                          <p className='text-sm text-gray-600'>Tipo: {doc.type}</p>
                          {doc.uploadDate && (
                            <p className='text-xs text-gray-500'>
                              Subido: {new Date(doc.uploadDate).toLocaleDateString()}
                            </p>
                          )}
                          {doc.reviewNotes && (
                            <p className='text-sm text-gray-700 mt-1'>
                              <strong>Notas:</strong> {doc.reviewNotes}
                            </p>
                          )}
                        </div>
                      </div>

                      {doc.status === 'pending' && (
                        <div className='flex gap-2'>
                          <button
                            onClick={() => setSelectedDoc(doc)}
                            className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
                          >
                            Revisar
                          </button>
                        </div>
                      )}

                      {doc.status !== 'pending' && (
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-semibold ${
                            doc.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {doc.status === 'approved' ? 'Aprobado' : 'Rechazado'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Modal de Revisión */}
              {selectedDoc && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                  <div className='bg-white rounded-lg p-6 max-w-2xl w-full mx-4'>
                    <h3 className='font-bold text-xl mb-4'>Revisar: {selectedDoc.name}</h3>
                    
                    <div className='bg-gray-100 p-4 rounded mb-4 h-64 flex items-center justify-center'>
                      <p className='text-gray-500'>Vista previa del documento</p>
                    </div>

                    <div className='mb-4'>
                      <label className='block font-semibold mb-2'>Notas de Revisión:</label>
                      <textarea
                        value={docReviewNotes}
                        onChange={(e) => setDocReviewNotes(e.target.value)}
                        className='w-full border rounded-lg p-3'
                        rows={3}
                        placeholder='Agregue observaciones sobre este documento...'
                      />
                    </div>

                    <div className='flex gap-3'>
                      <button
                        onClick={() => handleDocumentReview(selectedDoc.id, 'approved')}
                        className='flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700'
                      >
                        ✓ Aprobar Documento
                      </button>
                      <button
                        onClick={() => handleDocumentReview(selectedDoc.id, 'rejected')}
                        className='flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700'
                      >
                        ✗ Rechazar Documento
                      </button>
                      <button
                        onClick={() => {
                          setSelectedDoc(null)
                          setDocReviewNotes('')
                        }}
                        className='px-6 py-3 bg-gray-400 text-white rounded-lg font-semibold hover:bg-gray-500'
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Contrato */}
          {activeTab === 'contract' && (
            <div className='space-y-6'>
              <div className='bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg border border-purple-200'>
                <h3 className='font-bold text-xl mb-4 flex items-center gap-2'>
                  <span>📝</span> Generación de Contrato y Pagaré
                </h3>
                <p className='text-gray-700 mb-4'>
                  El contrato incluye los términos y condiciones del crédito, la tabla de amortización y el pagaré.
                </p>

                {!contractGenerated ? (
                  <div className='space-y-4'>
                    <div className='bg-white p-4 rounded-lg'>
                      <h4 className='font-semibold mb-2'>Información del Contrato:</h4>
                      <ul className='space-y-2 text-sm'>
                        <li>• <strong>Cliente:</strong> {credit.name} {credit.lastname}</li>
                        <li>• <strong>Monto:</strong> ${Number(credit.amount).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</li>
                        <li>• <strong>Plazo:</strong> {credit.quotasNumber} meses</li>
                        <li>• <strong>Tasa de Interés:</strong> 1.5% mensual (aprox.)</li>
                        <li>• <strong>Forma de Pago:</strong> Mensual</li>
                      </ul>
                    </div>

                    <button
                      onClick={handleGenerateContract}
                      disabled={loading || !allDocsApproved}
                      className='w-full bg-purple-600 text-white py-4 rounded-lg font-bold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                    >
                      {loading ? (
                        <>
                          <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
                          Generando...
                        </>
                      ) : (
                        <>
                          <span>📄</span>
                          Generar Contrato y Enviar para Firma
                        </>
                      )}
                    </button>

                    {!allDocsApproved && (
                      <p className='text-sm text-red-600 text-center'>
                        ⚠️ Todos los documentos deben estar aprobados antes de generar el contrato
                      </p>
                    )}
                  </div>
                ) : (
                  <div className='space-y-4'>
                    <div className='bg-white p-6 rounded-lg border-2 border-green-500'>
                      <div className='flex items-center gap-3 mb-4'>
                        <span className='text-4xl'>✅</span>
                        <div>
                          <h4 className='font-bold text-lg'>Contrato Generado</h4>
                          <p className='text-sm text-gray-600'>El enlace de firma fue enviado al cliente</p>
                        </div>
                      </div>

                      <div className='bg-gray-50 p-3 rounded mb-3'>
                        <p className='text-xs text-gray-600 mb-1'>Enlace de Firma Electrónica:</p>
                        <p className='text-sm font-mono break-all'>{signatureLink}</p>
                      </div>

                      <div className='flex gap-3'>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(signatureLink)
                            alert('Enlace copiado al portapapeles')
                          }}
                          className='flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700'
                        >
                          📋 Copiar Enlace
                        </button>
                        <button
                          onClick={() => setContractSigned(true)}
                          className='flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700'
                        >
                          ✓ Confirmar Firma (Demo)
                        </button>
                      </div>
                    </div>

                    {contractSigned && (
                      <div className='bg-green-50 border-l-4 border-green-500 p-4 rounded'>
                        <p className='font-semibold text-green-800 flex items-center gap-2'>
                          <span>✓</span> Contrato Firmado Exitosamente
                        </p>
                        <p className='text-sm text-green-700'>El cliente ha firmado el contrato. Proceda con la configuración del desembolso.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Desembolso */}
          {activeTab === 'disburse' && (
            <div className='space-y-6'>
              <div className='bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200'>
                <h3 className='font-bold text-xl mb-4 flex items-center gap-2'>
                  <span>💰</span> Configuración de Desembolso
                </h3>

                <div className='space-y-4'>
                  {/* Método de Desembolso */}
                  <div>
                    <label className='block font-semibold mb-2'>Método de Desembolso:</label>
                    <div className='grid grid-cols-3 gap-3'>
                      <button
                        onClick={() => setDisburseMethod('transfer')}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          disburseMethod === 'transfer'
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-300 hover:border-green-300'
                        }`}
                      >
                        <div className='text-3xl mb-2'>🏦</div>
                        <div className='font-semibold'>Transferencia</div>
                      </button>
                      <button
                        onClick={() => setDisburseMethod('check')}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          disburseMethod === 'check'
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-300 hover:border-green-300'
                        }`}
                      >
                        <div className='text-3xl mb-2'>📝</div>
                        <div className='font-semibold'>Cheque</div>
                      </button>
                      <button
                        onClick={() => setDisburseMethod('cash')}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          disburseMethod === 'cash'
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-300 hover:border-green-300'
                        }`}
                      >
                        <div className='text-3xl mb-2'>💵</div>
                        <div className='font-semibold'>Efectivo</div>
                      </button>
                    </div>
                  </div>

                  {disburseMethod === 'transfer' && (
                    <div className='bg-white p-6 rounded-lg border space-y-4'>
                      <h4 className='font-semibold'>Datos Bancarios del Cliente:</h4>
                      
                      <div>
                        <label className='block text-sm font-semibold mb-1'>Titular de la Cuenta:</label>
                        <input
                          type='text'
                          value={accountHolder}
                          onChange={(e) => setAccountHolder(e.target.value)}
                          className='w-full border rounded-lg p-3'
                          placeholder='Nombre completo del titular'
                        />
                      </div>

                      <div>
                        <label className='block text-sm font-semibold mb-1'>Banco:</label>
                        <select
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          className='w-full border rounded-lg p-3'
                        >
                          <option value=''>Seleccione un banco</option>
                          <option value='Bancolombia'>Bancolombia</option>
                          <option value='Davivienda'>Davivienda</option>
                          <option value='Banco de Bogotá'>Banco de Bogotá</option>
                          <option value='BBVA'>BBVA</option>
                          <option value='Banco Popular'>Banco Popular</option>
                          <option value='Banco de Occidente'>Banco de Occidente</option>
                          <option value='Colpatria'>Colpatria</option>
                          <option value='Nequi'>Nequi</option>
                          <option value='Daviplata'>Daviplata</option>
                        </select>
                      </div>

                      <div>
                        <label className='block text-sm font-semibold mb-1'>Tipo de Cuenta:</label>
                        <div className='flex gap-4'>
                          <label className='flex items-center gap-2 cursor-pointer'>
                            <input
                              type='radio'
                              value='savings'
                              checked={accountType === 'savings'}
                              onChange={(e) => setAccountType(e.target.value as 'savings' | 'checking')}
                              className='w-4 h-4'
                            />
                            <span>Ahorros</span>
                          </label>
                          <label className='flex items-center gap-2 cursor-pointer'>
                            <input
                              type='radio'
                              value='checking'
                              checked={accountType === 'checking'}
                              onChange={(e) => setAccountType(e.target.value as 'savings' | 'checking')}
                              className='w-4 h-4'
                            />
                            <span>Corriente</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className='block text-sm font-semibold mb-1'>Número de Cuenta:</label>
                        <input
                          type='text'
                          value={accountNumber}
                          onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                          className='w-full border rounded-lg p-3'
                          placeholder='Ingrese el número de cuenta'
                          maxLength={20}
                        />
                      </div>

                      <div className='bg-blue-50 p-4 rounded-lg'>
                        <h5 className='font-semibold mb-2'>Resumen de Desembolso:</h5>
                        <div className='space-y-1 text-sm'>
                          <p>• <strong>Monto a desembolsar:</strong> ${Number(credit.amount).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
                          <p>• <strong>Banco:</strong> {bankName || 'No seleccionado'}</p>
                          <p>• <strong>Tipo:</strong> {accountType === 'savings' ? 'Ahorros' : 'Corriente'}</p>
                          <p>• <strong>Cuenta:</strong> {accountNumber || 'No ingresado'}</p>
                          <p>• <strong>Titular:</strong> {accountHolder}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {disburseMethod !== 'transfer' && (
                    <div className='bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded'>
                      <p className='text-yellow-800'>
                        ℹ️ El desembolso por {disburseMethod === 'check' ? 'cheque' : 'efectivo'} debe ser gestionado por el área de tesorería.
                      </p>
                    </div>
                  )}

                  <button
                    onClick={handleConfirmDisburse}
                    disabled={loading || !contractSigned || (disburseMethod === 'transfer' && (!bankName || !accountNumber))}
                    className='w-full bg-green-600 text-white py-4 rounded-lg font-bold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                  >
                    {loading ? (
                      <>
                        <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <span>💰</span>
                        Confirmar Datos y Aprobar para Desembolso
                      </>
                    )}
                  </button>

                  {!contractSigned && (
                    <p className='text-sm text-red-600 text-center'>
                      ⚠️ El contrato debe estar firmado antes de configurar el desembolso
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

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
                            <p>Saldo: {debt.balance ? formatCurrency(debt.balance) : '--'}</p>
                            <p>Cuota: {debt.installment ? formatCurrency(debt.installment) : '--'}</p>
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
            <div>
              <h3 className='font-bold text-xl mb-4'>Trazabilidad del Proceso</h3>
              <CreditTimeline steps={getTimelineSteps()} />
            </div>
          )}
        </div>

        {/* Acciones del Analista */}
        <div className='border-t p-6 bg-gray-50'>
          <h3 className='font-semibold text-lg mb-4'>Acciones del Analista 3</h3>
          
          {!action && (
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <button
                onClick={() => setAction('approve')}
                disabled={!allDocsApproved}
                className='flex flex-col items-center justify-center gap-3 p-6 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                <span className='text-4xl'>✓</span>
                <span className='font-bold'>Pre-aprobar</span>
                <span className='text-sm opacity-90'>Enviar a firma</span>
              </button>
              <button
                onClick={() => setAction('return')}
                className='flex flex-col items-center justify-center gap-3 p-6 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all transform hover:scale-105'
              >
                <span className='text-4xl'>↩</span>
                <span className='font-bold'>Devolver</span>
                <span className='text-sm opacity-90'>Regresar a Analista 2</span>
              </button>
              <button
                onClick={() => setAction('reject')}
                className='flex flex-col items-center justify-center gap-3 p-6 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all transform hover:scale-105'
              >
                <span className='text-4xl'>✗</span>
                <span className='font-bold'>Rechazar</span>
                <span className='text-sm opacity-90'>Denegar definitivamente</span>
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
                  placeholder='Agregue observaciones sobre esta decisión...'
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
                        <option value='previous'>Devolver al analista anterior</option>
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
                  {loading ? 'Procesando...' : `Confirmar ${action === 'approve' ? 'Pre-aprobación' : action === 'reject' ? 'Rechazo' : 'Devolución'}`}
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

      {/* Popup Analista 1 */}
      {showAnalyst1Popup && (
        <AnalystSummaryPopup
          title="Resumen Analista 1"
          analyst="Analista 1"
          onClose={() => setShowAnalyst1Popup(false)}
          onMarkComplete={() => {
            toggleChecklist('reviewAnalyst1')
            setShowAnalyst1Popup(false)
          }}
          summary={getAnalyst1Summary(credit)}
          isCompleted={analyst3Checklist.reviewAnalyst1}
        />
      )}

      {/* Popup Analista 2 */}
      {showAnalyst2Popup && (
        <AnalystSummaryPopup
          title="Resumen Analista 2"
          analyst="Analista 2"
          onClose={() => setShowAnalyst2Popup(false)}
          onMarkComplete={() => {
            toggleChecklist('reviewAnalyst2')
            setShowAnalyst2Popup(false)
          }}
          summary={getAnalyst2Summary(credit)}
          isCompleted={analyst3Checklist.reviewAnalyst2}
        />
      )}
    </div>
  )
}

// Funciones helper para generar resúmenes
const getAnalyst1Summary = (credit: CreditData) => {
  const checklist = credit.analyst1Checklist || {}
  const validations = (credit as any).automaticValidations || {}

  return {
    kyc: {
      checked: checklist.kyc || false,
      description: 'Validación KYC (Know Your Customer)',
      details: checklist.kyc 
        ? (validations.kycScore ? `Score KYC: ${validations.kycScore}/100 - Validado` : 'Validación completada')
        : 'Pendiente de validación',
    },
    riskCentral: {
      checked: checklist.riskCentral || false,
      description: 'Centrales de Riesgo',
      details: checklist.riskCentral
        ? (validations.riskCentralsCheck ? 'Consulta realizada y aprobada' : 'Consulta completada')
        : 'Pendiente de consulta',
    },
    debtCapacity: {
      checked: checklist.debtCapacity || false,
      description: 'Capacidad de Endeudamiento',
      details: checklist.debtCapacity
        ? (validations.debtCapacityRatio 
          ? `Ratio de capacidad: ${((1 - validations.debtCapacityRatio) * 100).toFixed(1)}% - Evaluado`
          : 'Evaluación completada')
        : 'Pendiente de evaluación',
    },
    notes: 'Resumen de validaciones realizadas por Analista 1',
    reviewDate: new Date().toLocaleDateString('es-CO'),
  }
}

const getAnalyst2Summary = (credit: CreditData) => {
  const checklist = credit.analyst2Checklist || {}
  const isPensioner = credit.personType !== 'empleado'

  return {
    references: {
      checked: checklist.references || false,
      description: 'Validación de Referencias',
      details: checklist.references ? 'Referencias validadas y verificadas' : 'Pendiente de validación',
    },
    insurability: {
      checked: checklist.insurabilityPolicies || false,
      description: 'Políticas de Asegurabilidad',
      details: checklist.insurabilityPolicies ? 'Asegurabilidad evaluada y aprobada' : 'Pendiente de evaluación',
    },
    portfolioPurchase: {
      checked: checklist.portfolioPurchase || false,
      description: 'Compra de Cartera',
      details: checklist.portfolioPurchase 
        ? (credit.requiresPortfolioPurchase ? 'Compra de cartera procesada' : 'No aplica - Cliente no requiere compra de cartera')
        : 'Pendiente de revisión',
    },
    employmentOrPension: {
      checked: checklist.employmentOrPensionVerification || false,
      description: isPensioner ? 'Verificación de Pensión' : 'Verificación Laboral',
      details: checklist.employmentOrPensionVerification 
        ? (isPensioner 
          ? `Pensión verificada${credit.pensionType ? ` - Tipo: ${credit.pensionType}` : ''}${credit.pensionIssuer ? ` - Fondo: ${credit.pensionIssuer}` : ''}`
          : 'Verificación laboral completada')
        : 'Pendiente de verificación',
    },
    notes: 'Resumen de validaciones realizadas por Analista 2',
    reviewDate: new Date().toLocaleDateString('es-CO'),
  }
}

// Componente de Popup
const AnalystSummaryPopup = ({
  title,
  analyst,
  onClose,
  onMarkComplete,
  summary,
  isCompleted,
}: {
  title: string
  analyst: string
  onClose: () => void
  onMarkComplete: () => void
  summary: any
  isCompleted: boolean
}) => {
  const items = Object.keys(summary).filter(key => key !== 'notes' && key !== 'reviewDate')

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl'>
        <div className='sticky top-0 bg-white border-b p-6 flex justify-between items-center'>
          <div>
            <h2 className='text-2xl font-bold text-gray-900'>{title}</h2>
            <p className='text-sm text-gray-600 mt-1'>Resumen de validaciones realizadas por {analyst}</p>
          </div>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 transition-colors'
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className='p-6 space-y-6'>
          {/* Información general */}
          <div className='bg-gray-50 p-4 rounded-lg'>
            <div className='grid grid-cols-2 gap-4 text-sm'>
              <div>
                <span className='font-semibold text-gray-700'>Fecha de Revisión:</span>
                <span className='ml-2 text-gray-600'>{summary.reviewDate}</span>
              </div>
            </div>
          </div>

          {/* Items del checklist */}
          <div className='space-y-4'>
            <h3 className='font-bold text-lg text-gray-900'>Validaciones Realizadas:</h3>
            {items.map((key) => {
              const item = summary[key]
              return (
                <div
                  key={key}
                  className={`border-2 rounded-lg p-4 ${item.checked ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50'}`}
                >
                  <div className='flex items-start gap-3'>
                    <div className={`mt-1 w-5 h-5 rounded flex items-center justify-center ${item.checked ? 'bg-green-600' : 'bg-gray-300'}`}>
                      {item.checked && (
                        <svg className='w-3 h-3 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={3} d='M5 13l4 4L19 7' />
                        </svg>
                      )}
                    </div>
                    <div className='flex-1'>
                      <p className='font-bold text-gray-900'>{item.description}</p>
                      <p className='text-sm text-gray-600 mt-1'>{item.details}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Notas */}
          {summary.notes && summary.notes !== 'Sin notas adicionales' && (
            <div className='bg-blue-50 border-l-4 border-blue-400 p-4 rounded'>
              <h4 className='font-semibold text-blue-900 mb-2'>Notas del {analyst}:</h4>
              <p className='text-blue-800 text-sm'>{summary.notes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='sticky bottom-0 bg-gray-50 border-t p-6 flex justify-between items-center'>
          <button
            onClick={onClose}
            className='px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors'
          >
            Cerrar
          </button>
          <button
            onClick={onMarkComplete}
            disabled={isCompleted}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              isCompleted
                ? 'bg-green-600 text-white cursor-not-allowed'
                : 'bg-primary-color text-white hover:opacity-90'
            }`}
          >
            {isCompleted ? '✓ Ya completado' : 'Marcar como Completado'}
          </button>
        </div>
      </div>
    </div>
  )
}

// Helper Components
const ChecklistItem = ({ label, completed }: { label: string; completed: boolean }) => (
  <div className={`flex items-center gap-3 p-3 rounded-lg ${completed ? 'bg-green-50' : 'bg-gray-50'}`}>
    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${completed ? 'bg-green-500' : 'bg-gray-300'}`}>
      {completed && <span className='text-white text-sm'>✓</span>}
    </div>
    <span className={`font-semibold ${completed ? 'text-green-800' : 'text-gray-600'}`}>{label}</span>
  </div>
)

export default Analyst3CreditDetailImproved

