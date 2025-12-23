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

const isDemoMode = () => {
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('comercial_token') : null
  return token?.startsWith('demo-token-')
}

// Datos mock para estadísticas en modo demo
const getMockStats = () => ({
  totalClients: 6,
  statusBreakdown: {
    radicados: 1,
    'en-progreso': 1,
    aprobado: 1,
    rechazado: 0,
    iniciado: 1,
    completado: 1,
    desembolsado: 1,
  },
  totalCreditRequested: 120000000,
  approvedCredits: 50000000,
  disbursedAmount: 20000000,
})

export const calculateSimulation = async (simulationData: any) => {
  if (isDemoMode()) {
    // Simular cálculo de crédito
    const { amount, term, rate = 1.5 } = simulationData
    const monthlyRate = rate / 100
    const monthlyPayment = (amount * monthlyRate * Math.pow(1 + monthlyRate, term)) / 
                          (Math.pow(1 + monthlyRate, term) - 1)
    const totalToPay = monthlyPayment * term
    const totalInterest = totalToPay - amount

    return {
      amount,
      term,
      rate,
      monthlyPayment: Math.round(monthlyPayment),
      totalToPay: Math.round(totalToPay),
      totalInterest: Math.round(totalInterest),
    }
  }

  const headers = getHeaders()
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/commercial/simulations/calculate`,
    simulationData,
    headers
  )
  return response.data
}

export const saveSimulation = async (simulationData: any) => {
  if (isDemoMode()) {
    return {
      _id: `demo-sim-${Date.now()}`,
      ...simulationData,
      createdAt: new Date().toISOString(),
    }
  }

  const headers = getHeaders()
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/commercial/simulations`,
    simulationData,
    headers
  )
  return response.data
}

export const getSimulations = async (status?: string) => {
  if (isDemoMode()) {
    return []
  }

  const headers = getHeaders()
  const url = status
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/commercial/simulations?status=${status}`
    : `${process.env.NEXT_PUBLIC_BACKEND_URL}/commercial/simulations`
  const response = await axios.get(url, headers)
  return response.data
}

export const getSimulationById = async (simulationId: string) => {
  if (isDemoMode()) {
    return null
  }

  const headers = getHeaders()
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/commercial/simulations/${simulationId}`,
    headers
  )
  return response.data
}

export const convertSimulationToCredit = async (simulationId: string) => {
  if (isDemoMode()) {
    return { success: true }
  }

  const headers = getHeaders()
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/commercial/simulations/${simulationId}/convert`,
    {},
    headers
  )
  return response.data
}

export const getCommercialStats = async () => {
  if (isDemoMode()) {
    return getMockStats()
  }

  const headers = getHeaders()
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/commercial/stats`,
    headers
  )
  return response.data
}
