import axios from 'axios';
import { OnboardingSession } from './startOnboarding';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const SECURITY_TOKEN = process.env.NEXT_PUBLIC_SECURITY_TOKEN;

export async function completeEmployment(
  token: string,
  sessionId: string,
  employmentData: {
    company?: string;
    position?: string;
    monthlyIncome?: number;
    employmentType?: string;
    yearsEmployed?: number;
  }
): Promise<OnboardingSession> {
  try {
    const url = `${BACKEND_URL}/onboarding/${sessionId}/employment`;

    const response = await axios.post(
      url,
      employmentData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-security-token': SECURITY_TOKEN,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Ã¢ÂÅ’ Error completing employment:', error.response?.data || error.message);
    throw error;
  }
}

export async function completeBanking(
  token: string,
  sessionId: string,
  bankingData: {
    bankName?: string;
    accountType?: string;
    accountNumber?: string;
    hasDebts?: boolean;
    monthlyDebts?: number;
  }
): Promise<OnboardingSession> {
  try {
    const url = `${BACKEND_URL}/onboarding/${sessionId}/banking`;

    const response = await axios.post(
      url,
      bankingData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-security-token': SECURITY_TOKEN,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Ã¢ÂÅ’ Error completing banking:', error.response?.data || error.message);
    throw error;
  }
}

export async function updateOnboardingStage(
  token: string,
  sessionId: string,
  stage: number
): Promise<OnboardingSession> {
  try {
    const url = `${BACKEND_URL}/onboarding/${sessionId}/stage`;

    const response = await axios.patch(
      url,
      {
        stage,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-security-token': SECURITY_TOKEN,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Ã¢ÂÅ’ Error updating onboarding stage:', error.response?.data || error.message);
    throw error;
  }
}


