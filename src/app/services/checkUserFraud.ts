import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const SECURITY_TOKEN = process.env.NEXT_PUBLIC_SECURITY_TOKEN;

export interface FraudCheckResult {
  _id: string;
  checkType: 'USER_VERIFICATION' | 'CREDIT_APPLICATION' | 'PAYMENT_TRANSACTION' | 'DOCUMENT_UPLOAD';
  resourceId: string;
  userId: string;
  fraudScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  flags: string[];
  recommendation: 'APPROVE' | 'REVIEW' | 'REJECT' | 'BLOCK';
  details: string;
  checkedAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolution?: string;
}

export default async function checkUserFraud(
  token: string,
  userId: string
): Promise<FraudCheckResult> {
  try {
    const url = `${BACKEND_URL}/fraud/check/user/${userId}`;

    const response = await axios.post(url, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-security-token': SECURITY_TOKEN,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('❌ Error checking user fraud:', error.response?.data || error.message);
    throw error;
  }
}


