'use client'
import React, { useState, useEffect } from 'react'
import { CreacionFormData } from '../CreacionModule/CreacionModule'

interface Props {
  formData: CreacionFormData
  onNext: (data: Partial<CreacionFormData>) => void
}

const Step2OTP = ({ formData, onNext }: Props) => {
  const [otp, setOtp] = useState(formData.otp || '')
  const [showOtp, setShowOtp] = useState(false)
  const [generatedOtp, setGeneratedOtp] = useState('')
  const [error, setError] = useState('')
  const [resendCountdown, setResendCountdown] = useState(0)
  const [isVerified, setIsVerified] = useState(false)

  // Generate OTP on mount
  useEffect(() => {
    const newOtp = Math.floor(1000 + Math.random() * 9000).toString()
    setGeneratedOtp(newOtp)
    setShowOtp(true)
  }, [])

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCountdown])

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault()

    if (!otp.trim()) {
      setError('Por favor ingresa el código OTP')
      return
    }

    if (otp === generatedOtp) {
      setError('')
      setIsVerified(true)
      setTimeout(() => {
        onNext({ otp: otp })
      }, 500)
    } else {
      setError('Código OTP incorrecto. Intenta de nuevo.')
      setOtp('')
    }
  }

  const handleResendOtp = () => {
    const newOtp = Math.floor(1000 + Math.random() * 9000).toString()
    setGeneratedOtp(newOtp)
    setOtp('')
    setError('')
    setIsVerified(false)
    setResendCountdown(60)
  }

  return (
    <form onSubmit={handleVerifyOtp} className='space-y-6'>
      <div>
        <h3 className='text-2xl font-bold text-gray-800 mb-4'>Verificación de Código OTP</h3>
        <p className='text-gray-600 mb-6'>
          Se ha enviado un código de 4 dígitos al teléfono <strong>{formData.phone}</strong>
        </p>
      </div>

      {/* OTP Display (Platform Notification Style) */}
      <div className='bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-lg p-6 mb-6'>
        <div className='text-center'>
          <p className='text-sm text-gray-600 mb-3 font-semibold'>Código de Verificación</p>
          <div className='bg-white rounded-lg p-6 border-2 border-primary-color inline-block'>
            <p className='text-5xl font-bold tracking-widest text-primary-color' style={{ letterSpacing: '0.5rem' }}>
              {generatedOtp}
            </p>
          </div>
          <p className='text-xs text-gray-500 mt-3'>Válido por 10 minutos</p>
        </div>
      </div>

      {error && (
        <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg'>
          {error}
        </div>
      )}

      {isVerified && (
        <div className='bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2'>
          <span className='text-xl'>✓</span>
          <span>Código verificado correctamente. Continuando...</span>
        </div>
      )}

      {/* OTP Input */}
      <div>
        <label className='block text-sm font-semibold text-gray-700 mb-2'>
          Ingresa el código de 4 dígitos
        </label>
        <input
          type='text'
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
          placeholder='0000'
          maxLength={4}
          className='w-full px-4 py-4 text-center text-3xl tracking-widest border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color focus:border-transparent'
          disabled={isVerified}
        />
      </div>

      {/* Resend Button */}
      <div className='text-center'>
        <p className='text-sm text-gray-600 mb-3'>¿No recibiste el código?</p>
        <button
          type='button'
          onClick={handleResendOtp}
          disabled={resendCountdown > 0}
          className='text-primary-color font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {resendCountdown > 0 ? `Reintentar en ${resendCountdown}s` : 'Reenviar código'}
        </button>
      </div>

      {/* Info Box */}
      <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
        <h4 className='font-semibold text-yellow-900 mb-2'>Información de Verificación</h4>
        <ul className='text-sm text-yellow-800 space-y-1 list-disc list-inside'>
          <li>El código se envía como notificación en plataforma</li>
          <li>Válido por 10 minutos desde su generación</li>
          <li>Solo tienes 3 intentos antes de reintentar</li>
          <li>Este código es único para este cliente</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className='flex gap-4 pt-4'>
        <button
          type='submit'
          disabled={isVerified}
          className='flex-1 bg-gradient-to-r from-primary-color to-accent-color text-white font-semibold py-3 rounded-lg hover:shadow-lg disabled:opacity-50 transition-all duration-300'
        >
          {isVerified ? 'Verificado ✓' : 'Verificar Código'}
        </button>
      </div>
    </form>
  )
}

export default Step2OTP
