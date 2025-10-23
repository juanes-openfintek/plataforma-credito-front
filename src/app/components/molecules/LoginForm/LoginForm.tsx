'use client'
import axios from 'axios'
import { useFormik } from 'formik'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import SimpleFieldInput from '../../atoms/SimpleFieldInput/SimpleFieldInput'
import NextImage from '../../atoms/NextImage/NextImage'
import SquareButton from '../../atoms/SquareButton/SquareButton'
import {
  validateLogin,
  validateReset,
} from '../../../helpers/validationsForms'
import redirectionByRole from '../../../helpers/redirectionByRole'
import useDecryptedSession from '../../../hooks/useDecryptedSession'
import Link from 'next/link'

/**
 * LoginForm is a component that renders the login form
 * @example <LoginForm />
 * @returns The LoginForm component
 */
export const LoginForm = () => {
  /**
   * Router instance to manage the routes
   */
  const router = useRouter()
  /**
   * State to manage the loading
   */
  const [loading, setLoading] = useState(false)
  /**
   * State to manage the error
   */
  const [error, setError] = useState('')
  /**
   * State to manage the visibility of the login form
   */
  const [loginVisible, setLoginVisible] = useState(true)
  /**
   * State to manage the visibility of the reset password form
   */
  const [resetPasswordVisible, setResetPasswordVisible] = useState(false)
  /**
   * State to manage the visibility of the response from the reset password form
   */
  const [responseResetPassword, setResponseResetPassword] = useState(false)
  /**
   * userData is the data of the user
   */
  const userData: any = useDecryptedSession()

  /**
   * Effect to manage the redirection by role
   */
  useEffect(() => {
    if (userData?.roles?.length > 0) {
      const callbackUrl = redirectionByRole(userData?.roles ?? 'user')
      router.push(callbackUrl)
    }
  }, [userData])

  /**
   * Function to submit the data to login
   */
  const onSubmitData = async () => {
    try {
      setLoading(true)
      const res = await signIn('credentials', {
        redirect: false,
        email: formik.values.email,
        password: formik.values.password,
      })
      if (res?.error) {
        setLoading(false)
        setError('Correo electrónico o contraseña incorrectos')
      }
    } catch (error: any) {
      setLoading(false)
      setError(error)
    }
  }

  /**
   * Formik instance to manage the forms
   */
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validate: validateLogin,
    onSubmit: (values) => {
      onSubmitData()
    },
  })

  /**
   * Formik instance to manage the forms
   */
  const formikResetPassword = useFormik({
    initialValues: {
      email: '',
    },
    validate: validateReset,
    onSubmit: async (values) => {
      setLoading(true)
      await axios
        .post(
          process.env.NEXT_PUBLIC_BACKEND_URL + '/auth/reset-email',
          { email: values.email },
          {
            headers: {
              'x-security-token': process.env.NEXT_PUBLIC_SECURITY_TOKEN,
            },
          }
        )
        .then((res: any) => {
          setLoading(false)
          setResponseResetPassword(true)
          setTimeout(() => {
            setResponseResetPassword(false)
          }, 3000)
          setTimeout(() => {
            setLoginVisible(true)
            setResetPasswordVisible(false)
          }, 5000)
        })
    },
  })
  return (
    <>
      {loginVisible && (
        <form onSubmit={formik.handleSubmit} className='flex flex-col gap-4'>
          {error && (
            <p className='text-center bg-red-300 py-4 mb-6 rounded'>{error}</p>
          )}
          <NextImage
            src='/images/openfintek-logo.png'
            alt='OpenFintek logo'
            width={200}
            height={60}
            className='self-center mb-4 object-contain max-h-16'
          />
          <div className='my-4'>
            <SimpleFieldInput
              value={formik.values.email}
              errors={formik.errors.email}
              type='email'
              placeholder='ejemplo@correo.com'
              label='Correo electrónico'
              name='email'
              border
              onHandleChange={formik.handleChange}
            />
            <SimpleFieldInput
              value={formik.values.password}
              errors={formik.errors.password}
              type='password'
              placeholder='Escribe tu contraseña'
              label='Contraseña'
              name='password'
              border
              onHandleChange={formik.handleChange}
            />
          </div>
          <button
            onClick={() => {
              setResetPasswordVisible(!resetPasswordVisible)
              setLoginVisible(!loginVisible)
            }}
            type='button'
            className='text-xs font-bold underline self-center bg-transparent'
          >
            ¿Olvidaste tu contraseña?
          </button>
          <SquareButton
            text={loading ? 'Cargando...' : 'Iniciar sesión'}
            disable={loading}
          />
          <Link href='/registro'>
            <SquareButton
              text='Registrarse'
            />
          </Link>
        </form>
      )}
      {resetPasswordVisible && (
        <>
          <form
            onSubmit={formikResetPassword.handleSubmit}
            className='flex flex-col gap-4'
          >
            <NextImage
              src='/images/openfintek-logo.png'
              alt='OpenFintek logo'
              width={200}
              height={60}
              className='self-center mb-4 object-contain max-h-16'
            />
            <div className='my-4'>
              <SimpleFieldInput
                value={formikResetPassword.values.email}
                errors={formikResetPassword.errors.email}
                type='email'
                placeholder='ejemplo@correo.com'
                label='Correo electrónico'
                name='email'
                border
                onHandleChange={formikResetPassword.handleChange}
              />
            </div>
            <SquareButton
              text={loading ? 'Cargando...' : 'Restablecer contraseña'}
              disable={loading}
            />
          </form>
          <p
            className={`text-center bg-green-300 py-4 m-6 rounded text-white transition-opacity duration-1000 ease-out ${
              responseResetPassword ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Se ha enviado un correo electrónico para restablecer la contraseña
          </p>
        </>
      )}
    </>
  )
}
