import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const SECURITY_TOKEN = process.env.NEXT_PUBLIC_SECURITY_TOKEN;

export interface BehaviorAnomaly {
  _id: string;
  userId: string;
  eventType: string;
  ipAddress: string;
  deviceInfo: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  isAnomaly: boolean;
  anomalyReason: string;
  createdAt: string;
}

export default async function getBehaviorAnomalies(
  token: string,
  userId: string,
  daysBack: number = 30
) {
  try {
    const url = `${BACKEND_URL}/behavior/${userId}/anomalies?daysBack=${daysBack}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-security-token': SECURITY_TOKEN,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('❌ Error fetching behavior anomalies:', error.response?.data || error.message);
    throw error;
  }
}


