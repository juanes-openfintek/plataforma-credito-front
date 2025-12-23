import { getData, postData, putData } from '../api/root'

export interface ProcessCreditData {
  action: 'approve' | 'reject' | 'return'
  notes?: string
  reason?: string
  documents?: {
    documentType: string
    status: 'accepted' | 'rejected' | 'pending'
    notes?: string
  }[]
}

/**
 * Obtiene todos los créditos pendientes para Analista 3
 */
export const getCreditsAnalyst3 = async (search?: string) => {
  try {
    const url = search
      ? `/analyst3/credits?search=${encodeURIComponent(search)}`
      : '/analyst3/credits'
    const data = await getData(url)
    return data
  } catch (error) {
    console.error('Error fetching credits for analyst3:', error)
    throw error
  }
}

/**
 * Obtiene un crédito específico por ID
 */
export const getCreditById = async (id: string) => {
  try {
    const data = await getData(`/analyst3/credits/${id}`)
    return data
  } catch (error) {
    console.error('Error fetching credit:', error)
    throw error
  }
}

/**
 * Procesa un crédito (pre-aprobar, rechazar o devolver)
 */
export const processCredit = async (
  id: string,
  processData: ProcessCreditData,
) => {
  try {
    const data = await postData(`/analyst3/credits/${id}/process`, processData)
    return data
  } catch (error) {
    console.error('Error processing credit:', error)
    throw error
  }
}

/**
 * Actualiza datos del crédito (incluye checklist)
 */
export const updateCreditData = async (id: string, creditData: any) => {
  try {
    const data = await putData(`/analyst3/credits/${id}/data`, creditData)
    return data
  } catch (error) {
    console.error('Error updating credit data:', error)
    throw error
  }
}

/**
 * Genera link de firma electrónica
 */
export const generateSignatureLink = async (id: string) => {
  try {
    const data = await postData(`/analyst3/credits/${id}/signature-link`, {})
    return data
  } catch (error) {
    console.error('Error generating signature link:', error)
    throw error
  }
}

/**
 * Confirma que el crédito está listo para desembolso
 */
export const confirmDisburse = async (id: string, disburseData?: any) => {
  try {
    const data = await postData(`/analyst3/credits/${id}/disburse`, disburseData)
    return data
  } catch (error) {
    console.error('Error confirming disburse:', error)
    throw error
  }
}

/**
 * Devuelve el crédito al Analista 2
 */
export const returnToAnalyst2 = async (id: string, reason: string) => {
  try {
    const data = await postData(`/analyst3/credits/${id}/process`, {
      action: 'return',
      reason,
    })
    return data
  } catch (error) {
    console.error('Error returning credit:', error)
    throw error
  }
}

/**
 * Agrega un comentario al crédito
 */
export const addComment = async (id: string, comment: string) => {
  try {
    const data = await postData(`/analyst3/credits/${id}/comments`, { comment })
    return data
  } catch (error) {
    console.error('Error adding comment:', error)
    throw error
  }
}

/**
 * Obtiene las validaciones automáticas de un crédito
 */
export const getAutomaticValidations = async (id: string) => {
  try {
    const data = await getData(`/analyst3/credits/${id}/validations`)
    return data
  } catch (error) {
    console.error('Error fetching validations:', error)
    throw error
  }
}

