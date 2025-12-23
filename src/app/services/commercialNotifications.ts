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

export interface CommercialNotification {
  _id: string
  type: 'CREDIT_RETURNED' | 'CREDIT_APPROVED' | 'CREDIT_REJECTED' | 'CREDIT_DISBURSED' | 'SYSTEM'
  title: string
  message: string
  creditId?: string
  creditName?: string
  creditAmount?: number
  returnReason?: string
  returnedBy?: string
  isRead: boolean
  createdAt: string
}

// Mock notifications para modo demo
const mockNotifications: CommercialNotification[] = [
  {
    _id: 'notif-1',
    type: 'CREDIT_RETURNED',
    title: 'Crédito devuelto por Analista 2',
    message: 'El crédito de María González ha sido devuelto. Se requiere documentación adicional.',
    creditId: 'demo-radicado-1',
    creditName: 'María González Pérez',
    creditAmount: 25000000,
    returnReason: 'Se requiere certificado laboral actualizado con fecha no mayor a 30 días.',
    returnedBy: 'Analista 2',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'notif-2',
    type: 'CREDIT_RETURNED',
    title: 'Crédito devuelto por Analista 1',
    message: 'El crédito de Carlos Rodríguez requiere corrección de datos.',
    creditId: 'demo-radicado-2',
    creditName: 'Carlos Rodríguez López',
    creditAmount: 18000000,
    returnReason: 'Los ingresos declarados no coinciden con los desprendibles de pago adjuntos. Por favor verificar.',
    returnedBy: 'Analista 1',
    isRead: false,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'notif-3',
    type: 'CREDIT_APPROVED',
    title: 'Crédito aprobado',
    message: 'El crédito de José Hernández ha sido aprobado y está listo para desembolso.',
    creditId: 'demo-radicado-3',
    creditName: 'José Hernández García',
    creditAmount: 30000000,
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
]

/**
 * Obtener notificaciones del comercial
 */
export const getCommercialNotifications = async (): Promise<CommercialNotification[]> => {
  if (isDemoMode()) {
    return mockNotifications
  }

  try {
    const headers = getHeaders()
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/commercial/notifications`,
      headers
    )
    return response.data
  } catch (error) {
    console.error('Error fetching commercial notifications:', error)
    return []
  }
}

/**
 * Obtener cantidad de notificaciones no leídas
 */
export const getUnreadNotificationsCount = async (): Promise<number> => {
  if (isDemoMode()) {
    return mockNotifications.filter(n => !n.isRead).length
  }

  try {
    const headers = getHeaders()
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/commercial/notifications/unread-count`,
      headers
    )
    return response.data.count || 0
  } catch (error) {
    console.error('Error fetching unread count:', error)
    return 0
  }
}

/**
 * Marcar notificación como leída
 */
export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  if (isDemoMode()) {
    const notif = mockNotifications.find(n => n._id === notificationId)
    if (notif) notif.isRead = true
    return
  }

  try {
    const headers = getHeaders()
    await axios.patch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/commercial/notifications/${notificationId}/read`,
      {},
      headers
    )
  } catch (error) {
    console.error('Error marking notification as read:', error)
  }
}

/**
 * Marcar todas las notificaciones como leídas
 */
export const markAllNotificationsAsRead = async (): Promise<void> => {
  if (isDemoMode()) {
    mockNotifications.forEach(n => n.isRead = true)
    return
  }

  try {
    const headers = getHeaders()
    await axios.patch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/commercial/notifications/mark-all-read`,
      {},
      headers
    )
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
  }
}

/**
 * Obtener notificaciones de créditos devueltos (sin leer)
 */
export const getReturnedCreditsNotifications = async (): Promise<CommercialNotification[]> => {
  const notifications = await getCommercialNotifications()
  return notifications.filter(n => n.type === 'CREDIT_RETURNED' && !n.isRead)
}

