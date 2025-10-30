import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const SECURITY_TOKEN = process.env.NEXT_PUBLIC_SECURITY_TOKEN;

export interface AuditStatistics {
  totalLogs: number;
  topActions: Array<{ _id: string; count: number }>;
  bySeverity: Array<{ _id: string; count: number }>;
  byStatus: Array<{ _id: string; count: number }>;
  byResourceType: Array<{ _id: string; count: number }>;
}

/**
 * Get audit statistics
 * @param token - User authentication token
 * @param startDate - Optional start date filter
 * @param endDate - Optional end date filter
 * @returns Promise with audit statistics
 */
export default async function getAuditStatistics(
  token: string,
  startDate?: string,
  endDate?: string
): Promise<AuditStatistics> {
  try {
    const queryParams = new URLSearchParams();
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);

    const url = `${BACKEND_URL}/audit/statistics${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-security-token': SECURITY_TOKEN,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('❌ Error fetching audit statistics:', error.response?.data || error.message);
    throw error;
  }
}


