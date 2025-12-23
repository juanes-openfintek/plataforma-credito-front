import { getData, postData, putData } from '../api/root'

export interface ProcessCreditData {
  action: 'approve' | 'reject' | 'return'
  notes?: string
  reason?: string
  creditData?: any
}

export interface ValidationResult {
  passed: boolean
  score: number
  details: {
    kycScore: number
    debtCapacityRatio: number
    blacklistCheck: boolean
    riskCentralsCheck: boolean
    fraudScore: number
    documentCompletion: number
  }
  warnings: string[]
  errors: string[]
}

/**
 * Obtiene todos los créditos pendientes para Analista 1
 */
export const getCreditsAnalyst1 = async (search?: string) => {
  try {
    const url = search 
      ? `/analyst1/credits?search=${encodeURIComponent(search)}`
      : '/analyst1/credits'
    const data = await getData(url)
    return data
  } catch (error) {
    console.error('Error fetching credits for analyst1:', error)
    throw error
  }
}

/**
 * Obtiene un crédito específico por ID
 */
export const getCreditById = async (id: string) => {
  try {
    const data = await getData(`/analyst1/credits/${id}`)
    return data
  } catch (error) {
    console.error('Error fetching credit:', error)
    throw error
  }
}

/**
 * Procesa un crédito (aprobar, rechazar o devolver)
 */
export const processCredit = async (
  id: string,
  processData: ProcessCreditData,
) => {
  try {
    const data = await postData(`/analyst1/credits/${id}/process`, processData)
    return data
  } catch (error) {
    console.error('Error processing credit:', error)
    throw error
  }
}

/**
 * Actualiza los datos de un crédito
 */
export const updateCreditData = async (id: string, creditData: any) => {
  try {
    const data = await putData(`/analyst1/credits/${id}/data`, creditData)
    return data
  } catch (error) {
    console.error('Error updating credit data:', error)
    throw error
  }
}

/**
 * Obtiene las validaciones automáticas de un crédito
 */
export const getAutomaticValidations = async (
  id: string,
): Promise<ValidationResult> => {
  try {
    const data = await getData(`/analyst1/credits/${id}/validations`)
    return data
  } catch (error) {
    console.error('Error fetching validations:', error)
    throw error
  }
}

/**
 * Agrega un comentario al crédito
 */
export const addComment = async (id: string, comment: string) => {
  try {
    const data = await postData(`/analyst1/credits/${id}/comments`, { comment })
    return data
  } catch (error) {
    console.error('Error adding comment:', error)
    throw error
  }
}

