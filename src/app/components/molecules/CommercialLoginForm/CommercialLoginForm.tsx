'use client'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import SimpleFieldInput from '../../atoms/SimpleFieldInput/SimpleFieldInput'
import Link from 'next/link'
import { useCommercialAuth } from '../../../context/CommercialAuthContext'

export const CommercialLoginForm = () => {
  const router = useRouter()
  const { login } = useCommercialAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    usuario: '',
    codigo: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const success = await login(formData.usuario, formData.codigo)
      
      if (success) {
        // Redirigir al portal comercial
        setTimeout(() => {
          router.push('/comercial')
        }, 300)
      } else {
        setError('Usuario o código incorrectos')
        setLoading(false)
      }
    } catch (error: any) {
      setLoading(false)
      setError('Error al iniciar sesión. Intenta nuevamente.')
    }
  }

  return (
    <div className='w-full max-w-md mx-auto'>
      {error && (
        <div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-800'>
          <p className='font-semibold'>Error</p>
          <p className='text-sm'>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className='space-y-4'>
        <SimpleFieldInput
          name='usuario'
          label='Usuario'
          type='text'
          placeholder='Ingresa tu usuario'
          value={formData.usuario}
          onHandleChange={handleInputChange}
          errors={error ? 'Usuario o código incorrectos' : ''}
          border
        />

        <SimpleFieldInput
          name='codigo'
          label='Código'
          type='password'
          placeholder='Ingresa tu código'
          value={formData.codigo}
          onHandleChange={handleInputChange}
          errors={error ? 'Usuario o código incorrectos' : ''}
          border
        />

        <button
          type='submit'
          disabled={loading}
          className='w-full bg-gradient-to-r from-primary-color to-accent-color text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-6'
        >
          {loading ? 'Accediendo...' : 'Acceder al Portal'}
        </button>
      </form>

      <p className='text-center text-gray-600 mt-6 text-sm'>
        <Link href='/login' className='text-primary-color font-semibold hover:underline'>
          Volver al login principal
        </Link>
      </p>
    </div>
  )
}
