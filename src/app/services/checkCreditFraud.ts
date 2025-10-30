import axios from 'axios';
import { FraudCheckResult } from './checkUserFraud';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const SECURITY_TOKEN = process.env.NEXT_PUBLIC_SECURITY_TOKEN;

export default async function checkCreditFraud(
  token: string,
  creditId: string
): Promise<FraudCheckResult> {
  try {
    const url = `${BACKEND_URL}/fraud/check/credit/${creditId}`;

    const response = await axios.post(url, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-security-token': SECURITY_TOKEN,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('❌ Error checking credit fraud:', error.response?.data || error.message);
    throw error;
  }
}


