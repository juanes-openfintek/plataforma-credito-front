'use client'
import React, { useState, useEffect } from 'react'
import { CreacionFormData } from '../CreacionModule/CreacionModule'
import { generateOtp, verifyOtp } from '../../../../services/commercialOtp'

interface Props {
  formData: CreacionFormData
  onNext: (data: Partial<CreacionFormData>) => void
}

const Step2OTP = ({ formData, onNext }: Props) => {
  const [otp, setOtp] = useState(formData.otp || '')
  const [error, setError] = useState('')
  const [resendCountdown, setResendCountdown] = useState(0)
  const [isVerified, setIsVerified] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [otpSent, setOtpSent] = useState(false)

  // No generar automáticamente, esperar a que el usuario lo solicite

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCountdown])

  const handleGenerateOtp = async () => {
    if (!formData.phone) {
      setError('No se encontró el número de teléfono')
      return
    }

    setIsGenerating(true)
    setError('')

    try {
      const response = await generateOtp(formData.phone)
      
      if (response.success) {
        setOtpSent(true)
        setResendCountdown(60) // 60 segundos para reenviar
        setError('')
        alert(`✅ Código OTP enviado al +57${formData.phone}`)
      } else {
        setError(response.message || 'Error al enviar el código OTP')
      }
    } catch (err: any) {
      console.error('Error generando OTP:', err)
      setError(err.response?.data?.message || 'Error al enviar el código OTP. Intenta nuevamente.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!otp.trim()) {
      setError('Por favor ingresa el código OTP')
      return
    }

    if (!formData.phone) {
      setError('No se encontró el número de teléfono')
      return
    }

    setIsVerifying(true)
    setError('')

    try {
      const response = await verifyOtp(formData.phone, otp)
      
      if (response.success) {
        setError('')
        setIsVerified(true)
        setTimeout(() => {
          onNext({ otp: otp, otpVerified: true })
        }, 500)
      } else {
        setError(response.message || 'Código OTP incorrecto')
        setOtp('')
      }
    } catch (err: any) {
      console.error('Error verificando OTP:', err)
      setError(err.response?.data?.message || 'Error al verificar el código. Intenta nuevamente.')
      setOtp('')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResendOtp = () => {
    handleGenerateOtp() // Reutilizar la función de generar
  }

  return (
    <form onSubmit={handleVerifyOtp} className='space-y-6'>
      <div>
        <h3 className='text-2xl font-bold text-gray-800 mb-4'>Verificación de Código OTP</h3>
        <p className='text-gray-600 mb-6'>
          Te enviaremos un código de 4 dígitos al teléfono <strong>+57{formData.phone}</strong>
        </p>
      </div>

      {/* Botón para generar OTP */}
      {!otpSent && (
        <div className='bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-lg p-6'>
          <div className='text-center'>
            <p className='text-sm text-gray-700 mb-4 font-semibold'>Haz clic para recibir tu código</p>
            <button
              type='button'
              onClick={handleGenerateOtp}
              disabled={isGenerating}
              className='px-8 py-4 bg-gradient-to-r from-primary-color to-accent-color text-white font-bold rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto'
            >
              {isGenerating ? (
                <>
                  <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                  Enviando código...
                </>
              ) : (
                <>
                  📱 Enviar código SMS
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Mensaje de código enviado */}
      {otpSent && !isVerified && (
        <div className='bg-green-50 border-2 border-green-200 rounded-lg p-4'>
          <div className='flex items-center gap-2 text-green-700'>
            <span className='text-xl'>✓</span>
            <span className='font-semibold'>Código enviado a tu celular +57{formData.phone}</span>
          </div>
          <p className='text-sm text-green-600 mt-2'>Revisa tus mensajes de texto</p>
        </div>
      )}

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

      {/* OTP Input - Solo mostrar cuando el código fue enviado */}
      {otpSent && (
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
            autoFocus
            className='w-full px-4 py-4 text-center text-3xl tracking-widest border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color focus:border-transparent'
            disabled={isVerified || isVerifying}
          />
        </div>
      )}

      {/* Resend Button - Solo cuando el código fue enviado */}
      {otpSent && !isVerified && (
        <div className='text-center'>
          <p className='text-sm text-gray-600 mb-3'>¿No recibiste el código?</p>
          <button
            type='button'
            onClick={handleResendOtp}
            disabled={resendCountdown > 0 || isGenerating}
            className='text-primary-color font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {resendCountdown > 0 ? `Reenviar en ${resendCountdown}s` : 'Reenviar código'}
          </button>
        </div>
      )}

      {/* Info Box */}
      {otpSent && (
        <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
          <h4 className='font-semibold text-yellow-900 mb-2'>Información de Verificación</h4>
          <ul className='text-sm text-yellow-800 space-y-1 list-disc list-inside'>
            <li>El código se envía por SMS al número proporcionado</li>
            <li>Válido por 5 minutos desde su generación</li>
            <li>Tienes máximo 3 intentos para ingresarlo</li>
            <li>Revisa tu bandeja de SMS</li>
          </ul>
        </div>
      )}

      {/* Action Buttons - Solo cuando el código fue enviado */}
      {otpSent && (
        <div className='flex gap-4 pt-4'>
          <button
            type='submit'
            disabled={otp.length !== 4 || isVerified || isVerifying}
            className='flex-1 bg-gradient-to-r from-primary-color to-accent-color text-white font-semibold py-3 rounded-lg hover:shadow-lg disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2'
          >
            {isVerifying ? (
              <>
                <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                Verificando...
              </>
            ) : isVerified ? (
              <>✓ Verificado</>
            ) : (
              <>Verificar Código</>
            )}
          </button>
        </div>
      )}
    </form>
  )
}

export default Step2OTP
