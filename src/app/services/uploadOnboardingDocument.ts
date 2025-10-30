import axios from 'axios';
import { OnboardingSession } from './startOnboarding';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const SECURITY_TOKEN = process.env.NEXT_PUBLIC_SECURITY_TOKEN;

export default async function uploadOnboardingDocument(
  token: string,
  sessionId: string,
  documentType: 'dni' | 'selfie' | 'proof',
  fileUrl: string
): Promise<OnboardingSession> {
  try {
    const url = `${BACKEND_URL}/onboarding/${sessionId}/upload`;

    const response = await axios.post(
      url,
      {
        documentType,
        fileUrl,
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
    console.error('âŒ Error uploading onboarding document:', error.response?.data || error.message);
    throw error;
  }
}


