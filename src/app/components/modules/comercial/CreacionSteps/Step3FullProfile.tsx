'use client'
import React, { useState } from 'react'
import { CreacionFormData } from '../CreacionModule/CreacionModule'
import { colombianBanks } from '../../../../constants/colombianBanks'

interface Props {
  formData: CreacionFormData
  onNext: (data: Partial<CreacionFormData>) => void
}

const Step3FullProfile = ({ formData, onNext }: Props) => {
  // Tipo de persona viene del paso de identificación (ya seleccionado)
  const personType = formData.personType || 'pensionado'
  
  // Datos de pensión (solo para pensionados)
  const [pensionIssuer, setPensionIssuer] = useState(formData.pensionIssuer || '')
  
  // Datos laborales (solo para empleados)
  const [laborInfo, setLaborInfo] = useState(
    formData.laborInfo || { company: '', position: '', admissionDate: '', contractType: '', salary: '' }
  )
  
  // Datos básicos
  const [firstName, setFirstName] = useState(formData.firstName || '')
  const [lastName, setLastName] = useState(formData.lastName || '')
  const [birthDate, setBirthDate] = useState(formData.birthDate || '')
  const [email, setEmail] = useState(formData.email || '')
  const [gender, setGender] = useState(formData.gender || '')
  const [idIssuancePlace, setIdIssuancePlace] = useState(formData.idIssuancePlace || '')
  const [idIssuanceDate, setIdIssuanceDate] = useState(formData.idIssuanceDate || '')
  const [birthPlace, setBirthPlace] = useState(formData.birthPlace || '')
  const [birthCountry, setBirthCountry] = useState(formData.birthCountry || 'Colombia')
  const [financialDetails, setFinancialDetails] = useState(
    formData.financialDetails || { accountNumber: '', accountType: '', bank: '' },
  )
  const [error, setError] = useState('')

  const pensionIssuers = [
    { value: 'colpensiones', label: 'Colpensiones' },
    { value: 'proteccion', label: 'Protección' },
    { value: 'colfondos', label: 'Colfondos' },
    { value: 'porvenir', label: 'Porvenir' },
    { value: 'skandia', label: 'Skandia' },
    { value: 'otro', label: 'Otra administradora' },
  ]

  const contractTypes = [
    { value: 'indefinido', label: 'Término indefinido' },
    { value: 'fijo', label: 'Término fijo' },
    { value: 'obra-labor', label: 'Obra o labor' },
    { value: 'prestacion-servicios', label: 'Prestación de servicios' },
  ]

  // Ordenar bancos poniendo los más populares primero
  const popularBankCodes = ['007', '051', '001', '013', '023', '019', '052', '032', '507', '551']
  const sortedBanks = [...colombianBanks].sort((a, b) => {
    const aIndex = popularBankCodes.indexOf(a.code)
    const bIndex = popularBankCodes.indexOf(b.code)
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
    if (aIndex !== -1) return -1
    if (bIndex !== -1) return 1
    return a.name.localeCompare(b.name)
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validaciones según tipo de persona
    if (personType === 'pensionado' && !pensionIssuer) {
      setError('Selecciona la administradora de pensión.')
      return
    }
    
    if (personType === 'empleado' && (!laborInfo.company || !laborInfo.position)) {
      setError('Completa la información laboral (empresa y cargo son requeridos).')
      return
    }
    
    if (!firstName.trim() || !lastName.trim() || !birthDate || !email.trim()) {
      setError('Completa nombres, apellidos, fecha de nacimiento y correo.')
      return
    }
    
    setError('')
    
    onNext({
      pensionIssuer: personType === 'pensionado' ? pensionIssuer : undefined,
      laborInfo: personType === 'empleado' ? laborInfo : undefined,
      firstName,
      lastName,
      birthDate,
      email,
      gender,
      idIssuancePlace,
      idIssuanceDate,
      birthPlace,
      birthCountry,
      financialDetails,
      // Guardar el tipo de persona para usarlo en el simulador
      pensionType: personType === 'pensionado' ? 'pensionado' : undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-8'>
      <div>
        <h3 className='text-2xl font-bold text-gray-800 mb-2'>Perfil completo del cliente</h3>
        <p className='text-gray-600'>Completa la información del cliente.</p>
      </div>

      {error && (
        <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg'>
          {error}
        </div>
      )}

      {/* Indicador del tipo de cliente (solo lectura) */}
      <div className='bg-purple-50 border-2 border-purple-200 rounded-xl p-4'>
        <div className='flex items-center gap-4'>
          <div className='w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center'>
            {personType === 'pensionado' ? (
              <svg className='w-6 h-6 text-purple-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
              </svg>
            ) : (
              <svg className='w-6 h-6 text-purple-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
              </svg>
            )}
          </div>
          <div>
            <p className='text-sm text-purple-600 font-medium'>Tipo de cliente</p>
            <p className='text-lg font-bold text-purple-800'>
              {personType === 'pensionado' ? 'Pensionado' : 'Empleado'}
            </p>
          </div>
          <div className='ml-auto'>
            <span className='inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full'>
              <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
              </svg>
              Seleccionado en identificación
            </span>
          </div>
        </div>
      </div>

      {/* Sección condicional: Pensión o Laboral */}
      {personType === 'pensionado' ? (
        <section className='space-y-4 bg-green-50 border border-green-200 rounded-xl p-6'>
          <h4 className='text-xl font-semibold text-gray-800 flex items-center gap-2'>
            <svg className='w-5 h-5 text-green-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
            </svg>
            Datos de pensión
          </h4>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>Administradora de Pensión *</label>
              <select
                value={pensionIssuer}
                onChange={(e) => setPensionIssuer(e.target.value)}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color bg-white'
              >
                <option value=''>Selecciona una opción</option>
                {pensionIssuers.map((issuer) => (
                  <option key={issuer.value} value={issuer.value}>
                    {issuer.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>
      ) : (
        <section className='space-y-4 bg-blue-50 border border-blue-200 rounded-xl p-6'>
          <h4 className='text-xl font-semibold text-gray-800 flex items-center gap-2'>
            <svg className='w-5 h-5 text-blue-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
            </svg>
            Información laboral
          </h4>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>Empresa *</label>
              <input
                value={laborInfo.company}
                onChange={(e) => setLaborInfo({ ...laborInfo, company: e.target.value })}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color bg-white'
                placeholder='Nombre de la empresa'
              />
            </div>
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>Cargo *</label>
              <input
                value={laborInfo.position}
                onChange={(e) => setLaborInfo({ ...laborInfo, position: e.target.value })}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color bg-white'
                placeholder='Tu cargo actual'
              />
            </div>
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>Fecha de ingreso</label>
              <input
                type='date'
                value={laborInfo.admissionDate}
                onChange={(e) => setLaborInfo({ ...laborInfo, admissionDate: e.target.value })}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color bg-white'
              />
            </div>
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>Tipo de contrato</label>
              <select
                value={laborInfo.contractType}
                onChange={(e) => setLaborInfo({ ...laborInfo, contractType: e.target.value })}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color bg-white'
              >
                <option value=''>Selecciona tipo</option>
                {contractTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>
      )}

      <section className='space-y-4'>
        <h4 className='text-xl font-semibold text-gray-800'>Datos básicos</h4>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>Nombres *</label>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
              placeholder='Ej: Juan Carlos'
            />
          </div>
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>Apellidos *</label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
              placeholder='Ej: Pérez Gómez'
            />
          </div>
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>Fecha de nacimiento *</label>
            <input
              type='date'
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
            />
          </div>
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>Correo electrónico *</label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
              placeholder='cliente@correo.com'
            />
          </div>
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>Género</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
            >
              <option value=''>Selecciona</option>
              <option value='masculino'>Masculino</option>
              <option value='femenino'>Femenino</option>
              <option value='otro'>Otro</option>
            </select>
          </div>
        </div>
      </section>

      <section className='space-y-4'>
        <h4 className='text-xl font-semibold text-gray-800'>Información adicional</h4>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>Lugar de expedición del documento</label>
            <input
              value={idIssuancePlace}
              onChange={(e) => setIdIssuancePlace(e.target.value)}
              placeholder='Ej: Bogotá'
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
            />
          </div>
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>Fecha de expedición</label>
            <input
              type='date'
              value={idIssuanceDate}
              onChange={(e) => setIdIssuanceDate(e.target.value)}
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
            />
          </div>
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>Lugar de nacimiento</label>
            <input
              value={birthPlace}
              onChange={(e) => setBirthPlace(e.target.value)}
              placeholder='Ej: Medellín'
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
            />
          </div>
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>País de nacimiento</label>
            <input
              value={birthCountry}
              onChange={(e) => setBirthCountry(e.target.value)}
              placeholder='Colombia'
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
            />
          </div>
        </div>
      </section>

      <section className='space-y-4'>
        <h4 className='text-xl font-semibold text-gray-800'>Información bancaria</h4>
        <p className='text-sm text-gray-500'>Datos de la cuenta donde se realizará el desembolso</p>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>Banco</label>
            <select
              value={financialDetails.bank}
              onChange={(e) => setFinancialDetails({ ...financialDetails, bank: e.target.value })}
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
            >
              <option value=''>Selecciona un banco</option>
              <optgroup label='Bancos más utilizados'>
                {sortedBanks.slice(0, 10).map((bank) => (
                  <option key={bank.code} value={bank.name}>
                    {bank.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label='Otros bancos'>
                {sortedBanks.slice(10).map((bank) => (
                  <option key={bank.code} value={bank.name}>
                    {bank.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>Tipo de cuenta</label>
            <select
              value={financialDetails.accountType}
              onChange={(e) => setFinancialDetails({ ...financialDetails, accountType: e.target.value })}
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
            >
              <option value=''>Selecciona tipo</option>
              <option value='ahorros'>Ahorros</option>
              <option value='corriente'>Corriente</option>
            </select>
          </div>
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>Número de cuenta</label>
            <input
              value={financialDetails.accountNumber}
              onChange={(e) => setFinancialDetails({ ...financialDetails, accountNumber: e.target.value })}
              placeholder='Ej: 123456789012'
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
            />
          </div>
        </div>
      </section>

      <div className='flex justify-end'>
        <button
          type='submit'
          className='px-6 py-3 bg-gradient-to-r from-primary-color to-accent-color text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300'
        >
          Continuar →
        </button>
      </div>
    </form>
  )
}

export default Step3FullProfile
