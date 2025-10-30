import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const SECURITY_TOKEN = process.env.NEXT_PUBLIC_SECURITY_TOKEN;

/**
 * Dismiss (delete) notification
 * @param token - User authentication token
 * @param notificationId - ID of the notification
 * @returns Promise with dismissed notification
 */
export default async function dismissNotification(
  token: string,
  notificationId: string
): Promise<any> {
  try {
    const url = `${BACKEND_URL}/notifications/${notificationId}`;

    const response = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-security-token': SECURITY_TOKEN,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('❌ Error dismissing notification:', error.response?.data || error.message);
    throw error;
  }
}


