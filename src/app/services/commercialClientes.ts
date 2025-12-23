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

// Datos mock para modo demo
const mockClientes = [
  {
    _id: 'demo-cliente-1',
    firstName: 'María',
    lastName: 'González Pérez',
    identificationNumber: '1234567890',
    phone: '3001234567',
    email: 'maria.gonzalez@email.com',
    status: 'completado',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    creditAmount: 25000000,
    completionPercentage: 100,
    pensionIssuer: 'colpensiones',
    pensionType: 'jubilacion',
    monthlyIncome: 3500000,
    birthDate: '1960-05-15',
    gender: 'femenino',
    financialDetails: {
      bank: 'Bancolombia',
      accountType: 'ahorros',
      accountNumber: '1234567890'
    }
  },
  {
    _id: 'demo-cliente-2',
    firstName: 'Carlos',
    lastName: 'Rodríguez López',
    identificationNumber: '9876543210',
    phone: '3109876543',
    email: 'carlos.rodriguez@email.com',
    status: 'en-progreso',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    creditAmount: 18000000,
    completionPercentage: 65,
    pensionIssuer: 'porvenir',
    pensionType: 'jubilacion',
    monthlyIncome: 2800000,
    birthDate: '1958-11-20',
    gender: 'masculino',
    financialDetails: {
      bank: 'Davivienda',
      accountType: 'ahorros',
      accountNumber: '9876543210'
    }
  },
  {
    _id: 'demo-cliente-3',
    firstName: 'Ana',
    lastName: 'Martínez Silva',
    identificationNumber: '5678901234',
    phone: '3205678901',
    email: 'ana.martinez@email.com',
    status: 'radicado',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    creditAmount: 15000000,
    completionPercentage: 100,
    pensionIssuer: 'proteccion',
    pensionType: 'jubilacion',
    monthlyIncome: 2500000,
    birthDate: '1962-03-10',
    gender: 'femenino',
    financialDetails: {
      bank: 'BBVA Colombia',
      accountType: 'corriente',
      accountNumber: '5678901234'
    }
  },
  {
    _id: 'demo-cliente-4',
    firstName: 'José',
    lastName: 'Hernández García',
    identificationNumber: '3456789012',
    phone: '3153456789',
    email: 'jose.hernandez@email.com',
    status: 'aprobado',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    creditAmount: 30000000,
    completionPercentage: 100,
    pensionIssuer: 'colpensiones',
    pensionType: 'jubilacion',
    monthlyIncome: 4200000,
    birthDate: '1955-08-25',
    gender: 'masculino',
    financialDetails: {
      bank: 'Banco de Bogotá',
      accountType: 'ahorros',
      accountNumber: '3456789012'
    }
  },
  {
    _id: 'demo-cliente-5',
    firstName: 'Rosa',
    lastName: 'Díaz Moreno',
    identificationNumber: '7890123456',
    phone: '3007890123',
    email: 'rosa.diaz@email.com',
    status: 'desembolsado',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    creditAmount: 20000000,
    completionPercentage: 100,
    pensionIssuer: 'colfondos',
    pensionType: 'jubilacion',
    monthlyIncome: 3000000,
    birthDate: '1959-12-05',
    gender: 'femenino',
    financialDetails: {
      bank: 'Nequi',
      accountType: 'ahorros',
      accountNumber: '7890123456'
    }
  },
  {
    _id: 'demo-cliente-6',
    firstName: 'Pedro',
    lastName: 'Sánchez Ruiz',
    identificationNumber: '2345678901',
    phone: '3182345678',
    email: 'pedro.sanchez@email.com',
    status: 'iniciado',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    creditAmount: 12000000,
    completionPercentage: 25,
    pensionIssuer: 'skandia',
    pensionType: 'jubilacion',
    monthlyIncome: 2200000,
    birthDate: '1963-07-18',
    gender: 'masculino',
    financialDetails: {
      bank: '',
      accountType: '',
      accountNumber: ''
    }
  }
]

const mockRadicatedCredits = [
  {
    _id: 'demo-radicado-1',
    name: 'Ana',
    lastname: 'Martínez Silva',
    documentNumber: '5678901234',
    amount: 15000000,
    status: 'ANALYST1_REVIEW',
    radicationDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    created: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    radicationNumber: 'RAD-2025-001',
    quotasNumber: 60,
    monthlyIncome: '2500000',
    nameCompany: 'Protección'
  },
  {
    _id: 'demo-radicado-2',
    name: 'José',
    lastname: 'Hernández García',
    documentNumber: '3456789012',
    amount: 30000000,
    status: 'ANALYST3_APPROVED',
    radicationDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    created: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    radicationNumber: 'RAD-2025-002',
    quotasNumber: 84,
    monthlyIncome: '4200000',
    nameCompany: 'Colpensiones'
  },
  {
    _id: 'demo-radicado-3',
    name: 'Rosa',
    lastname: 'Díaz Moreno',
    documentNumber: '7890123456',
    amount: 20000000,
    status: 'DISBURSED',
    radicationDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    created: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    radicationNumber: 'RAD-2025-003',
    quotasNumber: 72,
    monthlyIncome: '3000000',
    nameCompany: 'Colfondos'
  }
]

