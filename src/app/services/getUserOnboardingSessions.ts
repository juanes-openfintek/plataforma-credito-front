import axios from 'axios';
import { OnboardingSession } from './startOnboarding';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const SECURITY_TOKEN = process.env.NEXT_PUBLIC_SECURITY_TOKEN;

export default async function getUserOnboardingSessions(
  token: string,
  userId: string
): Promise<OnboardingSession[]> {
  try {
    const url = `${BACKEND_URL}/onboarding/user/${userId}/sessions`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-security-token': SECURITY_TOKEN,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('❌ Error fetching user onboarding sessions:', error.response?.data || error.message);
    throw error;
  }
}


