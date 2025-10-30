import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const SECURITY_TOKEN = process.env.NEXT_PUBLIC_SECURITY_TOKEN;

/**
 * Mark notification as read
 * @param token - User authentication token
 * @param notificationId - ID of the notification
 * @returns Promise with updated notification
 */
export default async function markNotificationAsRead(
  token: string,
  notificationId: string
): Promise<any> {
  try {
    const url = `${BACKEND_URL}/notifications/${notificationId}/read`;

    const response = await axios.patch(url, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-security-token': SECURITY_TOKEN,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('❌ Error marking notification as read:', error.response?.data || error.message);
    throw error;
  }
}


