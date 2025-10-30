import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const SECURITY_TOKEN = process.env.NEXT_PUBLIC_SECURITY_TOKEN;

export interface OnboardingSession {
  _id: string;
  userId: string;
  sessionId: string;
  stage: number;
  completionPercentage: number;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED' | 'FAILED';
  documents?: {
    dni: {
      uploaded: boolean;
      verified: boolean;
      url?: string;
      uploadedAt?: string;
    };
    selfie: {
      uploaded: boolean;
      verified: boolean;
      url?: string;
      uploadedAt?: string;
    };
    proof: {
      uploaded: boolean;
      verified: boolean;
      url?: string;
      uploadedAt?: string;
    };
  };
  biometry?: {
    faceMatchScore: number;
    livenessCheck: {
      passed: boolean;
      confidence: number;
    };
    biometryStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
    selfieUrl?: string;
    timestamp: string;
  };
  employmentCompleted: boolean;
  bankingCompleted: boolean;
  completedAt?: string;
  ipAddress?: string;
  deviceInfo?: string;
  failureReason?: string;
  metadata?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StartOnboardingDto {
  userId: string;
  ipAddress?: string;
  deviceInfo?: string;
}

export default async function startOnboarding(
  token: string,
  data: StartOnboardingDto
): Promise<OnboardingSession> {
  try {
    const url = `${BACKEND_URL}/onboarding/start`;

    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-security-token': SECURITY_TOKEN,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('❌ Error starting onboarding:', error.response?.data || error.message);
    throw error;
  }
}


