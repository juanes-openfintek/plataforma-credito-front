import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const SECURITY_TOKEN = process.env.NEXT_PUBLIC_SECURITY_TOKEN;

export interface BehaviorAnalysis {
  behaviorScore: number;
  riskLevel: string;
  totalEvents: number;
  anomaliesCount: number;
  uniqueIPs: number;
  deviceChanges: number;
  suspiciousPatterns: string[];
  eventBreakdown: Record<string, number>;
}

export default async function analyzeBehavior(
  token: string,
  userId: string,
  daysBack: number = 30
): Promise<BehaviorAnalysis> {
  try {
    const url = `${BACKEND_URL}/behavior/${userId}/analysis?daysBack=${daysBack}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-security-token': SECURITY_TOKEN,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('❌ Error analyzing behavior:', error.response?.data || error.message);
    throw error;
  }
}


