'use client'
import React, { useState, useEffect } from 'react'
import { getRadicatedCredits, resendCreditToAnalyst } from '../../../../services/commercialClientes'
import { uploadFile } from '../../../../services/uploadFile'
import CreditTimeline, { TimelineStep } from '../../../molecules/CreditTimeline/CreditTimeline'

interface RadicatedCredit {
  _id: string
  name: string
  lastname: string
  documentNumber: string
  amount: number
  status: string
  radicationDate: string
  created: string
  radicationNumber?: string
  quotasNumber?: number
  monthlyIncome?: string
  monthlyExpenses?: string
  nameCompany?: string
  phoneNumberCompany?: string
  returnHistory?: Array<{
    returnedBy: string
    returnedByRole?: string
    returnedTo: string
    reason: string
    date: string
    previousStatus: string
  }>
  phoneNumber?: string
  documentType?: string
  documentNumber?: string
  dateOfBirth?: string
  secondName?: string
  secondLastname?: string
}

const RadicadosModule = () => {
  const [credits, setCredits] = useState<RadicatedCredit[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCredit, setSelectedCredit] = useState<RadicatedCredit | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [resendNotes, setResendNotes] = useState<string>('')
  const [resending, setResending] = useState<boolean>(false)
  const [editData, setEditData] = useState<Partial<RadicatedCredit>>({})
  const [attachments, setAttachments] = useState<Array<{ fileName: string; fileUrl: string; documentType: string }>>([])
  const [uploadingAttachment, setUploadingAttachment] = useState(false)
  const [attachmentError, setAttachmentError] = useState<string | null>(null)

  useEffect(() => {
    fetchRadicatedCredits()
  }, [])

  const fetchRadicatedCredits = async () => {
    try {
      setLoading(true)
      const data = await getRadicatedCredits()
      setCredits(data)
      setError(null)
    } catch (err: any) {
      console.error('Error fetching radicated credits:', err)
      setError(err.response?.data?.message || 'Error al cargar los créditos radicados')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // No edición de datos en devolución; solo trazabilidad y reenvío
    setEditData({})
  }, [selectedCredit])

  const getTimelineSteps = (credit: RadicatedCredit): TimelineStep[] => {
    const steps: TimelineStep[] = []

    // Paso 1: Radicación
    steps.push({
      id: 'radicacion',
      title: 'Crédito Radicado',
      description: 'El crédito fue radicado exitosamente',
      status: 'completed',
      date: credit.radicationDate || credit.created,
      analyst: 'Sistema Comercial',
    })

    // Paso 2: Analista 1 - Validación Inicial
    const analyst1Status = getAnalyst1Status(credit.status)
    steps.push({
      id: 'analyst1',
      title: 'Analista 1 - Validación Inicial',
      description: 'Verificación de capacidad de pago y KYC',
      status: analyst1Status,
      analyst: analyst1Status !== 'pending' ? 'Analista 1' : undefined,
    })

    // Paso 3: Analista 2 - Análisis Cualitativo
    const analyst2Status = getAnalyst2Status(credit.status)
    steps.push({
      id: 'analyst2',
      title: 'Analista 2 - Análisis Cualitativo',
      description: 'Verificación de referencias y asegurabilidad',
      status: analyst2Status,
      analyst: analyst2Status !== 'pending' ? 'Analista 2' : undefined,
    })

    // Paso 4: Analista 3 - Documentos y Aprobación Final
    const analyst3Status = getAnalyst3Status(credit.status)
    steps.push({
      id: 'analyst3',
      title: 'Analista 3 - Aprobación Final',
      description: 'Revisión de documentos y aprobación final',
      status: analyst3Status,
      analyst: analyst3Status !== 'pending' ? 'Analista 3' : undefined,
    })

    // Paso 5: Firma Electrónica
    const signatureStatus = getSignatureStatus(credit.status)
    steps.push({
      id: 'signature',
      title: 'Firma Electrónica',
      description: 'Firma del contrato y pagaré',
      status: signatureStatus,
    })

    // Paso 6: Desembolso
    const disburseStatus = getDisburseStatus(credit.status)
    steps.push({
      id: 'disburse',
      title: 'Desembolso',
      description: 'Transferencia de fondos',
      status: disburseStatus,
    })

    return steps
  }

  const getAnalyst1Status = (status: string): TimelineStep['status'] => {
    if (status === 'SUBMITTED' || status === 'ANALYST1_REVIEW' || status === 'ANALYST1_VERIFICATION') return 'active'
    if (status.startsWith('ANALYST1') && status.includes('RETURNED')) return 'rejected'
    if (status.includes('ANALYST1_APPROVED') || status.includes('ANALYST2') || status.includes('ANALYST3') || status.includes('SIGNATURE') || status.includes('DISBURSE')) return 'completed'
    return 'pending'
  }

  const getAnalyst2Status = (status: string): TimelineStep['status'] => {
    if (status === 'ANALYST2_REVIEW' || status === 'ANALYST1_APPROVED' || status === 'ANALYST2_VERIFICATION') return 'active'
    if (status === 'ANALYST2_RETURNED') return 'rejected'
    if (status.includes('ANALYST2_APPROVED') || status.includes('ANALYST3') || status.includes('SIGNATURE') || status.includes('DISBURSE')) return 'completed'
    return 'pending'
  }

  const getAnalyst3Status = (status: string): TimelineStep['status'] => {
    if (status === 'ANALYST3_REVIEW' || status === 'ANALYST2_APPROVED' || status === 'ANALYST3_VERIFICATION') return 'active'
    if (status === 'ANALYST3_RETURNED') return 'rejected'
    if (status.includes('ANALYST3_APPROVED') || status.includes('SIGNATURE') || status.includes('READY_TO_DISBURSE') || status === 'DISBURSED') return 'completed'
    return 'pending'
  }

  const getSignatureStatus = (status: string): TimelineStep['status'] => {
    if (status === 'PENDING_SIGNATURE') return 'active'
    if (status === 'READY_TO_DISBURSE' || status === 'DISBURSED') return 'completed'
    return 'pending'
  }

  const getDisburseStatus = (status: string): TimelineStep['status'] => {
    if (status === 'READY_TO_DISBURSE') return 'active'
    if (status === 'DISBURSED') return 'completed'
    return 'pending'
  }

  const getStatusLabel = (status: string): { text: string; color: string } => {
    // Estados simplificados para la UI
    const statusMap: Record<string, { text: string; color: string }> = {
      // Nuevos estados simplificados
      PERFILADO: { text: 'Perfilado', color: 'bg-purple-100 text-purple-800' },
      RADICADO: { text: 'Radicado', color: 'bg-blue-100 text-blue-800' },
      EN_ESTUDIO: { text: 'En estudio', color: 'bg-yellow-100 text-yellow-800' },
      DEVUELTO: { text: 'Devuelto', color: 'bg-orange-100 text-orange-800' },
      RECHAZADO: { text: 'Rechazado', color: 'bg-red-100 text-red-800' },
      DESEMBOLSADO: { text: 'Desembolsado', color: 'bg-green-100 text-green-800' },
      
      // Estados internos mapeados a simplificados
      SUBMITTED: { text: 'Radicado', color: 'bg-blue-100 text-blue-800' },
      ANALYST1_REVIEW: { text: 'En estudio', color: 'bg-yellow-100 text-yellow-800' },
      ANALYST1_APPROVED: { text: 'En estudio', color: 'bg-yellow-100 text-yellow-800' },
      ANALYST1_VERIFICATION: { text: 'En estudio', color: 'bg-yellow-100 text-yellow-800' },
      ANALYST1_RETURNED: { text: 'Devuelto', color: 'bg-orange-100 text-orange-800' },
      ANALYST2_REVIEW: { text: 'En estudio', color: 'bg-yellow-100 text-yellow-800' },
      ANALYST2_APPROVED: { text: 'En estudio', color: 'bg-yellow-100 text-yellow-800' },
      ANALYST2_VERIFICATION: { text: 'En estudio', color: 'bg-yellow-100 text-yellow-800' },
      ANALYST2_RETURNED: { text: 'Devuelto', color: 'bg-orange-100 text-orange-800' },
      ANALYST3_REVIEW: { text: 'En estudio', color: 'bg-yellow-100 text-yellow-800' },
      ANALYST3_APPROVED: { text: 'En estudio', color: 'bg-yellow-100 text-yellow-800' },
      ANALYST3_VERIFICATION: { text: 'En estudio', color: 'bg-yellow-100 text-yellow-800' },
      ANALYST3_RETURNED: { text: 'Devuelto', color: 'bg-orange-100 text-orange-800' },
      PENDING_SIGNATURE: { text: 'En estudio', color: 'bg-yellow-100 text-yellow-800' },
      READY_TO_DISBURSE: { text: 'En estudio', color: 'bg-yellow-100 text-yellow-800' },
      DISBURSED: { text: 'Desembolsado', color: 'bg-green-100 text-green-800' },
      REJECTED: { text: 'Rechazado', color: 'bg-red-100 text-red-800' },
      COMMERCIAL_RETURNED: { text: 'Devuelto', color: 'bg-orange-100 text-orange-800' },
    }

    return statusMap[status] || { text: status, color: 'bg-gray-100 text-gray-800' }
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <div className='w-12 h-12 border-4 border-primary-color border-t-accent-color rounded-full animate-spin mx-auto mb-4'></div>
          <p className='text-gray-600 font-semibold'>Cargando créditos radicados...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='bg-red-50 border border-red-300 rounded-lg p-6 text-center'>
        <p className='text-red-800 font-semibold mb-2'>Error al cargar créditos radicados</p>
        <p className='text-red-600 text-sm mb-4'>{error}</p>
        <button
          onClick={fetchRadicatedCredits}
          className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition'
        >
          Reintentar
        </button>
      </div>
    )
  }

  if (selectedCredit) {
    const statusLabel = getStatusLabel(selectedCredit.status)
    const lastReturn = selectedCredit.returnHistory?.slice(-1)[0]

    const handleResendToAnalyst = async () => {
      if (!selectedCredit) return
      try {
        setResending(true)
        await resendCreditToAnalyst(selectedCredit._id, resendNotes || undefined, attachments.length > 0 ? attachments : undefined)
        alert('Crédito reenviado al analista exitosamente')
        setResendNotes('')
        setAttachments([])
        setSelectedCredit(null)
        fetchRadicatedCredits()
      } catch (err: any) {
        console.error('Error reenviando crédito:', err)
        alert(err.response?.data?.message || 'No se pudo reenviar el crédito')
      } finally {
        setResending(false)
      }
    }

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      // Validar tipo de archivo (solo PDF)
      if (file.type !== 'application/pdf') {
        setAttachmentError('Solo se permiten archivos PDF')
        return
      }

      // Validar tamaño (máx 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setAttachmentError('El archivo no debe exceder 10MB')
        return
      }

      try {
        setUploadingAttachment(true)
        setAttachmentError(null)

        const fileUrl = await uploadFile(file, 'return-attachment')
        const newAttachment = {
          fileName: file.name,
          fileUrl,
          documentType: 'return-attachment',
        }

        setAttachments([...attachments, newAttachment])
      } catch (error: any) {
        setAttachmentError(error.message || 'Error al subir el archivo')
      } finally {
        setUploadingAttachment(false)
      }
    }

    const removeAttachment = (index: number) => {
      setAttachments(attachments.filter((_, i) => i !== index))
    }

    return (
      <div className='space-y-6'>
        <button
          onClick={() => setSelectedCredit(null)}
          className='flex items-center gap-2 text-primary-color hover:underline font-semibold'
        >
          ← Volver a la lista
        </button>

        <div className='bg-white rounded-lg shadow-lg p-6'>
          <div className='flex justify-between items-start mb-6'>
            <div>
              <h2 className='text-2xl font-bold text-gray-800'>
                {selectedCredit.name} {selectedCredit.lastname}
              </h2>
              <p className='text-gray-600'>Documento: {selectedCredit.documentNumber}</p>
              <p className='text-xl font-bold text-primary-color mt-2'>
                ${selectedCredit.amount.toLocaleString('es-CO')}
              </p>
              <p className='text-sm text-gray-500 mt-1'>
                Radicación: {selectedCredit.radicationNumber || 'N/A'}
              </p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statusLabel.color}`}>
              {statusLabel.text}
            </span>
          </div>

          {/* Información Adicional del Crédito */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 pb-6 border-b'>
            <div className='bg-blue-50 p-4 rounded-lg'>
              <p className='text-sm text-blue-600 font-semibold'>Cuotas</p>
              <p className='text-2xl font-bold text-blue-800'>{selectedCredit.quotasNumber || 'N/A'}</p>
            </div>
            <div className='bg-green-50 p-4 rounded-lg'>
              <p className='text-sm text-green-600 font-semibold'>Ingresos Mensuales</p>
              <p className='text-xl font-bold text-green-800'>
                ${selectedCredit.monthlyIncome ? Number(selectedCredit.monthlyIncome).toLocaleString('es-CO') : 'N/A'}
              </p>
            </div>
            <div className='bg-purple-50 p-4 rounded-lg'>
              <p className='text-sm text-purple-600 font-semibold'>Empresa</p>
              <p className='text-lg font-bold text-purple-800'>{selectedCredit.nameCompany || 'N/A'}</p>
            </div>
          </div>

          <div className='border-t pt-6'>
            <h3 className='text-xl font-bold mb-4'>Trazabilidad del Proceso</h3>
            <CreditTimeline steps={getTimelineSteps(selectedCredit)} />
          </div>

          {selectedCredit.status === 'COMMERCIAL_RETURNED' && (
            <div className='mt-6 border-t pt-6'>
              <h3 className='text-xl font-bold mb-3 text-orange-700'>Acción requerida por el comercial</h3>
              <div className='bg-orange-50 border border-orange-200 rounded-lg p-4 space-y-4'>
                <p className='text-sm text-orange-800 font-semibold'>Motivo de devolución del analista:</p>
                <p className='text-sm text-orange-900'>
                  {lastReturn?.reason || 'El analista solicitó información adicional.'}
                </p>

                <div className='flex-1'>
                  <label className='block text-sm font-semibold text-gray-700 mb-1'>Notas / Justificación (opcional)</label>
                  <textarea
                    value={resendNotes}
                    onChange={(e) => setResendNotes(e.target.value)}
                    rows={4}
                    className='w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-color'
                    placeholder='Describe qué documento adjuntas y la justificación para el analista'
                  />
                </div>

                {/* Adjuntar PDF */}
                <div className='border-t pt-4'>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>
                    Adjuntar PDF de respuesta (opcional)
                  </label>
                  <p className='text-xs text-gray-600 mb-3'>
                    Puede adjuntar un documento PDF con la información solicitada
                  </p>

                  {/* Área de carga */}
                  <div className='border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors'>
                    <input
                      type='file'
                      accept='.pdf'
                      onChange={handleFileUpload}
                      disabled={uploadingAttachment}
                      className='hidden'
                      id='pdf-upload-commercial'
                    />
                    <label
                      htmlFor='pdf-upload-commercial'
                      className='cursor-pointer flex flex-col items-center'
                    >
                      <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      {uploadingAttachment ? (
                        <p className='text-sm text-blue-600'>Subiendo archivo...</p>
                      ) : (
                        <>
                          <p className='text-sm text-gray-700 font-medium'>Haz clic para seleccionar un PDF</p>
                          <p className='text-xs text-gray-500'>Máximo 10MB</p>
                        </>
                      )}
                    </label>
                  </div>

                  {/* Lista de archivos adjuntos */}
                  {attachments.length > 0 && (
                    <div className='mt-3 space-y-2'>
                      <p className='text-sm font-medium text-gray-700'>Archivos adjuntos:</p>
                      {attachments.map((attachment, index) => (
                        <div key={index} className='flex items-center justify-between bg-gray-50 p-2 rounded'>
                          <div className='flex items-center gap-2'>
                            <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className='text-sm text-gray-700'>{attachment.fileName}</span>
                          </div>
                          <button
                            onClick={() => removeAttachment(index)}
                            className='text-red-500 hover:text-red-700'
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {attachmentError && (
                    <div className='mt-3 bg-red-50 border border-red-200 rounded p-3 text-sm text-red-600'>
                      ⚠️ {attachmentError}
                    </div>
                  )}
                </div>

                <button
                  disabled={resending || uploadingAttachment}
                  onClick={handleResendToAnalyst}
                  className='w-full md:w-auto px-4 py-2 bg-primary-color text-white rounded-lg hover:bg-accent-color transition disabled:opacity-60'
                >
                  {resending ? 'Enviando...' : 'Reenviar al analista'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div>
        <h2 className='text-3xl font-bold text-gray-800 mb-2'>Créditos Radicados</h2>
        <p className='text-gray-600'>Seguimiento de los créditos enviados a los analistas</p>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
        <div className='bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200'>
          <p className='text-blue-600 text-sm font-semibold'>Total Radicados</p>
          <p className='text-2xl font-bold text-blue-800 mt-1'>{credits.length}</p>
        </div>
        <div className='bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200'>
          <p className='text-yellow-600 text-sm font-semibold'>En Proceso</p>
          <p className='text-2xl font-bold text-yellow-800 mt-1'>
            {credits.filter(c => !c.status.includes('DISBURSED') && !c.status.includes('REJECTED')).length}
          </p>
        </div>
        <div className='bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200'>
          <p className='text-green-600 text-sm font-semibold'>Desembolsados</p>
          <p className='text-2xl font-bold text-green-800 mt-1'>
            {credits.filter(c => c.status === 'DISBURSED').length}
          </p>
        </div>
        <div className='bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200'>
          <p className='text-red-600 text-sm font-semibold'>Rechazados</p>
          <p className='text-2xl font-bold text-red-800 mt-1'>
            {credits.filter(c => c.status === 'REJECTED').length}
          </p>
        </div>
      </div>

      {/* Credits List */}
      {credits.length > 0 ? (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {credits.map((credit) => {
            const statusLabel = getStatusLabel(credit.status)
            return (
              <div
                key={credit._id}
                onClick={() => setSelectedCredit(credit)}
                className='bg-white rounded-lg shadow-md p-6 border-2 border-gray-200 hover:border-primary-color transition-all cursor-pointer hover:shadow-lg'
              >
                <div className='flex justify-between items-start mb-4'>
                  <div>
                    <h3 className='text-xl font-bold text-gray-800'>
                      {credit.name} {credit.lastname}
                    </h3>
                    <p className='text-sm text-gray-600 mt-1'>Doc: {credit.documentNumber}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusLabel.color}`}>
                    {statusLabel.text}
                  </span>
                </div>

                <div className='space-y-2'>
                  <div className='flex justify-between items-center'>
                    <span className='text-gray-700 font-semibold'>Monto:</span>
                    <span className='text-lg font-bold text-primary-color'>
                      ${credit.amount.toLocaleString('es-CO')}
                    </span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-gray-700 font-semibold'>Fecha Radicación:</span>
                    <span className='text-gray-600'>
                      {new Date(credit.radicationDate || credit.created).toLocaleDateString('es-CO')}
                    </span>
                  </div>
                </div>

                <button className='mt-4 w-full bg-gradient-to-r from-primary-color to-accent-color text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all'>
                  Ver Trazabilidad →
                </button>
              </div>
            )
          })}
        </div>
      ) : (
        <div className='bg-white rounded-lg shadow-md p-12 text-center'>
          <p className='text-gray-600 text-lg mb-2'>No hay créditos radicados aún</p>
          <p className='text-gray-500'>Los créditos completados aparecerán aquí una vez radicados</p>
        </div>
      )}
    </div>
  )
}

export default RadicadosModule

