'use client'

import { useState, useEffect } from 'react';
import getUnreadCount from '../../../services/getUnreadCount';

interface NotificationBellProps {
  token: string;
  onClick: () => void;
  autoRefresh?: boolean;
  refreshInterval?: number; // in seconds
}

/**
 * NotificationBell component displays a bell icon with unread count badge
 * Automatically refreshes the unread count at specified intervals
 * @example <NotificationBell token={userToken} onClick={handleOpen} autoRefresh />
 */
const NotificationBell = ({
  token,
  onClick,
  autoRefresh = true,
  refreshInterval = 30
}: NotificationBellProps) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchUnreadCount = async () => {
    try {
      setLoading(true);
      const count = await getUnreadCount(token);
      setUnreadCount(count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUnreadCount();
    }
  }, [token]);

  // Auto-refresh functionality
  useEffect(() => {
    if (autoRefresh && token) {
      const interval = setInterval(() => {
        fetchUnreadCount();
      }, refreshInterval * 1000);

      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, token]);

  return (
    <button
      onClick={onClick}
      className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-color"
      aria-label={`Notificaciones${unreadCount > 0 ? ` (${unreadCount} sin leer)` : ''}`}
    >
      {/* Bell Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-gray-700"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>

      {/* Badge with unread count */}
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1 text-xs font-bold text-white bg-red-500 rounded-full animate-pulse">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}

      {/* Loading indicator */}
      {loading && (
        <span className="absolute -bottom-1 -right-1 w-3 h-3">
          <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary-color"></span>
        </span>
      )}
    </button>
  );
};

export default NotificationBell;
