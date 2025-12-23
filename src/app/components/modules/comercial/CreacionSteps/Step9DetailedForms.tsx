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
    admissionDate: '',
    contractType: '',
  })

  const [financialDetail, setFinancialDetail] = useState({
    accountNumber: '',
    accountType: '',
    bank: '',
  })

  const tabs = [
    { 
      id: 'basica', 
      label: 'Información Básica', 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    { 
      id: 'laboral', 
      label: 'Información Laboral', 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      id: 'financiera', 
      label: 'Información Financiera', 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
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
                <label className='block text-sm font-semibold text-gray-700 mb-2'>Fecha de Ingreso</label>
                <input
                  type='date'
                  value={laborInfo.admissionDate}
                  onChange={(e) => setLaborInfo({ ...laborInfo, admissionDate: e.target.value })}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
                />
              </div>

              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>Tipo de Contrato</label>
                <select
                  value={laborInfo.contractType}
                  onChange={(e) => setLaborInfo({ ...laborInfo, contractType: e.target.value })}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
                >
                  <option value=''>-- Selecciona una opción --</option>
                  <option value='carrera-administrativa'>Carrera Administrativa</option>
                  <option value='provisional-vacante-definitiva'>Provisional Vacante Definitiva</option>
                  <option value='provisionalidad'>Provisionalidad</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Información Financiera */}
        {activeTab === 'financiera' && (
          <div className='space-y-4'>
            {/* Información Bancaria */}
            <div>
              <h4 className='text-lg font-semibold text-gray-800 mb-4'>Información Bancaria</h4>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>Banco</label>
                  <select
                    value={financialDetail.bank}
                    onChange={(e) => setFinancialDetail({ ...financialDetail, bank: e.target.value })}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
                  >
                    <option value=''>-- Selecciona un banco --</option>
                    <option value='bancolombia'>Bancolombia</option>
                    <option value='banco-de-bogota'>Banco de Bogotá</option>
                    <option value='davivienda'>Davivienda</option>
                    <option value='bbva'>BBVA Colombia</option>
                    <option value='av-villas'>Banco AV Villas</option>
                    <option value='banco-popular'>Banco Popular</option>
                    <option value='itau'>Itaú</option>
                    <option value='occidente'>Banco de Occidente</option>
                    <option value='bancoomeva'>Bancoomeva</option>
                    <option value='colpatria'>Scotiabank Colpatria</option>
                    <option value='agrario'>Banco Agrario</option>
                    <option value='pichincha'>Banco Pichincha</option>
                    <option value='caja-social'>Banco Caja Social</option>
                    <option value='gnb-sudameris'>GNB Sudameris</option>
                    <option value='banco-cooperativo-coopcentral'>Banco Cooperativo Coopcentral</option>
                    <option value='banco-serfinanza'>Banco Serfinanza</option>
                    <option value='nequi'>Nequi</option>
                    <option value='daviplata'>Daviplata</option>
                    <option value='movii'>Movii</option>
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>Tipo de Cuenta</label>
                  <select
                    value={financialDetail.accountType}
                    onChange={(e) => setFinancialDetail({ ...financialDetail, accountType: e.target.value })}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
                  >
                    <option value=''>-- Selecciona tipo de cuenta --</option>
                    <option value='ahorros'>Ahorros</option>
                    <option value='corriente'>Corriente</option>
                  </select>
                </div>

                <div className='md:col-span-2'>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>Número de Cuenta</label>
                  <input
                    type='text'
                    value={financialDetail.accountNumber}
                    onChange={(e) => setFinancialDetail({ ...financialDetail, accountNumber: e.target.value })}
                    placeholder='Ej: 1234567890'
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
                  />
                </div>
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
