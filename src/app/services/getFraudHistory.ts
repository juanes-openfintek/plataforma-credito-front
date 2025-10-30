import axios from 'axios';
import { FraudCheckResult } from './checkUserFraud';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const SECURITY_TOKEN = process.env.NEXT_PUBLIC_SECURITY_TOKEN;

export default async function getFraudHistory(
  token: string,
  userId: string,
  filters?: {
    checkType?: string;
    page?: number;
    limit?: number;
  }
) {
  try {
    const queryParams = new URLSearchParams();
    if (filters?.checkType) queryParams.append('checkType', filters.checkType);
    if (filters?.page) queryParams.append('page', filters.page.toString());
    if (filters?.limit) queryParams.append('limit', filters.limit.toString());

    const url = `${BACKEND_URL}/fraud/history/${userId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-security-token': SECURITY_TOKEN,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('❌ Error fetching fraud history:', error.response?.data || error.message);
    throw error;
  }
}


