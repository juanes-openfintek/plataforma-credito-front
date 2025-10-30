'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import getNotifications, { Notification, QueryNotificationsParams } from '../../../services/getNotifications';
import markNotificationAsRead from '../../../services/markNotificationAsRead';
import markAllAsRead from '../../../services/markAllAsRead';
import dismissNotification from '../../../services/dismissNotification';

interface NotificationListProps {
  token: string;
  filters?: QueryNotificationsParams;
  showFilters?: boolean;
  maxHeight?: string;
}

/**
 * NotificationList component displays user notifications with actions
 * Supports filtering, mark as read, and dismiss actions
 * @example <NotificationList token={userToken} showFilters maxHeight="600px" />
 */
const NotificationList = ({
  token,
  filters,
  showFilters = false,
  maxHeight = '500px'
}: NotificationListProps) => {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [localFilters, setLocalFilters] = useState<QueryNotificationsParams>(filters || {});

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getNotifications(token, {
        ...localFilters,
        limit: 50,
      });

      setNotifications(response.notifications);
      setUnreadCount(response.unreadCount);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar notificaciones');
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchNotifications();
    }
  }, [token, localFilters]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(token, notificationId);
      // Update local state
      setNotifications(prev =>
        prev.map(n => n._id === notificationId ? { ...n, isRead: true, readAt: new Date().toISOString() } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead(token);
      // Update local state
      setNotifications(prev =>
        prev.map(n => ({ ...n, isRead: true, readAt: new Date().toISOString() }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleDismiss = async (notificationId: string) => {
    try {
      await dismissNotification(token, notificationId);
      // Remove from local state
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
    } catch (error) {
      console.error('Error dismissing notification:', error);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read
    if (!notification.isRead) {
      await handleMarkAsRead(notification._id);
    }

    // Navigate if actionUrl is provided
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'border-l-red-500 bg-red-50';
      case 'HIGH':
        return 'border-l-orange-500 bg-orange-50';
      case 'NORMAL':
        return 'border-l-blue-500 bg-blue-50';
      case 'LOW':
        return 'border-l-gray-500 bg-gray-50';
      default:
        return 'border-l-gray-500 bg-white';
    }
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;

    return new Intl.DateTimeFormat('es-CO', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  if (loading && notifications.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-color"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600 text-sm">{error}</p>
        <button
          onClick={fetchNotifications}
          className="mt-2 text-sm text-red-700 underline hover:text-red-900"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div>
          <h3 className="font-semibold text-gray-900">Notificaciones</h3>
          {unreadCount > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              {unreadCount} sin leer
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-xs text-primary-color hover:text-primary-color/80 font-medium"
            >
              Marcar todas como leídas
            </button>
          )}
        </div>
      </div>

      {/* Filters (if enabled) */}
      {showFilters && (
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex gap-2">
            <select
              value={localFilters.category || ''}
              onChange={(e) => setLocalFilters({ ...localFilters, category: e.target.value as any || undefined })}
              className="text-sm px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color"
            >
              <option value="">Todas las categorías</option>
              <option value="CREDIT">Créditos</option>
              <option value="PAYMENT">Pagos</option>
              <option value="SYSTEM">Sistema</option>
              <option value="ACCOUNT">Cuenta</option>
              <option value="SECURITY">Seguridad</option>
            </select>

            <select
              value={localFilters.isRead !== undefined ? localFilters.isRead.toString() : ''}
              onChange={(e) => setLocalFilters({
                ...localFilters,
                isRead: e.target.value === '' ? undefined : e.target.value === 'true'
              })}
              className="text-sm px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color"
            >
              <option value="">Todas</option>
              <option value="false">No leídas</option>
              <option value="true">Leídas</option>
            </select>
          </div>
        </div>
      )}

      {/* Notification List */}
      <div
        className="overflow-y-auto"
        style={{ maxHeight }}
      >
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔔</div>
            <p className="text-gray-500">No tienes notificaciones</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`flex items-start gap-3 p-4 border-l-4 transition-colors ${getPriorityColor(notification.priority)} ${
                  !notification.isRead ? 'bg-opacity-100' : 'bg-opacity-50'
                } ${notification.actionUrl ? 'cursor-pointer hover:bg-opacity-75' : ''}`}
                onClick={() => handleNotificationClick(notification)}
              >
                {/* Icon */}
                <div className="flex-shrink-0 text-2xl">
                  {notification.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className={`text-sm font-semibold ${!notification.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
                        {notification.title}
                      </h4>
                      <p className={`text-sm mt-1 ${!notification.isRead ? 'text-gray-700' : 'text-gray-500'}`}>
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-gray-400">
                          {formatRelativeTime(notification.createdAt)}
                        </span>
                        {notification.category && (
                          <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full">
                            {notification.category}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      {!notification.isRead && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(notification._id);
                          }}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Marcar como leída"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDismiss(notification._id);
                        }}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Descartar"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Action Button */}
                  {notification.actionText && notification.actionUrl && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNotificationClick(notification);
                      }}
                      className="mt-3 text-sm font-medium text-primary-color hover:text-primary-color/80"
                    >
                      {notification.actionText} →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationList;
