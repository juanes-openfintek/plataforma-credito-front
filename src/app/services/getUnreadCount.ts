import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const SECURITY_TOKEN = process.env.NEXT_PUBLIC_SECURITY_TOKEN;

/**
 * Get unread notification count
 * @param token - User authentication token
 * @returns Promise with unread count
 */
export default async function getUnreadCount(token: string): Promise<number> {
  try {
    const url = `${BACKEND_URL}/notifications/unread-count`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-security-token': SECURITY_TOKEN,
      },
    });

    return response.data.unreadCount;
  } catch (error: any) {
    console.error('❌ Error fetching unread count:', error.response?.data || error.message);
    throw error;
  }
}


