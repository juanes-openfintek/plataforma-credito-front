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

export const calculateSimulation = async (simulationData: any) => {
  const headers = getHeaders()
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/commercial/simulations/calculate`,
    simulationData,
    headers
  )
  return response.data
}

export const saveSimulation = async (simulationData: any) => {
  const headers = getHeaders()
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/commercial/simulations`,
    simulationData,
    headers
  )
  return response.data
}

export const getSimulations = async (status?: string) => {
  const headers = getHeaders()
  const url = status
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/commercial/simulations?status=${status}`
    : `${process.env.NEXT_PUBLIC_BACKEND_URL}/commercial/simulations`
  const response = await axios.get(url, headers)
  return response.data
}

export const getSimulationById = async (simulationId: string) => {
  const headers = getHeaders()
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/commercial/simulations/${simulationId}`,
    headers
  )
  return response.data
}

export const convertSimulationToCredit = async (simulationId: string) => {
  const headers = getHeaders()
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/commercial/simulations/${simulationId}/convert`,
    {},
    headers
  )
  return response.data
}

export const getCommercialStats = async () => {
  const headers = getHeaders()
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/commercial/stats`,
    headers
  )
  return response.data
}

