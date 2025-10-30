import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const SECURITY_TOKEN = process.env.NEXT_PUBLIC_SECURITY_TOKEN;

export interface AuditLog {
  _id: string;
  action: string;
  resourceType: string;
  resourceId: string;
  userId: {
    _id: string;
    name: string;
    lastname: string;
    email: string;
  };
  userEmail: string;
  userRole: string;
  ipAddress?: string;
  userAgent?: string;
  description: string;
  previousState?: string;
  newState?: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  errorMessage?: string;
  metadata?: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  createdAt: string;
  updatedAt: string;
}

export interface AuditLogsResponse {
  logs: AuditLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface QueryAuditLogsParams {
  action?: string;
  resourceType?: string;
  resourceId?: string;
  userId?: string;
  userEmail?: string;
  status?: 'SUCCESS' | 'FAILED' | 'PENDING';
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

/**
 * Get audit logs with filters and pagination
 * @param token - User authentication token
 * @param params - Query parameters for filtering
 * @returns Promise with audit logs and pagination info
 */
export default async function getAuditLogs(
  token: string,
  params?: QueryAuditLogsParams
): Promise<AuditLogsResponse> {
  try {
    const queryParams = new URLSearchParams();

    if (params?.action) queryParams.append('action', params.action);
    if (params?.resourceType) queryParams.append('resourceType', params.resourceType);
    if (params?.resourceId) queryParams.append('resourceId', params.resourceId);
    if (params?.userId) queryParams.append('userId', params.userId);
    if (params?.userEmail) queryParams.append('userEmail', params.userEmail);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.severity) queryParams.append('severity', params.severity);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const url = `${BACKEND_URL}/audit${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-security-token': SECURITY_TOKEN,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('❌ Error fetching audit logs:', error.response?.data || error.message);
    throw error;
  }
}


