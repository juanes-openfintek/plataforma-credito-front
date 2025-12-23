'use client'
import { useFormik } from 'formik'
import React from 'react'
import SimpleFieldInput from '../../atoms/SimpleFieldInput/SimpleFieldInput'
import NextImage from '../../atoms/NextImage/NextImage'
import SquareButton from '../../atoms/SquareButton/SquareButton'
import {
  validateRegister,
} from '../../../helpers/validationsForms'
import { useRegisterState } from '../../../context/registerContext'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

/**
 * RegisterForm is a component that renders the login form
 * @example <RegisterForm />
 * @returns The RegisterForm component
 */
export const RegisterForm = () => {
  /**
   * RegisterContext instance to manage the register data
   */
  const { saveUserData, registerData, errorMessage } = useRegisterState()
  /**
   * Query instance to get the token from the url
   */
  const query = useSearchParams()
  /**
   * Formik instance to manage the forms
   */
  const formikRegister = useFormik({
    initialValues: {
      email: query.get('email') ?? '',
      password: '',
      confirmPassword: '',
    },
    validate: validateRegister,
    onSubmit: (values) => {
      saveUserData(
        values.email,
        values.password,
        registerData.name,
        registerData.lastName,
        registerData.phoneNumber,
        registerData.dateOfBirth,
        registerData.documentType,
        registerData.documentNumber,
        registerData.accountType,
        registerData.accountNumber,
        registerData.accountEntity
      )
    },
  })

  return (
    <>
      {errorMessage && (
        <p className='text-center bg-red-300 py-4 mb-6 rounded'>
          {errorMessage}
        </p>
      )}
      <form onSubmit={formikRegister.handleSubmit} className='flex flex-col'>
        <NextImage
          src='/images/letras_openfintek.png'
          alt='OpenFintek'
          width={220}
          height={70}
          className='self-center mb-4 object-contain max-h-16'
        />
        <div className='my-10'>
          <SimpleFieldInput
            value={formikRegister.values.email}
            errors={formikRegister.errors.email}
            type='email'
            placeholder='ejemplo@correo.com'
            label='Correo electrónico'
            name='email'
            border
            readonly={query.get('email') !== null}
            onHandleChange={formikRegister.handleChange}
          />
          <SimpleFieldInput
            value={formikRegister.values.password}
            errors={formikRegister.errors.password}
            type='password'
            placeholder='Escribe tu contraseña'
            label='Nueva Contraseña'
            name='password'
            border
            onHandleChange={formikRegister.handleChange}
          />
          <SimpleFieldInput
            value={formikRegister.values.confirmPassword}
            errors={formikRegister.errors.confirmPassword}
            type='password'
            placeholder='Escribe tu contraseña'
            label='Confirmar contraseña'
            name='confirmPassword'
            border
            onHandleChange={formikRegister.handleChange}
          />
        </div>
        <SquareButton text='Crear cuenta' />
        <Link href='/login' className='mt-4'>
          <SquareButton text='Volver' transparent />
        </Link>
      </form>
    </>
  )
}