// ==================== CLIENTES ====================

/**
 * Crear un nuevo cliente
 */
export const createCliente = async (clienteData: any) => {
  if (isDemoMode()) {
    // En modo demo, simular creación
    const newCliente = {
      _id: `demo-cliente-${Date.now()}`,
      ...clienteData,
      status: 'iniciado',
      createdAt: new Date().toISOString(),
      completionPercentage: 15,
    }
    mockClientes.push(newCliente)
    return newCliente
  }

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
  if (isDemoMode()) {
    return mockClientes
  }

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
  if (isDemoMode()) {
    return mockClientes.filter(c => c.status === status)
  }

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
  if (isDemoMode()) {
    const cliente = mockClientes.find(c => c._id === clienteId)
    if (!cliente) throw new Error('Cliente no encontrado')
    return cliente
  }

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
  if (isDemoMode()) {
    const index = mockClientes.findIndex(c => c._id === clienteId)
    if (index === -1) throw new Error('Cliente no encontrado')
    mockClientes[index] = { ...mockClientes[index], ...updateData }
    return mockClientes[index]
  }

  try {
    const headers = getHeaders()
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/commercial/clientes/${clienteId}`,
      updateData,
      headers
    )
    return response.data
  } catch (error: any) {
    console.error('Error updating cliente:', error.response?.data)
    throw error
  }
}

/**
 * Eliminar un cliente
 */
export const deleteCliente = async (clienteId: string) => {
  if (isDemoMode()) {
    const index = mockClientes.findIndex(c => c._id === clienteId)
    if (index !== -1) {
      mockClientes.splice(index, 1)
    }
    return { success: true }
  }

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
  if (isDemoMode()) {
    return {
      usuario: 'comercial',
      nombre: 'Comercial Demo',
      email: 'comercial@demo.com',
      telefono: '3001234567'
    }
  }

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
  if (isDemoMode()) {
    return { ...updateData, success: true }
  }

  const headers = getHeaders()
  const response = await axios.put(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/commercial/profile`,
    updateData,
    headers
  )
  return response.data
}

// ==================== RADICACIÓN ====================

/**
 * Radicar un cliente como crédito para analistas
 */
export const submitClienteAsCredit = async (clienteId: string) => {
  if (isDemoMode()) {
    const cliente = mockClientes.find(c => c._id === clienteId)
    if (!cliente) throw new Error('Cliente no encontrado')
    
    // Actualizar estado del cliente
    const index = mockClientes.findIndex(c => c._id === clienteId)
    mockClientes[index].status = 'radicado'
    
    // Agregar a radicados
    mockRadicatedCredits.push({
      _id: `demo-radicado-${Date.now()}`,
      name: cliente.firstName,
      lastname: cliente.lastName,
      documentNumber: cliente.identificationNumber,
      amount: cliente.creditAmount || 0,
      status: 'SUBMITTED',
      radicationDate: new Date().toISOString(),
      created: cliente.createdAt,
      radicationNumber: `RAD-2025-${String(mockRadicatedCredits.length + 1).padStart(3, '0')}`,
      quotasNumber: 60,
      monthlyIncome: String(cliente.monthlyIncome || 0),
      nameCompany: cliente.pensionIssuer || 'N/A'
    })
    
    return { success: true, message: 'Crédito radicado exitosamente' }
  }

  const headers = getHeaders()
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/commercial/clientes/${clienteId}/submit`,
    {},
    headers
  )
  return response.data
}

/**
 * Radicar múltiples clientes como créditos
 */
export const submitMultipleClientes = async (clienteIds: string[]) => {
  if (isDemoMode()) {
    for (const id of clienteIds) {
      await submitClienteAsCredit(id)
    }
    return { success: true, count: clienteIds.length }
  }

  const headers = getHeaders()
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/commercial/clientes/submit-multiple`,
    { clienteIds },
    headers
  )
  return response.data
}

/**
 * Obtener créditos radicados
 */
export const getRadicatedCredits = async () => {
  if (isDemoMode()) {
    return mockRadicatedCredits
  }

  const headers = getHeaders()
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/commercial/radicated-credits`,
    headers
  )
  return response.data
}

/**
 * Reenviar un crédito devuelto hacia el analista que lo devolvió
 */
export const resendCreditToAnalyst = async (
  creditId: string,
  notes?: string,
  attachments?: Array<{ fileName: string; fileUrl: string; documentType: string }>
) => {
  if (isDemoMode()) {
    return { success: true, message: 'Crédito reenviado (demo)' }
  }

  const headers = getHeaders()
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/commercial/credits/${creditId}/resend-to-analyst`,
    { notes, attachments },
    headers
  )

  return response.data
}

/**
 * Actualizar datos del crédito (solo cuando está devuelto al comercial)
 */
export const updateCreditFromCommercial = async (creditId: string, data: Record<string, any>) => {
  if (isDemoMode()) {
    return { success: true, message: 'Crédito actualizado (demo)' }
  }

  const headers = getHeaders()
  const response = await axios.put(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/commercial/credits/${creditId}`,
    data,
    headers
  )

  return response.data
}