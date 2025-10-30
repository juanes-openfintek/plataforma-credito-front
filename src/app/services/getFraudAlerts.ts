import axios from 'axios';
import { FraudCheckResult } from './checkUserFraud';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const SECURITY_TOKEN = process.env.NEXT_PUBLIC_SECURITY_TOKEN;

export default async function getFraudAlerts(
  token: string,
  filters?: {
    riskLevel?: string;
    recommendation?: string;
    resolved?: boolean;
    page?: number;
    limit?: number;
  }
) {
  try {
    const queryParams = new URLSearchParams();
    if (filters?.riskLevel) queryParams.append('riskLevel', filters.riskLevel);
    if (filters?.recommendation) queryParams.append('recommendation', filters.recommendation);
    if (filters?.resolved !== undefined) queryParams.append('resolved', String(filters.resolved));
    if (filters?.page) queryParams.append('page', filters.page.toString());
    if (filters?.limit) queryParams.append('limit', filters.limit.toString());

    const url = `${BACKEND_URL}/fraud/alerts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-security-token': SECURITY_TOKEN,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('❌ Error fetching fraud alerts:', error.response?.data || error.message);
    throw error;
  }
}


