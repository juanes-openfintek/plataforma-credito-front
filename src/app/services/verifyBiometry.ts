import axios from 'axios';
import { OnboardingSession } from './startOnboarding';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const SECURITY_TOKEN = process.env.NEXT_PUBLIC_SECURITY_TOKEN;

export default async function verifyBiometry(
  token: string,
  sessionId: string
): Promise<OnboardingSession> {
  try {
    const url = `${BACKEND_URL}/onboarding/${sessionId}/biometry`;

    const response = await axios.post(
      url,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-security-token': SECURITY_TOKEN,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('âŒ Error verifying biometry:', error.response?.data || error.message);
    throw error;
  }
}


