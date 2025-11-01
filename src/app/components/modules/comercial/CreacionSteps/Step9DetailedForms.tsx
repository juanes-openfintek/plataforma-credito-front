'use client'
import React, { useState } from 'react'
import { CreacionFormData } from '../CreacionModule/CreacionModule'

interface Props {
  formData: CreacionFormData
  onNext: (data: Partial<CreacionFormData>) => void
}

const Step9DetailedForms = ({ formData, onNext }: Props) => {
  const [activeTab, setActiveTab] = useState('basica')
  const [error, setError] = useState('')

  // State for each section
  const [basicInfo, setBasicInfo] = useState({
    idIssuancePlace: '',
    idIssuanceDate: '',
    birthPlace: '',
    birthCountry: 'Colombia',
    education: '',
    maritalStatus: '',
    dependents: 0,
  })

  const [laborInfo, setLaborInfo] = useState({
    company: '',
    position: '',
    sector: '',
    experience: '',
    contractType: '',
  })

  const [financialDetail, setFinancialDetail] = useState({
    savingsAccounts: 0,
    otherIncome: 0,
    currentDebts: 0,
    monthlyObligations: 0,
  })

  const tabs = [
    { id: 'basica', label: 'Información Básica', icon: '👤' },
    { id: 'laboral', label: 'Información Laboral', icon: '💼' },
    { id: 'financiera', label: 'Información Financiera', icon: '💰' },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all sections
    if (!basicInfo.idIssuancePlace || !basicInfo.idIssuanceDate || !basicInfo.education || !basicInfo.maritalStatus) {
      setError('Por favor completa la Información Básica')
      return
    }

    if (!laborInfo.company || !laborInfo.position || !laborInfo.contractType) {
      setError('Por favor completa la Información Laboral')
      return
    }

    setError('')
    onNext({
      idIssuancePlace: basicInfo.idIssuancePlace,
      idIssuanceDate: basicInfo.idIssuanceDate,
      birthPlace: basicInfo.birthPlace,
      education: basicInfo.education,
      maritalStatus: basicInfo.maritalStatus,
      laborInfo,
      financialInfo: financialDetail,
    })
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div>
        <h3 className='text-2xl font-bold text-gray-800 mb-2'>Formularios Detallados</h3>
        <p className='text-gray-600 mb-6'>Completa la información en cada sección</p>
      </div>

      {error && (
        <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg'>
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className='flex gap-2 border-b border-gray-200 overflow-x-auto pb-4'>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type='button'
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 whitespace-nowrap font-semibold transition-all ${
              activeTab === tab.id
                ? 'border-b-2 border-primary-color text-primary-color'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className='space-y-4'>
        {/* Información Básica */}
        {activeTab === 'basica' && (
          <div className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Lugar de Expedición de Cédula
                </label>
                <input
                  type='text'
                  value={basicInfo.idIssuancePlace}
                  onChange={(e) => setBasicInfo({ ...basicInfo, idIssuancePlace: e.target.value })}
                  placeholder='Ej: Bogotá'
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
                />
              </div>

              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Fecha de Expedición
                </label>
                <input
                  type='date'
                  value={basicInfo.idIssuanceDate}
                  onChange={(e) => setBasicInfo({ ...basicInfo, idIssuanceDate: e.target.value })}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
                />
              </div>

              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Lugar de Nacimiento
                </label>
                <input
                  type='text'
                  value={basicInfo.birthPlace}
                  onChange={(e) => setBasicInfo({ ...basicInfo, birthPlace: e.target.value })}
                  placeholder='Ej: Cali'
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
                />
              </div>

              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Nacionalidad
                </label>
                <input
                  type='text'
                  value={basicInfo.birthCountry}
                  onChange={(e) => setBasicInfo({ ...basicInfo, birthCountry: e.target.value })}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
                />
              </div>

              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Nivel Educativo
                </label>
                <select
                  value={basicInfo.education}
                  onChange={(e) => setBasicInfo({ ...basicInfo, education: e.target.value })}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
                >
                  <option value=''>-- Selecciona una opción --</option>
                  <option value='primaria'>Primaria</option>
                  <option value='secundaria'>Secundaria</option>
                  <option value='tecnico'>Técnico</option>
                  <option value='profesional'>Profesional</option>
                  <option value='postgrado'>Postgrado</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Estado Civil
                </label>
                <select
                  value={basicInfo.maritalStatus}
                  onChange={(e) => setBasicInfo({ ...basicInfo, maritalStatus: e.target.value })}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
                >
                  <option value=''>-- Selecciona una opción --</option>
                  <option value='soltero'>Soltero(a)</option>
                  <option value='casado'>Casado(a)</option>
                  <option value='divorciado'>Divorciado(a)</option>
                  <option value='viudo'>Viudo(a)</option>
                  <option value='union-libre'>Unión Libre</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Información Laboral */}
        {activeTab === 'laboral' && (
          <div className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>Empresa</label>
                <input
                  type='text'
                  value={laborInfo.company}
                  onChange={(e) => setLaborInfo({ ...laborInfo, company: e.target.value })}
                  placeholder='Nombre de la empresa'
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
                />
              </div>

              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>Cargo/Posición</label>
                <input
                  type='text'
                  value={laborInfo.position}
                  onChange={(e) => setLaborInfo({ ...laborInfo, position: e.target.value })}
                  placeholder='Ej: Gerente, Analista'
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
                />
              </div>

              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>Sector</label>
                <input
                  type='text'
                  value={laborInfo.sector}
                  onChange={(e) => setLaborInfo({ ...laborInfo, sector: e.target.value })}
                  placeholder='Ej: Financiero, Tecnología'
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
                />
              </div>

              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>Experiencia (años)</label>
                <input
                  type='number'
                  value={laborInfo.experience}
                  onChange={(e) => setLaborInfo({ ...laborInfo, experience: e.target.value })}
                  placeholder='5'
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
                />
              </div>

              <div className='md:col-span-2'>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>Tipo de Contrato</label>
                <select
                  value={laborInfo.contractType}
                  onChange={(e) => setLaborInfo({ ...laborInfo, contractType: e.target.value })}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
                >
                  <option value=''>-- Selecciona una opción --</option>
                  <option value='indefinido'>Indefinido</option>
                  <option value='fijo'>Fijo</option>
                  <option value='temporal'>Temporal</option>
                  <option value='practicas'>Prácticas</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Información Financiera */}
        {activeTab === 'financiera' && (
          <div className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Ahorros / Cuentas (COP)
                </label>
                <input
                  type='number'
                  value={financialDetail.savingsAccounts}
                  onChange={(e) => setFinancialDetail({ ...financialDetail, savingsAccounts: parseFloat(e.target.value) || 0 })}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
                />
              </div>

              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Otros Ingresos (COP)
                </label>
                <input
                  type='number'
                  value={financialDetail.otherIncome}
                  onChange={(e) => setFinancialDetail({ ...financialDetail, otherIncome: parseFloat(e.target.value) || 0 })}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
                />
              </div>

              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Deudas Actuales (COP)
                </label>
                <input
                  type='number'
                  value={financialDetail.currentDebts}
                  onChange={(e) => setFinancialDetail({ ...financialDetail, currentDebts: parseFloat(e.target.value) || 0 })}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
                />
              </div>

              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Obligaciones Mensuales (COP)
                </label>
                <input
                  type='number'
                  value={financialDetail.monthlyObligations}
                  onChange={(e) => setFinancialDetail({ ...financialDetail, monthlyObligations: parseFloat(e.target.value) || 0 })}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className='flex gap-4 pt-4 sticky bottom-0 bg-white py-4 border-t border-gray-200'>
        <button
          type='submit'
          className='flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all duration-300'
        >
          Finalizar Creación ✓
        </button>
      </div>
    </form>
  )
}

export default Step9DetailedForms
