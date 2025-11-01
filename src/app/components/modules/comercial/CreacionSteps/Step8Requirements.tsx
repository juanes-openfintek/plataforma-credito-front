'use client'
import React, { useState } from 'react'
import { CreacionFormData } from '../CreacionModule/CreacionModule'

interface Props {
  formData: CreacionFormData
  onNext: (data: Partial<CreacionFormData>) => void
}

const Step8Requirements = ({ formData, onNext }: Props) => {
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File | null }>({
    cedula: null,
    certificadoIngresos: null,
    libreta: null,
    ultimosRecibos: null,
  })
  const [error, setError] = useState('')

  const requirements = [
    {
      key: 'cedula',
      label: 'Cédula de Ciudadanía (Ambos Lados)',
      description: 'Documento de identidad en formato PDF',
      required: true,
    },
    {
      key: 'certificadoIngresos',
      label: 'Certificado de Ingresos / Certificado Laboral',
      description: 'Expedido por la empresa o entidad pagadora en PDF',
      required: true,
    },
    {
      key: 'libreta',
      label: 'Libreta de Pensión o Nómina',
      description: 'Últimas 2 páginas en PDF',
      required: true,
    },
    {
      key: 'ultimosRecibos',
      label: 'Últimos 2 Recibos de Pago',
      description: 'Comprobantes de ingreso en PDF',
      required: true,
    },
  ]

  const handleFileChange = (key: string, file: File | null) => {
    if (file && file.type !== 'application/pdf') {
      setError(`El archivo debe ser PDF. Archivo seleccionado: ${file.type}`)
      return
    }

    if (file && file.size > 5 * 1024 * 1024) {
      setError('El archivo no puede pesar más de 5 MB')
      return
    }

    setError('')
    setUploadedFiles((prev) => ({
      ...prev,
      [key]: file,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const missingFiles = requirements
      .filter((req) => req.required && !uploadedFiles[req.key])
      .map((req) => req.label)

    if (missingFiles.length > 0) {
      setError(`Faltan documentos requeridos: ${missingFiles.join(', ')}`)
      return
    }

    setError('')
    onNext({
      requirements: Object.values(uploadedFiles).filter((f) => f !== null) as File[],
    })
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div>
        <h3 className='text-2xl font-bold text-gray-800 mb-4'>Documentos Requeridos</h3>
        <p className='text-gray-600 mb-6'>Adjunta los documentos en formato PDF (máximo 5 MB cada uno)</p>
      </div>

      {error && (
        <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg'>
          {error}
        </div>
      )}

      {/* Documents Upload List */}
      <div className='space-y-4'>
        {requirements.map((req) => (
          <div key={req.key} className='border-2 border-gray-200 rounded-lg p-4 hover:border-primary-color transition-colors'>
            <div className='flex items-start justify-between'>
              <div className='flex-1'>
                <div className='flex items-center gap-2 mb-1'>
                  <h4 className='font-semibold text-gray-800'>{req.label}</h4>
                  {req.required && <span className='text-red-500 font-bold'>*</span>}
                </div>
                <p className='text-sm text-gray-600 mb-3'>{req.description}</p>

                {uploadedFiles[req.key] ? (
                  <div className='flex items-center gap-2 bg-green-50 border border-green-200 rounded p-3'>
                    <span className='text-green-600 text-xl'>✓</span>
                    <div className='flex-1'>
                      <p className='text-sm font-semibold text-green-800'>{uploadedFiles[req.key]?.name}</p>
                      <p className='text-xs text-green-600'>
                        {(uploadedFiles[req.key]!.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <button
                      type='button'
                      onClick={() => handleFileChange(req.key, null)}
                      className='text-red-500 hover:text-red-700 font-bold'
                    >
                      Cambiar
                    </button>
                  </div>
                ) : (
                  <label className='flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-primary-color hover:bg-blue-50 cursor-pointer transition-all'>
                    <span className='text-2xl'>📄</span>
                    <div className='text-center'>
                      <p className='font-semibold text-gray-700'>Click para cargar PDF</p>
                      <p className='text-sm text-gray-600'>o arrastra el archivo aquí</p>
                    </div>
                    <input
                      type='file'
                      accept='.pdf'
                      onChange={(e) => handleFileChange(req.key, e.target.files?.[0] || null)}
                      className='hidden'
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Progress */}
      {Object.values(uploadedFiles).filter((f) => f !== null).length > 0 && (
        <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
          <h4 className='font-semibold text-green-900 mb-2'>Documentos cargados</h4>
          <p className='text-sm text-green-800'>
            {Object.values(uploadedFiles).filter((f) => f !== null).length} de {requirements.length} documentos
          </p>
          <div className='w-full bg-green-200 rounded-full h-2 mt-2'>
            <div
              className='bg-green-500 h-2 rounded-full transition-all'
              style={{
                width: `${(Object.values(uploadedFiles).filter((f) => f !== null).length / requirements.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      )}

      {/* Info */}
      <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
        <h4 className='font-semibold text-blue-900 mb-2'>Instrucciones importantes</h4>
        <ul className='text-sm text-blue-800 space-y-1 list-disc list-inside'>
          <li>Solo se aceptan archivos en formato PDF</li>
          <li>Tamaño máximo por archivo: 5 MB</li>
          <li>Asegúrate que los documentos sean claros y legibles</li>
          <li>Los documentos de identidad deben incluir ambos lados</li>
          <li>Todos los campos son obligatorios</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className='flex gap-4 pt-4'>
        <button
          type='submit'
          className='flex-1 bg-gradient-to-r from-primary-color to-accent-color text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all duration-300'
        >
          Continuar →
        </button>
      </div>
    </form>
  )
}

export default Step8Requirements
