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

// ==================== CLIENTES ====================

/**
 * Crear un nuevo cliente
 */
export const createCliente = async (clienteData: any) => {
  const headers = getHeaders()
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/commercial/clientes`,
    clienteData,
    headers
  )
  return response.data
}

/**
 * Obtener todos los clientes del comercial
 */
export const getClientes = async () => {
  const headers = getHeaders()
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/commercial/clientes`,
    headers
  )
  return response.data
}

/**
 * Obtener clientes por estado
 */
export const getClientesByStatus = async (status: string) => {
  const headers = getHeaders()
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/commercial/clientes/status/${status}`,
    headers
  )
  return response.data
}

/**
 * Obtener un cliente específico
 */
export const getClienteById = async (clienteId: string) => {
  const headers = getHeaders()
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/commercial/clientes/${clienteId}`,
    headers
  )
  return response.data
}

/**
 * Actualizar un cliente
 */
export const updateCliente = async (clienteId: string, updateData: any) => {
  const headers = getHeaders()
  const response = await axios.patch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/commercial/clientes/${clienteId}`,
    updateData,
    headers
  )
  return response.data
}

/**
 * Eliminar un cliente
 */
export const deleteCliente = async (clienteId: string) => {
  const headers = getHeaders()
  const response = await axios.delete(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/commercial/clientes/${clienteId}`,
    headers
  )
  return response.data
}

// ==================== PERFIL COMERCIAL ====================

/**
 * Obtener perfil del comercial
 */
export const getCommercialProfile = async () => {
  const headers = getHeaders()
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/commercial/profile`,
    headers
  )
  return response.data
}

/**
 * Actualizar perfil del comercial
 */
export const updateCommercialProfile = async (updateData: any) => {
  const headers = getHeaders()
  const response = await axios.put(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/commercial/profile`,
    updateData,
    headers
  )
  return response.data
}

