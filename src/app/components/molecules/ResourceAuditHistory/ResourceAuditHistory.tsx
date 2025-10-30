'use client'

import { useState, useEffect } from 'react';
import getResourceHistory from '../../../services/getResourceHistory';
import { AuditLog } from '../../../services/getAuditLogs';

interface ResourceAuditHistoryProps {
  token: string;
  resourceType: string;
  resourceId: string;
  title?: string;
}

/**
 * ResourceAuditHistory component displays audit history for a specific resource
 * Shows a timeline of all actions performed on the resource
 * @example <ResourceAuditHistory token={userToken} resourceType="CREDIT" resourceId="123" />
 */
const ResourceAuditHistory = ({
  token,
  resourceType,
  resourceId,
  title = 'Historial de Auditoría'
}: ResourceAuditHistoryProps) => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getResourceHistory(token, resourceType, resourceId);
      setLogs(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar el historial');
      console.error('Error fetching resource history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && resourceType && resourceId) {
      fetchHistory();
    }
  }, [token, resourceType, resourceId]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-500';
      case 'HIGH':
        return 'bg-orange-500';
      case 'MEDIUM':
        return 'bg-yellow-500';
      case 'LOW':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Hace un momento';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    if (diffDays < 7) return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
    return formatDate(dateString);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-color"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{error}</p>
          <button
            onClick={fetchHistory}
            className="mt-2 text-sm text-red-700 underline hover:text-red-900"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <p className="text-gray-500 text-center py-8">
          No hay historial de auditoría disponible
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className="text-sm text-gray-500">{logs.length} eventos</span>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[17px] top-0 bottom-0 w-0.5 bg-gray-200"></div>

        {/* Timeline items */}
        <div className="space-y-6">
          {logs.map((log, index) => (
            <div key={log._id} className="relative pl-12">
              {/* Timeline dot */}
              <div
                className={`absolute left-0 top-1 w-9 h-9 rounded-full ${getSeverityColor(log.severity)} flex items-center justify-center shadow-md`}
              >
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>

              {/* Content */}
              <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{log.action}</h4>
                    <p className="text-sm text-gray-600 mt-1">{log.description}</p>
                  </div>
                  <span
                    className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                      log.status === 'SUCCESS'
                        ? 'bg-green-100 text-green-800'
                        : log.status === 'FAILED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {log.status}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-500 mt-3">
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Usuario:</span>
                    <span>
                      {log.userId?.name} {log.userId?.lastname}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Rol:</span>
                    <span>{log.userRole}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Fecha:</span>
                    <span title={formatDate(log.createdAt)}>
                      {formatRelativeTime(log.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Show state changes if available */}
                {(log.previousState || log.newState) && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      {log.previousState && (
                        <div>
                          <span className="font-medium text-gray-600">Estado Anterior:</span>
                          <pre className="mt-1 bg-white p-2 rounded border border-gray-200 overflow-x-auto">
                            {JSON.stringify(JSON.parse(log.previousState), null, 2)}
                          </pre>
                        </div>
                      )}
                      {log.newState && (
                        <div>
                          <span className="font-medium text-gray-600">Estado Nuevo:</span>
                          <pre className="mt-1 bg-white p-2 rounded border border-gray-200 overflow-x-auto">
                            {JSON.stringify(JSON.parse(log.newState), null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Show metadata if available */}
                {log.metadata && (
                  <div className="mt-2 text-xs">
                    <span className="font-medium text-gray-600">Metadata:</span>
                    <pre className="mt-1 bg-white p-2 rounded border border-gray-200 overflow-x-auto">
                      {JSON.stringify(JSON.parse(log.metadata), null, 2)}
                    </pre>
                  </div>
                )}

                {/* Show error message if failed */}
                {log.status === 'FAILED' && log.errorMessage && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                    <span className="font-medium">Error:</span> {log.errorMessage}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResourceAuditHistory;
