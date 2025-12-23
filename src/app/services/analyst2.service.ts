import { getData, postData, putData } from '../api/root'

export interface ProcessCreditData {
  action: 'approve' | 'reject' | 'return'
  notes?: string
  reason?: string
  references?: {
    personalReferenceVerified?: boolean
    personalReferenceNotes?: string
    laboralReferenceVerified?: boolean
    laboralReferenceNotes?: string
    commercialReferenceVerified?: boolean
    commercialReferenceNotes?: string
  }
}

/**
 * Obtiene todos los créditos pendientes para Analista 2
 */
export const getCreditsAnalyst2 = async (search?: string) => {
  try {
    const url = search
      ? `/analyst2/credits?search=${encodeURIComponent(search)}`
      : '/analyst2/credits'
    const data = await getData(url)
    return data
  } catch (error) {
    console.error('Error fetching credits for analyst2:', error)
    throw error
  }
}

/**
 * Obtiene un crédito específico por ID
 */
export const getCreditById = async (id: string) => {
  try {
    const data = await getData(`/analyst2/credits/${id}`)
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
    const data = await postData(`/analyst2/credits/${id}/process`, processData)
    return data
  } catch (error) {
    console.error('Error processing credit:', error)
    throw error
  }
}

/**
 * Actualiza los datos laborales de un crédito
 */
export const updateCreditData = async (id: string, creditData: any) => {
  try {
    const data = await putData(`/analyst2/credits/${id}/data`, creditData)
    return data
  } catch (error) {
    console.error('Error updating credit data:', error)
    throw error
  }
}

/**
 * Guarda información de referencias
 */
export const saveReferences = async (id: string, references: any) => {
  try {
    const data = await postData(`/analyst2/credits/${id}/process`, {
      action: 'approve',
      references,
    })
    return data
  } catch (error) {
    console.error('Error saving references:', error)
    throw error
  }
}

/**
 * Devuelve el crédito al Analista 1
 */
export const returnToAnalyst1 = async (id: string, reason: string) => {
  try {
    const data = await postData(`/analyst2/credits/${id}/process`, {
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
    const data = await postData(`/analyst2/credits/${id}/comments`, { comment })
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
    const data = await getData(`/analyst2/credits/${id}/validations`)
    return data
  } catch (error) {
    console.error('Error fetching validations:', error)
    throw error
  }
}

