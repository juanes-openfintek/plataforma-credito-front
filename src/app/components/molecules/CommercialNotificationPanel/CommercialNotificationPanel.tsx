'use client'
import React, { useState, useEffect } from 'react'
import {
  CommercialNotification,
  getCommercialNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../../../services/commercialNotifications'

interface CommercialNotificationPanelProps {
  isOpen: boolean
  onClose: () => void
  onNavigateToRadicados: () => void
}

const CommercialNotificationPanel = ({
  isOpen,
  onClose,
  onNavigateToRadicados,
}: CommercialNotificationPanelProps) => {
  const [notifications, setNotifications] = useState<CommercialNotification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      fetchNotifications()
    }
  }, [isOpen])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const data = await getCommercialNotifications()
      setNotifications(data)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (notificationId: string) => {
    await markNotificationAsRead(notificationId)
    setNotifications(prev =>
      prev.map(n => (n._id === notificationId ? { ...n, isRead: true } : n))
    )
  }

  const handleMarkAllAsRead = async () => {
    await markAllNotificationsAsRead()
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
  }

  const handleNotificationClick = async (notification: CommercialNotification) => {
    if (!notification.isRead) {
      await handleMarkAsRead(notification._id)
    }
    if (notification.type === 'CREDIT_RETURNED' && notification.creditId) {
      onNavigateToRadicados()
      onClose()
    }
  }

  const getNotificationIcon = (type: CommercialNotification['type']) => {
    switch (type) {
      case 'CREDIT_RETURNED':
        return '↩️'
      case 'CREDIT_APPROVED':
        return '✅'
      case 'CREDIT_REJECTED':
        return '❌'
      case 'CREDIT_DISBURSED':
        return '💰'
      default:
        return '📢'
    }
  }

  const getNotificationColor = (type: CommercialNotification['type']) => {
    switch (type) {
      case 'CREDIT_RETURNED':
        return 'border-l-orange-500 bg-orange-50'
      case 'CREDIT_APPROVED':
        return 'border-l-green-500 bg-green-50'
      case 'CREDIT_REJECTED':
        return 'border-l-red-500 bg-red-50'
      case 'CREDIT_DISBURSED':
        return 'border-l-emerald-500 bg-emerald-50'
      default:
        return 'border-l-blue-500 bg-blue-50'
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `Hace ${diffMins} min`
    if (diffHours < 24) return `Hace ${diffHours} horas`
    if (diffDays < 7) return `Hace ${diffDays} días`
    return date.toLocaleDateString('es-CO')
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className='fixed inset-0 bg-black/30 z-40'
        onClick={onClose}
      />

      {/* Panel */}
      <div className='fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col animate-slide-in-right'>
        {/* Header */}
        <div className='bg-gradient-to-r from-purple-600 to-purple-700 p-4 text-white'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <span className='text-2xl'>🔔</span>
              <div>
                <h2 className='text-lg font-bold'>Notificaciones</h2>
                {unreadCount > 0 && (
                  <p className='text-sm text-purple-200'>
                    {unreadCount} sin leer
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className='p-2 hover:bg-white/20 rounded-lg transition'
            >
              <svg className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className='mt-3 text-sm text-purple-200 hover:text-white transition underline'
            >
              Marcar todas como leídas
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className='flex-1 overflow-y-auto'>
          {loading ? (
            <div className='flex items-center justify-center h-32'>
              <div className='w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin' />
            </div>
          ) : notifications.length === 0 ? (
            <div className='flex flex-col items-center justify-center h-64 text-gray-500'>
              <span className='text-5xl mb-4'>📭</span>
              <p className='font-semibold'>No hay notificaciones</p>
              <p className='text-sm'>Te avisaremos cuando haya novedades</p>
            </div>
          ) : (
            <div className='divide-y'>
              {notifications.map(notification => (
                <div
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 border-l-4 cursor-pointer transition-all hover:shadow-md ${
                    getNotificationColor(notification.type)
                  } ${!notification.isRead ? 'bg-opacity-100' : 'bg-opacity-30'}`}
                >
                  <div className='flex items-start gap-3'>
                    <span className='text-2xl'>{getNotificationIcon(notification.type)}</span>
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center justify-between gap-2'>
                        <h3 className={`font-semibold text-gray-900 ${!notification.isRead ? '' : 'font-normal'}`}>
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <span className='w-2 h-2 bg-purple-600 rounded-full flex-shrink-0' />
                        )}
                      </div>
                      <p className='text-sm text-gray-600 mt-1'>{notification.message}</p>

                      {notification.type === 'CREDIT_RETURNED' && notification.returnReason && (
                        <div className='mt-2 p-2 bg-white rounded border border-orange-200'>
                          <p className='text-xs font-semibold text-orange-800'>Motivo de devolución:</p>
                          <p className='text-xs text-orange-700 mt-1'>{notification.returnReason}</p>
                        </div>
                      )}

                      {notification.creditAmount && (
                        <p className='text-sm font-semibold text-purple-700 mt-2'>
                          Monto: ${notification.creditAmount.toLocaleString('es-CO')}
                        </p>
                      )}

                      <p className='text-xs text-gray-400 mt-2'>
                        {formatTimeAgo(notification.createdAt)}
                        {notification.returnedBy && ` • ${notification.returnedBy}`}
                      </p>
                    </div>
                  </div>

                  {notification.type === 'CREDIT_RETURNED' && (
                    <div className='mt-3 flex justify-end'>
                      <button className='text-sm text-purple-600 font-semibold hover:text-purple-800 transition flex items-center gap-1'>
                        Ver en Radicados
                        <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </>
  )
}

export default CommercialNotificationPanel

