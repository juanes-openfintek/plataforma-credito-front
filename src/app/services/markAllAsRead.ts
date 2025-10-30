import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const SECURITY_TOKEN = process.env.NEXT_PUBLIC_SECURITY_TOKEN;

/**
 * Mark all notifications as read
 * @param token - User authentication token
 * @returns Promise with count of modified notifications
 */
export default async function markAllAsRead(token: string): Promise<{ modifiedCount: number }> {
  try {
    const url = `${BACKEND_URL}/notifications/read-all`;

    const response = await axios.patch(url, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-security-token': SECURITY_TOKEN,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('❌ Error marking all as read:', error.response?.data || error.message);
    throw error;
  }
}


