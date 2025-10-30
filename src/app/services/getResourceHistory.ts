import axios from 'axios';
import { AuditLog } from './getAuditLogs';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const SECURITY_TOKEN = process.env.NEXT_PUBLIC_SECURITY_TOKEN;

/**
 * Get audit history for a specific resource
 * @param token - User authentication token
 * @param resourceType - Type of resource (CREDIT, USER, etc.)
 * @param resourceId - ID of the resource
 * @returns Promise with array of audit logs
 */
export default async function getResourceHistory(
  token: string,
  resourceType: string,
  resourceId: string
): Promise<AuditLog[]> {
  try {
    const url = `${BACKEND_URL}/audit/resource/${resourceType}/${resourceId}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-security-token': SECURITY_TOKEN,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('❌ Error fetching resource history:', error.response?.data || error.message);
    throw error;
  }
}


