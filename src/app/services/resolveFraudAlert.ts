import axios from 'axios';
import { FraudCheckResult } from './checkUserFraud';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const SECURITY_TOKEN = process.env.NEXT_PUBLIC_SECURITY_TOKEN;

export interface ResolveFraudDto {
  resolvedBy: string;
  resolution: string;
  notes?: string;
}

export default async function resolveFraudAlert(
  token: string,
  checkId: string,
  resolveData: ResolveFraudDto
): Promise<FraudCheckResult> {
  try {
    const url = `${BACKEND_URL}/fraud/resolve/${checkId}`;

    const response = await axios.patch(url, resolveData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-security-token': SECURITY_TOKEN,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('❌ Error resolving fraud alert:', error.response?.data || error.message);
    throw error;
  }
}


