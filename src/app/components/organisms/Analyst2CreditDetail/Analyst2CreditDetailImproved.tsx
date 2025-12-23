'use client'
import { useState, useEffect } from 'react'
import { CreditData } from '../../../interfaces/creditData.interface'
import { processCredit, updateCreditData } from '../../../services/analyst2.service'
import TagStatus from '../../atoms/TagStatus/TagStatus'
import { CreditStatusesProperties } from '../../../constants/CreditStatusesProperties'
import CreditTimeline from '../../molecules/CreditTimeline/CreditTimeline'

interface Props {
  credit: CreditData
  onBack: () => void
  onRefresh: () => void
}

const Analyst2CreditDetailImproved = ({ credit, onBack, onRefresh }: Props) => {
  const [loading, setLoading] = useState(false)
  const [action, setAction] = useState<'approve' | 'reject' | 'return' | null>(null)
  const [notes, setNotes] = useState('')
  const [reason, setReason] = useState('')
  const [returnTarget, setReturnTarget] = useState<'previous' | 'commercial'>('previous')
  const [activeTab, setActiveTab] = useState<'summary' | 'references' | 'employment' | 'insurability' | 'portfolio' | 'history'>('summary')
  const [checklistSaving, setChecklistSaving] = useState(false)
  const [checklistError, setChecklistError] = useState<string | null>(null)
  const [analyst2Checklist, setAnalyst2Checklist] = useState({
    references: !!credit.analyst2Checklist?.references,
    insurabilityPolicies: !!credit.analyst2Checklist?.insurabilityPolicies,
    portfolioPurchase: !!credit.analyst2Checklist?.portfolioPurchase,
    employmentOrPensionVerification: !!credit.analyst2Checklist?.employmentOrPensionVerification,
  })
  
  // Referencias Personales
  const [personalRef, setPersonalRef] = useState({
    name: credit.nameReferencePersonal || '',
    relationship: credit.parentescoReferencePersonal || '',
    phone: credit.phoneNumberReferencePersonal || '',
    department: credit.departamentReferencePersonal || '',
    municipality: credit.municipalityReferencePersonal || '',
    verified: false,
    verificationNotes: '',
    contactAttempts: 0,
    contactDate: '',
  })

  // Por defecto mostrar pensión si no está definido personType
  const isPensioner = credit.personType !== 'empleado' // Si es 'pensionado' o undefined/null, mostrar pensión
  const employmentOrPensionLabel = isPensioner ? 'Verificación de pensión' : 'Verificación laboral'

  // Verificación Laboral / Pensión
  const [employmentVerification, setEmploymentVerification] = useState({
    companyConfirmed: false,
    positionConfirmed: false,
    incomeConfirmed: false,
    contractTypeConfirmed: false,
    employmentLetterReceived: false,
    hrContactName: '',
    hrContactPhone: '',
    verificationDate: '',
    verificationNotes: '',
  })

  const [pensionVerification, setPensionVerification] = useState({
    pensionType: credit.pensionType || '',
    pensionIssuer: credit.pensionIssuer || '',
    pensionStartDate: '',
    verificationNotes: '',
  })

  // Evaluación de Asegurabilidad
  const [insurability, setInsurability] = useState({
    hasPreexistingConditions: false,
    conditionsList: '',
    age: credit.dateOfBirth ? Math.max(0, Math.floor((Date.now() - new Date(credit.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 365.25))) : 0,
    hasDisability: false,
    disabilityDetail: '',
    insurabilityNotes: '',
  })

  const handleProcess = async () => {
    if (!action) return

    try {
      setLoading(true)
      await processCredit(credit._id, {
        action,
        notes: notes || undefined,
        reason: reason || undefined,
        returnTo: action === 'return' ? returnTarget : undefined,
        references: action === 'approve' ? {
          personalReference: personalRef,
          employmentVerification: isPensioner ? pensionVerification : employmentVerification,
          insurability,
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

  const formatCurrency = (val: any) =>
    Number(val || 0).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })

  const ChecklistStep = ({
    checked,
    title,
    onToggle,
  }: {
    checked: boolean
    title: string
    onToggle: () => void
  }) => (
    <div className='bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between gap-4'>
      <div className='flex items-center gap-3'>
        <div className={`w-6 h-6 rounded-md border flex items-center justify-center ${checked ? 'bg-green-600 border-green-600' : 'bg-white border-gray-300'}`}>
          {checked && (
            <svg className='w-4 h-4 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={3} d='M5 13l4 4L19 7' />
            </svg>
          )}
        </div>
        <div>
          <p className='font-bold text-gray-900'>{title}</p>
          <p className='text-xs text-gray-500'>Marca este paso cuando termines esta sección</p>
        </div>
      </div>
      <button
        type='button'
        disabled={checklistSaving}
        onClick={onToggle}
        className={`px-4 py-2 rounded-lg font-semibold border transition ${
          checked ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
        } ${checklistSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {checklistSaving ? 'Guardando...' : checked ? 'Hecho' : 'Marcar'}
      </button>
    </div>
  )

  useEffect(() => {
    setAnalyst2Checklist({
      references: !!credit.analyst2Checklist?.references,
      insurabilityPolicies: !!credit.analyst2Checklist?.insurabilityPolicies,
      portfolioPurchase: !!credit.analyst2Checklist?.portfolioPurchase,
      employmentOrPensionVerification: !!credit.analyst2Checklist?.employmentOrPensionVerification,
    })
  }, [credit._id])

  const toggleChecklist = async (
    key: 'references' | 'insurabilityPolicies' | 'portfolioPurchase' | 'employmentOrPensionVerification',
  ) => {
    const prev = analyst2Checklist
    const next = { ...prev, [key]: !prev[key] }
    setAnalyst2Checklist(next)
    setChecklistError(null)
    try {
      setChecklistSaving(true)
      await updateCreditData(credit._id, { analyst2Checklist: next })
    } catch (e) {
      console.error(e)
      setChecklistError('No se pudo guardar el checklist. Intenta nuevamente.')
      setAnalyst2Checklist(prev)
    } finally {
      setChecklistSaving(false)
    }
  }

  const tabs = [
    { id: 'summary', label: 'Resumen', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )},
    { id: 'references', label: 'Referencias', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )},
    { id: 'employment', label: isPensioner ? 'Verificación Pensión' : 'Verificación Laboral', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )},
    { id: 'portfolio', label: 'Compras de cartera', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )},
    { id: 'insurability', label: 'Asegurabilidad', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )},
    { id: 'history', label: 'Historial', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )},
  ]

  return (
    <div className='text-primary-color'>
      <button onClick={onBack} className='mb-4 text-primary-color hover:underline flex items-center gap-2'>
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Volver a la lista
      </button>

      <div className='bg-white rounded-lg shadow-lg p-6'>
        {/* Header */}
        <div className='flex justify-between items-center mb-6 pb-6 border-b'>
          <div>
            <h1 className='text-3xl font-bold text-gray-800'>Análisis Cualitativo - Analista 2</h1>
            <p className='text-gray-600 mt-1'>{credit.name} {credit.lastname}</p>
            <p className='text-sm text-gray-500'>Radicado: {credit.radicationNumber || credit.code}</p>
          </div>
          <TagStatus text={statusProp?.text || credit.status} background={statusProp?.background} />
        </div>

        {/* Tabs */}
        <div className='flex gap-2 border-b border-gray-200 mb-6 overflow-x-auto'>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 whitespace-nowrap font-semibold transition-all ${
                activeTab === tab.id
                  ? 'border-b-2 border-primary-color text-primary-color'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className='min-h-[400px]'>
          {/* Resumen */}
          {activeTab === 'summary' && (
            <div className='space-y-6'>
              {checklistError && (
                <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg'>
                  {checklistError}
                </div>
              )}

              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='bg-blue-50 p-4 rounded-lg'>
                  <p className='text-sm text-blue-600 font-semibold'>Monto Solicitado</p>
                  <p className='text-2xl font-bold text-blue-800'>${formatCurrency(credit.amount)}</p>
                </div>
                <div className='bg-green-50 p-4 rounded-lg'>
                  <p className='text-sm text-green-600 font-semibold'>Ingresos Mensuales</p>
                  <p className='text-2xl font-bold text-green-800'>${formatCurrency(credit.monthlyIncome)}</p>
                </div>
                <div className='bg-purple-50 p-4 rounded-lg'>
                  <p className='text-sm text-purple-600 font-semibold'>Capacidad de Pago</p>
                  <p className='text-2xl font-bold text-purple-800'>
                    ${formatCurrency(Number(credit.monthlyIncome) - Number(credit.monthlyExpenses))}
                  </p>
                </div>
              </div>

              {/* Información del Cliente */}
              <div className='bg-gray-50 p-6 rounded-lg'>
                <h3 className='font-bold text-xl mb-4 flex items-center gap-2'>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Información del Cliente</span>
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <InfoRow label='Documento' value={`${credit.documentType} ${credit.documentNumber}`} />
                  <InfoRow label='Teléfono' value={credit.phoneNumber} />
                  <InfoRow label='Empresa' value={credit.nameCompany} />
                  <InfoRow label='Cargo' value={credit.positionCompany} />
                  <InfoRow label='Tipo de Contrato' value={credit.typeContract} />
                  <InfoRow label='Gastos Mensuales' value={`$${formatCurrency(credit.monthlyExpenses)}`} />
                </div>
              </div>

              {/* Notas del Analista 1 */}
              {credit.analyst1Notes && (
                <div className='bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded'>
                  <h4 className='font-bold text-yellow-800 mb-2 flex items-center gap-2'>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Notas del Analista 1</span>
                  </h4>
                  <p className='text-yellow-800'>{credit.analyst1Notes}</p>
                </div>
              )}
            </div>
          )}

          {/* Referencias */}
          {activeTab === 'references' && (
            <div className='space-y-6'>
              <ChecklistStep
                checked={analyst2Checklist.references}
                title='Paso: Validación de referencias'
                onToggle={() => toggleChecklist('references')}
              />
              <div className='bg-white border border-gray-200 rounded-lg p-6'>
                <h3 className='font-bold text-xl mb-4 flex items-center gap-2'>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Referencia Personal</span>
                </h3>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                  <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-2'>Nombre Completo</label>
                    <input
                      type='text'
                      value={personalRef.name}
                      onChange={(e) => setPersonalRef({ ...personalRef, name: e.target.value })}
                      className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-color'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-2'>Parentesco</label>
                    <input
                      type='text'
                      value={personalRef.relationship}
                      onChange={(e) => setPersonalRef({ ...personalRef, relationship: e.target.value })}
                      className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-color'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-2'>Teléfono</label>
                    <input
                      type='text'
                      value={personalRef.phone}
                      onChange={(e) => setPersonalRef({ ...personalRef, phone: e.target.value })}
                      className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-color'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-2'>Departamento</label>
                    <input
                      type='text'
                      value={personalRef.department}
                      onChange={(e) => setPersonalRef({ ...personalRef, department: e.target.value })}
                      className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-color'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-2'>Municipio</label>
                    <input
                      type='text'
                      value={personalRef.municipality}
                      onChange={(e) => setPersonalRef({ ...personalRef, municipality: e.target.value })}
                      className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-color'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-2'>Fecha de Contacto</label>
                    <input
                      type='date'
                      value={personalRef.contactDate}
                      onChange={(e) => setPersonalRef({ ...personalRef, contactDate: e.target.value })}
                      className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-color'
                    />
                  </div>
                </div>

                <div className='mb-4'>
                  <label className='flex items-center gap-2'>
                    <input
                      type='checkbox'
                      checked={personalRef.verified}
                      onChange={(e) => setPersonalRef({ ...personalRef, verified: e.target.checked })}
                      className='w-4 h-4'
                    />
                    <span className='font-semibold'>Referencia Verificada</span>
                  </label>
                </div>

                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>Notas de Verificación</label>
                  <textarea
                    value={personalRef.verificationNotes}
                    onChange={(e) => setPersonalRef({ ...personalRef, verificationNotes: e.target.value })}
                    rows={4}
                    className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-color'
                    placeholder='Describe el resultado de la verificación de referencia...'
                  />
                </div>
              </div>
            </div>
          )}

          {/* Verificación Laboral / Pensión */}
          {activeTab === 'employment' && (
            <div className='space-y-6'>
              <ChecklistStep
                checked={analyst2Checklist.employmentOrPensionVerification}
                title={`Paso: ${employmentOrPensionLabel}`}
                onToggle={() => toggleChecklist('employmentOrPensionVerification')}
              />
              {!isPensioner && (
                <div className='bg-white border border-gray-200 rounded-lg p-6'>
                  <h3 className='font-bold text-xl mb-4 flex items-center gap-2'>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>Verificación de Empleo</span>
                  </h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
                    <div className='space-y-3'>
                      <label className='flex items-center gap-2'>
                        <input
                          type='checkbox'
                          checked={employmentVerification.companyConfirmed}
                          onChange={(e) => setEmploymentVerification({ ...employmentVerification, companyConfirmed: e.target.checked })}
                          className='w-4 h-4'
                        />
                        <span>Empresa Confirmada</span>
                      </label>
                      <label className='flex items-center gap-2'>
                        <input
                          type='checkbox'
                          checked={employmentVerification.positionConfirmed}
                          onChange={(e) => setEmploymentVerification({ ...employmentVerification, positionConfirmed: e.target.checked })}
                          className='w-4 h-4'
                        />
                        <span>Cargo Confirmado</span>
                      </label>
                      <label className='flex items-center gap-2'>
                        <input
                          type='checkbox'
                          checked={employmentVerification.incomeConfirmed}
                          onChange={(e) => setEmploymentVerification({ ...employmentVerification, incomeConfirmed: e.target.checked })}
                          className='w-4 h-4'
                        />
                        <span>Ingresos Confirmados</span>
                      </label>
                    </div>
                    <div className='space-y-3'>
                      <label className='flex items-center gap-2'>
                        <input
                          type='checkbox'
                          checked={employmentVerification.contractTypeConfirmed}
                          onChange={(e) => setEmploymentVerification({ ...employmentVerification, contractTypeConfirmed: e.target.checked })}
                          className='w-4 h-4'
                        />
                        <span>Tipo de Contrato Confirmado</span>
                      </label>
                      <label className='flex items-center gap-2'>
                        <input
                          type='checkbox'
                          checked={employmentVerification.employmentLetterReceived}
                          onChange={(e) => setEmploymentVerification({ ...employmentVerification, employmentLetterReceived: e.target.checked })}
                          className='w-4 h-4'
                        />
                        <span>Carta Laboral Recibida</span>
                      </label>
                    </div>
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                    <div>
                      <label className='block text-sm font-semibold text-gray-700 mb-2'>Contacto RRHH - Nombre</label>
                      <input
                        type='text'
                        value={employmentVerification.hrContactName}
                        onChange={(e) => setEmploymentVerification({ ...employmentVerification, hrContactName: e.target.value })}
                        className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-color'
                        placeholder='Nombre del contacto en RRHH'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-semibold text-gray-700 mb-2'>Contacto RRHH - Teléfono</label>
                      <input
                        type='text'
                        value={employmentVerification.hrContactPhone}
                        onChange={(e) => setEmploymentVerification({ ...employmentVerification, hrContactPhone: e.target.value })}
                        className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-color'
                        placeholder='Teléfono del contacto'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-semibold text-gray-700 mb-2'>Fecha de Verificación</label>
                      <input
                        type='date'
                        value={employmentVerification.verificationDate}
                        onChange={(e) => setEmploymentVerification({ ...employmentVerification, verificationDate: e.target.value })}
                        className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-color'
                      />
                    </div>
                  </div>
                  <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-2'>Notas de Verificación Laboral</label>
                    <textarea
                      value={employmentVerification.verificationNotes}
                      onChange={(e) => setEmploymentVerification({ ...employmentVerification, verificationNotes: e.target.value })}
                      rows={4}
                      className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-color'
                      placeholder='Describe el resultado de la verificación laboral...'
                    />
                  </div>
                </div>
              )}

              {isPensioner && (
                <div className='bg-white border border-gray-200 rounded-lg p-6 space-y-4'>
                  <h3 className='font-bold text-xl flex items-center gap-2 text-gray-900'>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Verificación de Pensión</span>
                  </h3>

                  {/* Información del Comercial */}
                  {(credit.pensionType || credit.pensionIssuer) && (
                    <div className='bg-blue-50 border-l-4 border-blue-400 p-4 rounded'>
                      <h4 className='font-semibold text-blue-900 mb-2'>Información registrada desde el comercial:</h4>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-3 text-sm'>
                        {credit.pensionType && (
                          <div>
                            <span className='font-medium text-blue-800'>Tipo de Pensión:</span>
                            <span className='ml-2 text-blue-700'>{credit.pensionType}</span>
                          </div>
                        )}
                        {credit.pensionIssuer && (
                          <div>
                            <span className='font-medium text-blue-800'>Entidad / Fondo:</span>
                            <span className='ml-2 text-blue-700'>{credit.pensionIssuer}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-semibold text-gray-700 mb-2'>Tipo de Pensión</label>
                      <input
                        type='text'
                        value={pensionVerification.pensionType}
                        onChange={(e) => setPensionVerification({ ...pensionVerification, pensionType: e.target.value })}
                        className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-color'
                        placeholder='Ej: vejez, sobreviviente...'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-semibold text-gray-700 mb-2'>Entidad / Fondo</label>
                      <input
                        type='text'
                        value={pensionVerification.pensionIssuer}
                        onChange={(e) => setPensionVerification({ ...pensionVerification, pensionIssuer: e.target.value })}
                        className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-color'
                        placeholder='Colpensiones, Protección, etc.'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-semibold text-gray-700 mb-2'>Fecha de inicio de pensión</label>
                      <input
                        type='date'
                        value={pensionVerification.pensionStartDate}
                        onChange={(e) => setPensionVerification({ ...pensionVerification, pensionStartDate: e.target.value })}
                        className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-color'
                      />
                    </div>
                  </div>
                  <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-2'>Notas de verificación de pensión</label>
                    <textarea
                      value={pensionVerification.verificationNotes}
                      onChange={(e) => setPensionVerification({ ...pensionVerification, verificationNotes: e.target.value })}
                      rows={4}
                      className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-color'
                      placeholder='Describe la validación de documentos de pensión, fechas y consistencia de ingresos...'
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Asegurabilidad */}
          {activeTab === 'insurability' && (
            <div className='space-y-6'>
              <ChecklistStep
                checked={analyst2Checklist.insurabilityPolicies}
                title='Paso: Políticas de asegurabilidad'
                onToggle={() => toggleChecklist('insurabilityPolicies')}
              />
              <div className='bg-white border border-gray-200 rounded-lg p-6 space-y-4'>
                <h3 className='font-bold text-xl mb-2 flex items-center gap-2'>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>Asegurabilidad</span>
                </h3>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <div>
                    <p className='text-sm text-gray-500'>Edad</p>
                    <p className='text-2xl font-bold text-gray-900'>{insurability.age} años</p>
                  </div>
                  <div className='md:col-span-2 space-y-3'>
                    <label className='flex items-start gap-2'>
                      <input
                        type='checkbox'
                        checked={insurability.hasPreexistingConditions}
                        onChange={(e) => setInsurability({ ...insurability, hasPreexistingConditions: e.target.checked })}
                        className='w-4 h-4 mt-1'
                      />
                      <span>¿Tiene condiciones preexistentes?</span>
                    </label>
                    {insurability.hasPreexistingConditions && (
                      <textarea
                        value={insurability.conditionsList}
                        onChange={(e) => setInsurability({ ...insurability, conditionsList: e.target.value })}
                        rows={3}
                        className='w-full px-4 py-2 border rounded-lg'
                        placeholder='Detalle las condiciones preexistentes...'
                      />
                    )}
                  </div>
                </div>

                <div className='space-y-3'>
                  <label className='flex items-start gap-2'>
                    <input
                      type='checkbox'
                      checked={insurability.hasDisability}
                      onChange={(e) => setInsurability({ ...insurability, hasDisability: e.target.checked })}
                      className='w-4 h-4 mt-1'
                    />
                    <span>¿Sufre de alguna incapacidad?</span>
                  </label>
                  {insurability.hasDisability && (
                    <textarea
                      value={insurability.disabilityDetail}
                      onChange={(e) => setInsurability({ ...insurability, disabilityDetail: e.target.value })}
                      rows={3}
                      className='w-full px-4 py-2 border rounded-lg'
                      placeholder='Detalle la incapacidad declarada...'
                    />
                  )}
                </div>

                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>Notas</label>
                  <textarea
                    value={insurability.insurabilityNotes}
                    onChange={(e) => setInsurability({ ...insurability, insurabilityNotes: e.target.value })}
                    rows={4}
                    className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-color'
                    placeholder='Notas adicionales sobre asegurabilidad...'
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'portfolio' && (
            <div className='space-y-4'>
              <ChecklistStep
                checked={analyst2Checklist.portfolioPurchase}
                title='Paso: Compra de cartera'
                onToggle={() => toggleChecklist('portfolioPurchase')}
              />
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
            <div className='space-y-6'>
              <div className='bg-gray-50 p-6 rounded-lg'>
                <h3 className='font-bold text-xl mb-4'>Línea de Tiempo del Crédito</h3>
                <CreditTimeline steps={[
                  {
                    title: 'Radicación',
                    date: credit.radicationDate || credit.created,
                    description: `Crédito radicado desde ${credit.radicationSource || 'WEB'}`,
                    status: 'completed',
                  },
                  {
                    title: 'Analista 1',
                    date: credit.analyst1ReviewDate || '',
                    description: credit.analyst1Notes || 'Pendiente',
                    status: credit.analyst1Id ? 'completed' : 'pending',
                  },
                  {
                    title: 'Analista 2',
                    date: new Date().toISOString(),
                    description: 'En revisión actual',
                    status: 'active',
                  },
                  {
                    title: 'Analista 3',
                    description: 'Pendiente',
                    status: 'pending',
                  },
                  {
                    title: 'Firma',
                    description: 'Pendiente',
                    status: 'pending',
                  },
                  {
                    title: 'Desembolso',
                    description: 'Pendiente',
                    status: 'pending',
                  },
                ]} />
              </div>
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className='border-t pt-6 mt-6'>
          <h3 className='font-semibold text-lg mb-4'>Decisión del Analista</h3>

          {!action && (
            <div className='flex gap-4'>
              <button
                onClick={() => setAction('approve')}
                className='flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2'
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Aprobar
              </button>
              <button
                onClick={() => setAction('return')}
                className='flex-1 bg-gradient-to-r from-orange-400 to-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2'
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                Devolver a Analista 1
              </button>
              <button
                onClick={() => setAction('reject')}
                className='flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2'
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
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
                  placeholder='Agrega tus observaciones...'
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
                    placeholder='Explica el motivo de la devolución o rechazo...'
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
                  className='flex-1 bg-primary-color text-white py-3 px-6 rounded-lg font-semibold disabled:opacity-50 hover:shadow-lg transition-all'
                >
                  {loading ? 'Procesando...' : 'Confirmar Decisión'}
                </button>
                <button
                  onClick={() => {
                    setAction(null)
                    setNotes('')
                    setReason('')
                    setReturnTarget('previous')
                  }}
                  className='flex-1 bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all'
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

// Helper Component
const InfoRow = ({ label, value }: { label: string; value: string | number }) => (
  <div className='flex justify-between border-b pb-2'>
    <span className='text-gray-600 text-sm'>{label}:</span>
    <span className='font-semibold text-sm'>{value}</span>
  </div>
)

export default Analyst2CreditDetailImproved

