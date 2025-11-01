'use client'
import React, { useState } from 'react'
import { CreacionFormData } from '../CreacionModule/CreacionModule'

interface Props {
  formData: CreacionFormData
  onNext: (data: Partial<CreacionFormData>) => void
}

const Step4BasicData = ({ formData, onNext }: Props) => {
  const [firstName, setFirstName] = useState(formData.firstName || '')
  const [lastName, setLastName] = useState(formData.lastName || '')
  const [birthDate, setBirthDate] = useState(formData.birthDate || '')
  const [email, setEmail] = useState(formData.email || '')
  const [gender, setGender] = useState(formData.gender || '')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!firstName.trim() || !lastName.trim() || !birthDate || !email.trim() || !gender) {
      setError('Por favor completa todos los campos')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('El correo electrónico no es válido')
      return
    }

    setError('')
    onNext({
      firstName,
      lastName,
      birthDate,
      email,
      gender,
    })
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div>
        <h3 className='text-2xl font-bold text-gray-800 mb-4'>Datos Básicos del Cliente</h3>
        <p className='text-gray-600 mb-6'>Completa la información personal del cliente</p>
      </div>

      {error && (
        <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg'>
          {error}
        </div>
      )}

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* First Name */}
        <div>
          <label className='block text-sm font-semibold text-gray-700 mb-2'>
            Nombres
          </label>
          <input
            type='text'
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder='Ej: Juan Carlos'
            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
          />
        </div>

        {/* Last Name */}
        <div>
          <label className='block text-sm font-semibold text-gray-700 mb-2'>
            Apellidos
          </label>
          <input
            type='text'
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder='Ej: García López'
            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
          />
        </div>

        {/* Birth Date */}
        <div>
          <label className='block text-sm font-semibold text-gray-700 mb-2'>
            Fecha de Nacimiento
          </label>
          <input
            type='date'
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
          />
        </div>

        {/* Gender */}
        <div>
          <label className='block text-sm font-semibold text-gray-700 mb-2'>
            Género
          </label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
          >
            <option value=''>-- Selecciona una opción --</option>
            <option value='masculino'>Masculino</option>
            <option value='femenino'>Femenino</option>
            <option value='otro'>Otro</option>
          </select>
        </div>
      </div>

      {/* Email */}
      <div>
        <label className='block text-sm font-semibold text-gray-700 mb-2'>
          Correo Electrónico
        </label>
        <input
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='cliente@ejemplo.com'
          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
        />
      </div>

      {/* Summary */}
      {firstName && lastName && (
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
          <h4 className='font-semibold text-blue-900 mb-2'>Resumen de datos</h4>
          <div className='space-y-1 text-sm text-blue-800'>
            <p>Nombre Completo: {firstName} {lastName}</p>
            <p>Fecha de Nacimiento: {birthDate || '---'}</p>
            <p>Género: {gender || '---'}</p>
            <p>Correo: {email || '---'}</p>
          </div>
        </div>
      )}

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

export default Step4BasicData
