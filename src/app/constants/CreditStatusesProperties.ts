/**
 * Estados simplificados del crédito
 * 
 * PERFILADO: El comercial completó el flujo pero no radicó
 * RADICADO: Se envió a la fábrica de crédito (analistas)
 * EN_ESTUDIO: Está siendo analizado por cualquiera de los analistas
 * DEVUELTO: Fue devuelto por algún analista
 * RECHAZADO: Fue rechazado por algún analista
 * DESEMBOLSADO: El crédito fue desembolsado
 */

export const CreditStatus = {
  PERFILADO: 'PERFILADO',
  RADICADO: 'RADICADO',
  EN_ESTUDIO: 'EN_ESTUDIO',
  DEVUELTO: 'DEVUELTO',
  RECHAZADO: 'RECHAZADO',
  DESEMBOLSADO: 'DESEMBOLSADO',
} as const

export type CreditStatusType = typeof CreditStatus[keyof typeof CreditStatus]

/**
 * CreditStatusesProperties store the properties of the credit statuses
 */
export const CreditStatusesProperties = [
  // Nuevos estados simplificados
  {
    status: 'PERFILADO',
    text: 'Perfilado',
    icon: '/images/round-timer-icon.png',
    background: 'bg-purple-100 text-purple-800',
    description: 'Crédito completado, pendiente de radicar',
  },
  {
    status: 'RADICADO',
    text: 'Radicado',
    icon: '/images/round-timer-icon.png',
    background: 'bg-blue-100 text-blue-800',
    description: 'Enviado a la fábrica de crédito',
  },
  {
    status: 'EN_ESTUDIO',
    text: 'En estudio',
    icon: '/images/round-timer-icon.png',
    background: 'bg-yellow-100 text-yellow-800',
    description: 'En análisis por los analistas',
  },
  {
    status: 'DEVUELTO',
    text: 'Devuelto',
    icon: '/images/square-reject-icon.png',
    background: 'bg-orange-100 text-orange-800',
    description: 'Devuelto por un analista',
  },
  {
    status: 'RECHAZADO',
    text: 'Rechazado',
    icon: '/images/square-reject-icon.png',
    background: 'bg-red-100 text-red-800',
    description: 'Rechazado definitivamente',
  },
  {
    status: 'DESEMBOLSADO',
    text: 'Desembolsado',
    icon: '/images/square-check-icon.png',
    background: 'bg-green-100 text-green-800',
    description: 'Crédito desembolsado',
  },

  // Estados legacy para compatibilidad con datos existentes
  // Estos se mapean a los nuevos estados en la UI
  {
    status: 'DRAFT',
    text: 'Perfilado',
    icon: '/images/round-timer-icon.png',
    background: 'bg-purple-100 text-purple-800',
  },
  {
    status: 'INCOMPLETE',
    text: 'Perfilado',
    icon: '/images/round-timer-icon.png',
    background: 'bg-purple-100 text-purple-800',
  },
  {
    status: 'SUBMITTED',
    text: 'Radicado',
    icon: '/images/round-timer-icon.png',
    background: 'bg-blue-100 text-blue-800',
  },
  {
    status: 'ANALYST1_REVIEW',
    text: 'En estudio',
    icon: '/images/round-timer-icon.png',
    background: 'bg-yellow-100 text-yellow-800',
  },
  {
    status: 'ANALYST1_APPROVED',
    text: 'En estudio',
    icon: '/images/round-timer-icon.png',
    background: 'bg-yellow-100 text-yellow-800',
  },
  {
    status: 'ANALYST1_RETURNED',
    text: 'Devuelto',
    icon: '/images/square-reject-icon.png',
    background: 'bg-orange-100 text-orange-800',
  },
  {
    status: 'COMMERCIAL_RETURNED',
    text: 'Devuelto',
    icon: '/images/square-reject-icon.png',
    background: 'bg-orange-100 text-orange-800',
  },
  {
    status: 'ANALYST1_VERIFICATION',
    text: 'En estudio',
    icon: '/images/round-timer-icon.png',
    background: 'bg-yellow-100 text-yellow-800',
  },
  {
    status: 'ANALYST2_REVIEW',
    text: 'En estudio',
    icon: '/images/round-timer-icon.png',
    background: 'bg-yellow-100 text-yellow-800',
  },
  {
    status: 'ANALYST2_APPROVED',
    text: 'En estudio',
    icon: '/images/round-timer-icon.png',
    background: 'bg-yellow-100 text-yellow-800',
  },
  {
    status: 'ANALYST2_RETURNED',
    text: 'Devuelto',
    icon: '/images/square-reject-icon.png',
    background: 'bg-orange-100 text-orange-800',
  },
  {
    status: 'ANALYST2_VERIFICATION',
    text: 'En estudio',
    icon: '/images/round-timer-icon.png',
    background: 'bg-yellow-100 text-yellow-800',
  },
  {
    status: 'ANALYST3_REVIEW',
    text: 'En estudio',
    icon: '/images/round-timer-icon.png',
    background: 'bg-yellow-100 text-yellow-800',
  },
  {
    status: 'ANALYST3_APPROVED',
    text: 'En estudio',
    icon: '/images/round-timer-icon.png',
    background: 'bg-yellow-100 text-yellow-800',
  },
  {
    status: 'ANALYST3_RETURNED',
    text: 'Devuelto',
    icon: '/images/square-reject-icon.png',
    background: 'bg-orange-100 text-orange-800',
  },
  {
    status: 'ANALYST3_VERIFICATION',
    text: 'En estudio',
    icon: '/images/round-timer-icon.png',
    background: 'bg-yellow-100 text-yellow-800',
  },
  {
    status: 'PENDING_SIGNATURE',
    text: 'En estudio',
    icon: '/images/round-timer-icon.png',
    background: 'bg-yellow-100 text-yellow-800',
  },
  {
    status: 'READY_TO_DISBURSE',
    text: 'En estudio',
    icon: '/images/round-timer-icon.png',
    background: 'bg-yellow-100 text-yellow-800',
  },
  {
    status: 'DISBURSED',
    text: 'Desembolsado',
    icon: '/images/square-check-icon.png',
    background: 'bg-green-100 text-green-800',
  },
  {
    status: 'REJECTED',
    text: 'Rechazado',
    icon: '/images/square-reject-icon.png',
    background: 'bg-red-100 text-red-800',
  },
  {
    status: 'ACTIVE',
    text: 'Desembolsado',
    icon: '/images/cash-icon.png',
    background: 'bg-green-100 text-green-800',
  },
  {
    status: 'PAID',
    text: 'Desembolsado',
    icon: '/images/square-check-icon.png',
    background: 'bg-green-100 text-green-800',
  },
  {
    status: 'DEFAULTED',
    text: 'Desembolsado',
    icon: '/images/round-timer-icon.png',
    background: 'bg-red-100 text-red-800',
  },
  // Estados legacy del comercial
  {
    status: 'pending',
    text: 'En estudio',
    icon: '/images/round-timer-icon.png',
    background: 'bg-yellow-100 text-yellow-800',
  },
  {
    status: 'approved',
    text: 'En estudio',
    icon: '/images/square-check-icon.png',
    background: 'bg-yellow-100 text-yellow-800',
  },
  {
    status: 'denied',
    text: 'Rechazado',
    icon: '/images/square-reject-icon.png',
    background: 'bg-red-100 text-red-800',
  },
  {
    status: 'default',
    text: 'Desembolsado',
    icon: '/images/round-timer-icon.png',
    background: 'bg-red-100 text-red-800',
  },
  {
    status: 'validated',
    text: 'En estudio',
    icon: '/images/square-check-icon.png',
    background: 'bg-yellow-100 text-yellow-800',
  },
  // Estados del cliente comercial
  {
    status: 'iniciado',
    text: 'Perfilado',
    icon: '/images/round-timer-icon.png',
    background: 'bg-purple-100 text-purple-800',
  },
  {
    status: 'en-progreso',
    text: 'Perfilado',
    icon: '/images/round-timer-icon.png',
    background: 'bg-purple-100 text-purple-800',
  },
  {
    status: 'completado',
    text: 'Perfilado',
    icon: '/images/round-timer-icon.png',
    background: 'bg-purple-100 text-purple-800',
  },
  {
    status: 'radicado',
    text: 'Radicado',
    icon: '/images/round-timer-icon.png',
    background: 'bg-blue-100 text-blue-800',
  },
  {
    status: 'aprobado',
    text: 'En estudio',
    icon: '/images/square-check-icon.png',
    background: 'bg-yellow-100 text-yellow-800',
  },
  {
    status: 'rechazado',
    text: 'Rechazado',
    icon: '/images/square-reject-icon.png',
    background: 'bg-red-100 text-red-800',
  },
  {
    status: 'desembolsado',
    text: 'Desembolsado',
    icon: '/images/square-check-icon.png',
    background: 'bg-green-100 text-green-800',
  },
]

