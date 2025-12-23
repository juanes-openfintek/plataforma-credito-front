'use client'
import React, { useState } from 'react'
import { CreacionFormData } from '../CreacionModule/CreacionModule'
import ClientDocumentReminder from '../../../atoms/ClientDocumentReminder/ClientDocumentReminder'
import { uploadMultipleFiles } from '../../../../services/uploadFile'

interface Props {
  formData: CreacionFormData
  onNext: (data: Partial<CreacionFormData>) => void
}

const Step1Identification = ({ formData, onNext }: Props) => {
  const [idType, setIdType] = useState(formData.identificationType || 'CC')
  const [idNumber, setIdNumber] = useState(formData.identificationNumber || '')
  const [phone, setPhone] = useState(formData.phone || '')
  const [personType, setPersonType] = useState<'pensionado' | 'empleado' | ''>(
    formData.personType || ''
  )
  const [files, setFiles] = useState<{ cedula: File | null; recibos: File | null }>({
    cedula: null,
    recibos: null,
  })
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!personType) {
      setError('Por favor selecciona si el cliente es pensionado o empleado')
      return
    }

    if (!idNumber.trim() || !phone.trim() || !files.cedula || !files.recibos) {
      setError('Por favor completa todos los campos y adjunta la cédula y los recibos en PDF')
      return
    }

    if (!/^\d{6,}$/.test(idNumber)) {
      setError('El número de identificación debe tener al menos 6 dígitos')
      return
    }

    if (!/^\d{10}$/.test(phone)) {
      setError('El teléfono debe tener exactamente 10 dígitos')
      return
    }

    for (const key of ['cedula', 'recibos'] as const) {
      const file = files[key]
      if (!file) continue
      if (file.type !== 'application/pdf') {
        setError('Adjunta los documentos en formato PDF')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Cada archivo debe pesar máximo 5MB')
        return
      }
    }

    setError('')
    setUploading(true)
    try {
      const payload = [
        { file: files.cedula!, documentType: 'cedula' },
        { file: files.recibos!, documentType: 'ultimosRecibos' },
      ]
      const uploaded = await uploadMultipleFiles(payload)
      onNext({
        identificationType: idType,
        identificationNumber: idNumber,
        phone: phone,
        personType: personType,
        documents: uploaded,
      })
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Error subiendo documentos. Intenta nuevamente.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div>
        <h3 className='text-2xl font-bold text-gray-800 mb-4'>Identificación del Cliente</h3>
        <p className='text-gray-600 mb-3'>
          Ingresa los datos de identificación del cliente que deseas crear
        </p>
        <ClientDocumentReminder className='mb-6' message='Adjunta la cédula en PDF y cruza siempre contra el documento físico.' />
      </div>

      {error && (
        <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg'>
          {error}
        </div>
      )}

      {/* Tipo de cliente: Pensionado o Empleado */}
      <div className='bg-purple-50 border-2 border-purple-200 rounded-xl p-6'>
        <label className='block text-lg font-bold text-gray-800 mb-4'>
          ¿El cliente es pensionado o empleado?
        </label>
        <div className='grid grid-cols-2 gap-4'>
          <button
            type='button'
            onClick={() => setPersonType('pensionado')}
            className={`p-6 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-3 ${
              personType === 'pensionado'
                ? 'border-purple-600 bg-purple-100 shadow-lg'
                : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50'
            }`}
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${personType === 'pensionado' ? 'bg-purple-200 scale-110' : 'bg-gray-100'} transition-transform`}>
              <svg className={`w-7 h-7 ${personType === 'pensionado' ? 'text-purple-600' : 'text-gray-500'}`} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
              </svg>
            </div>
            <span className={`font-semibold ${personType === 'pensionado' ? 'text-purple-700' : 'text-gray-700'}`}>
              Pensionado
            </span>
            <span className='text-xs text-gray-500'>Recibe pensión mensual</span>
          </button>
          <button
            type='button'
            onClick={() => setPersonType('empleado')}
            className={`p-6 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-3 ${
              personType === 'empleado'
                ? 'border-purple-600 bg-purple-100 shadow-lg'
                : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50'
            }`}
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${personType === 'empleado' ? 'bg-purple-200 scale-110' : 'bg-gray-100'} transition-transform`}>
              <svg className={`w-7 h-7 ${personType === 'empleado' ? 'text-purple-600' : 'text-gray-500'}`} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
              </svg>
            </div>
            <span className={`font-semibold ${personType === 'empleado' ? 'text-purple-700' : 'text-gray-700'}`}>
              Empleado
            </span>
            <span className='text-xs text-gray-500'>Trabaja activamente</span>
          </button>
        </div>
      </div>

      <div>
        <label className='block text-sm font-semibold text-gray-700 mb-2'>
          Tipo de Identificación
        </label>
        <select
          value={idType}
          onChange={(e) => setIdType(e.target.value)}
          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
        >
          <option value='CC'>Cédula de Ciudadanía (CC)</option>
          <option value='CE'>Cédula de Extranjería (CE)</option>
          <option value='PA'>Pasaporte</option>
          <option value='NIT'>NIT</option>
        </select>
      </div>

      <div>
        <label className='block text-sm font-semibold text-gray-700 mb-2'>
          Número de Identificación
        </label>
        <input
          type='text'
          value={idNumber}
          onChange={(e) => setIdNumber(e.target.value.replace(/\D/g, ''))}
          placeholder='Ej: 1234567890'
          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
        />
        <p className='text-gray-500 text-sm mt-1'>Solo números</p>
      </div>

      <div>
        <label className='block text-sm font-semibold text-gray-700 mb-2'>
          Teléfono (10 dígitos)
        </label>
        <div className='flex items-center'>
          <span className='text-gray-600 font-semibold mr-2'>+57</span>
          <input
            type='tel'
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
            placeholder='Ej: 3101234567'
            className='flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
          />
        </div>
        <p className='text-gray-500 text-sm mt-1'>Formato: 3XX XXX XXXX</p>
      </div>

      <div className='space-y-4'>
        {[
          {
            key: 'cedula' as const,
            title: 'Cédula de Ciudadanía (PDF)',
            description: 'Carga el documento (máx 5MB). Solo se acepta PDF.',
          },
          {
            key: 'recibos' as const,
            title: 'Desprendibles de pago (PDF)',
            description: 'Carga el documento (máx 5MB). Solo se acepta PDF.',
          },
        ].map((req) => (
          <div key={req.key} className='border-2 border-gray-200 rounded-lg p-4 hover:border-primary-color transition-colors'>
            <div className='flex items-start justify-between gap-3'>
              <div>
                <p className='font-semibold text-gray-800'>{req.title}</p>
                <p className='text-sm text-gray-600'>{req.description}</p>
              </div>
              {files[req.key] ? (
                <div className='text-right'>
                  <p className='text-sm font-semibold text-green-700'>{files[req.key]!.name}</p>
                  <p className='text-xs text-gray-500'>{(files[req.key]!.size / 1024).toFixed(2)} KB</p>
                  <button
                    type='button'
                    onClick={() => setFiles((prev) => ({ ...prev, [req.key]: null }))}
                    className='text-red-600 hover:text-red-800 text-sm font-semibold'
                  >
                    Cambiar
                  </button>
                </div>
              ) : (
                <label className='flex items-center gap-2 text-primary-color cursor-pointer'>
                  <span className='font-semibold'>Subir PDF</span>
                  <input
                    type='file'
                    accept='.pdf'
                    onChange={(e) => setFiles((prev) => ({ ...prev, [req.key]: e.target.files?.[0] || null }))}
                    className='hidden'
                  />
                </label>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6'>
        <h4 className='font-semibold text-blue-900 mb-2'>Resumen de datos</h4>
        <div className='space-y-1 text-sm text-blue-800'>
          <p>Tipo de cliente: {personType === 'pensionado' ? 'Pensionado' : personType === 'empleado' ? 'Empleado' : '---'}</p>
          <p>Tipo documento: {idType === 'CC' ? 'Cédula de Ciudadanía' : idType}</p>
          <p>Número: {idNumber || '---'}</p>
          <p>Teléfono: {phone ? `+57 ${phone}` : '---'}</p>
        </div>
      </div>

      <div className='flex gap-4 pt-4'>
        <button
          type='submit'
          disabled={uploading}
          className='flex-1 bg-gradient-to-r from-primary-color to-accent-color text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-60'
        >
          {uploading ? 'Cargando documentos...' : 'Continuar →'}
        </button>
      </div>
    </form>
  )
}

export default Step1Identification
