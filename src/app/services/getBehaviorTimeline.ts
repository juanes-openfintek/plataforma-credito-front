import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const SECURITY_TOKEN = process.env.NEXT_PUBLIC_SECURITY_TOKEN;

export interface BehaviorEvent {
  _id: string;
  userId: string;
  eventType: string;
  ipAddress: string;
  deviceInfo: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  isAnomaly: boolean;
  anomalyReason?: string;
  createdAt: string;
}

export default async function getBehaviorTimeline(
  token: string,
  userId: string,
  filters?: {
    eventType?: string;
    riskLevel?: string;
    page?: number;
    limit?: number;
  }
) {
  try {
    const queryParams = new URLSearchParams();
    if (filters?.eventType) queryParams.append('eventType', filters.eventType);
    if (filters?.riskLevel) queryParams.append('riskLevel', filters.riskLevel);
    if (filters?.page) queryParams.append('page', filters.page.toString());
    if (filters?.limit) queryParams.append('limit', filters.limit.toString());

    const url = `${BACKEND_URL}/behavior/${userId}/timeline${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-security-token': SECURITY_TOKEN,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('❌ Error fetching behavior timeline:', error.response?.data || error.message);
    throw error;
  }
}