/**
 * Mapea cualquier estado interno/legacy al estado simplificado para mostrar en UI
 */
export const mapToSimplifiedStatus = (status: string): CreditStatusType => {
  // Estados que son "Perfilado"
  const perfiladoStatuses = ['DRAFT', 'INCOMPLETE', 'iniciado', 'en-progreso', 'completado']
  if (perfiladoStatuses.includes(status)) return CreditStatus.PERFILADO

  // Estados que son "Radicado"
  const radicadoStatuses = ['SUBMITTED', 'radicado']
  if (radicadoStatuses.includes(status)) return CreditStatus.RADICADO

  // Estados que son "En estudio"
  const enEstudioStatuses = [
    'ANALYST1_REVIEW', 'ANALYST1_APPROVED', 'ANALYST1_VERIFICATION',
    'ANALYST2_REVIEW', 'ANALYST2_APPROVED', 'ANALYST2_VERIFICATION',
    'ANALYST3_REVIEW', 'ANALYST3_APPROVED', 'ANALYST3_VERIFICATION',
    'PENDING_SIGNATURE', 'READY_TO_DISBURSE',
    'pending', 'approved', 'validated', 'aprobado'
  ]
  if (enEstudioStatuses.includes(status)) return CreditStatus.EN_ESTUDIO

  // Estados que son "Devuelto"
  const devueltoStatuses = [
    'ANALYST1_RETURNED', 'ANALYST2_RETURNED', 'ANALYST3_RETURNED',
    'COMMERCIAL_RETURNED'
  ]
  if (devueltoStatuses.includes(status)) return CreditStatus.DEVUELTO

  // Estados que son "Rechazado"
  const rechazadoStatuses = ['REJECTED', 'denied', 'rechazado']
  if (rechazadoStatuses.includes(status)) return CreditStatus.RECHAZADO

  // Estados que son "Desembolsado"
  const desembolsadoStatuses = ['DISBURSED', 'ACTIVE', 'PAID', 'DEFAULTED', 'desembolsado', 'default']
  if (desembolsadoStatuses.includes(status)) return CreditStatus.DESEMBOLSADO

  // Por defecto, si es el nuevo estado simplificado, devolverlo
  if (Object.values(CreditStatus).includes(status as CreditStatusType)) {
    return status as CreditStatusType
  }

  // Fallback
  return CreditStatus.PERFILADO
}

/**
 * Obtiene las propiedades de un estado simplificado
 */
export const getStatusProperties = (status: string) => {
  const simplifiedStatus = mapToSimplifiedStatus(status)
  return CreditStatusesProperties.find(s => s.status === simplifiedStatus) || CreditStatusesProperties[0]
}
