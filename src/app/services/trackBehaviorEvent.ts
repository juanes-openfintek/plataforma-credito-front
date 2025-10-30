import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const SECURITY_TOKEN = process.env.NEXT_PUBLIC_SECURITY_TOKEN;

export interface TrackEventDto {
  userId: string;
  eventType: 'LOGIN' | 'LOGOUT' | 'CREDIT_REQUEST' | 'PROFILE_UPDATE' |
            'PASSWORD_CHANGE' | 'PAYMENT' | 'DOCUMENT_UPLOAD' | 'API_CALL' |
            'FAILED_LOGIN' | 'ACCOUNT_LOCKED' | 'SESSION_EXPIRED' | 'OTHER';
  ipAddress?: string;
  deviceInfo?: string;
  sessionId?: string;
  metadata?: Record<string, any>;
}

export default async function trackBehaviorEvent(
  token: string,
  eventData: TrackEventDto
) {
  try {
    const url = `${BACKEND_URL}/behavior/track`;

    const response = await axios.post(url, eventData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-security-token': SECURITY_TOKEN,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('❌ Error tracking behavior event:', error.response?.data || error.message);
    throw error;
  }
}


