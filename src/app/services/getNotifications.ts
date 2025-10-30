import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const SECURITY_TOKEN = process.env.NEXT_PUBLIC_SECURITY_TOKEN;

export interface Notification {
  _id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  resourceType?: string;
  resourceId?: string;
  actionUrl?: string;
  actionText?: string;
  isRead: boolean;
  readAt?: string;
  isDismissed: boolean;
  metadata?: string;
  icon: string;
  category: 'CREDIT' | 'PAYMENT' | 'SYSTEM' | 'ACCOUNT' | 'SECURITY';
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  total: number;
  unreadCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface QueryNotificationsParams {
  category?: 'CREDIT' | 'PAYMENT' | 'SYSTEM' | 'ACCOUNT' | 'SECURITY';
  priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  isRead?: boolean;
  page?: number;
  limit?: number;
}

/**
 * Get user notifications with filters and pagination
 * @param token - User authentication token
 * @param params - Query parameters for filtering
 * @returns Promise with notifications and pagination info
 */
export default async function getNotifications(
  token: string,
  params?: QueryNotificationsParams
): Promise<NotificationsResponse> {
  try {
    const queryParams = new URLSearchParams();

    if (params?.category) queryParams.append('category', params.category);
    if (params?.priority) queryParams.append('priority', params.priority);
    if (params?.isRead !== undefined) queryParams.append('isRead', params.isRead.toString());
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const url = `${BACKEND_URL}/notifications${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-security-token': SECURITY_TOKEN,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('❌ Error fetching notifications:', error.response?.data || error.message);
    throw error;
  }
}


