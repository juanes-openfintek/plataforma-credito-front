import axios from 'axios'

const getHeaders = () => {
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('comercial_token') : null
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'x-security-token': process.env.NEXT_PUBLIC_SECURITY_TOKEN || '',
    },
  }
}

/**
 * Generar y enviar código OTP por SMS
 */
export const generateOtp = async (phone: string) => {
  const headers = getHeaders()
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/commercial/otp/generate`,
    { phone },
    headers
  )
  return response.data
}

/**
 * Verificar código OTP
 */
export const verifyOtp = async (phone: string, otp: string) => {
  const headers = getHeaders()
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/commercial/otp/verify`,
    { phone, otp },
    headers
  )
  return response.data
}

/**
 * Obtener tiempo restante del OTP
 */
export const getOtpTimeRemaining = async (phone: string) => {
  const headers = getHeaders()
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/commercial/otp/time-remaining/${phone}`,
    headers
  )
  return response.data
}

