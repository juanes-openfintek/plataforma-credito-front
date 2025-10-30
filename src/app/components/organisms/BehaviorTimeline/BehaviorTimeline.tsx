'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import getBehaviorTimeline, { BehaviorEvent } from '../../../services/getBehaviorTimeline';
import analyzeBehavior, { BehaviorAnalysis } from '../../../services/analyzeBehavior';

interface BehaviorTimelineProps {
  userId: string;
  showAnalysis?: boolean;
}

const BehaviorTimeline: React.FC<BehaviorTimelineProps> = ({
  userId,
  showAnalysis = true
}) => {
  const { data: session } = useSession() as { data: any };
  const [events, setEvents] = useState<BehaviorEvent[]>([]);
  const [analysis, setAnalysis] = useState<BehaviorAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedEventType, setSelectedEventType] = useState<string>('');
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (session?.accessToken) {
      loadData();
    }
  }, [session, userId, selectedEventType, selectedRiskLevel, currentPage]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters: any = {
        page: currentPage,
        limit: 20,
      };

      if (selectedEventType) filters.eventType = selectedEventType;
      if (selectedRiskLevel) filters.riskLevel = selectedRiskLevel;

      // Load events
      const timelineData = await getBehaviorTimeline(
        session!.accessToken,
        userId,
        filters
      );

      setEvents(timelineData.events || timelineData);
      setTotalPages(timelineData.totalPages || 1);

      // Load analysis if enabled
      if (showAnalysis) {
        const analysisData = await analyzeBehavior(
          session!.accessToken,
          userId,
          30
        );
        setAnalysis(analysisData);
      }
    } catch (err: any) {
      console.error('Error loading behavior data:', err);
      setError(err.message || 'Error cargando datos de comportamiento');
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'CRITICAL': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventIcon = (eventType: string) => {
    const icons: Record<string, string> = {
      LOGIN: '🔐',
      LOGOUT: '🚪',
      CREDIT_REQUEST: '💳',
      PROFILE_UPDATE: '✏️',
      PASSWORD_CHANGE: '🔑',
      PAYMENT: '💰',
      DOCUMENT_UPLOAD: '📄',
      API_CALL: '🔌',
      FAILED_LOGIN: '❌',
      ACCOUNT_LOCKED: '🔒',
      SESSION_EXPIRED: '⏱️',
      OTHER: '📌',
    };
    return icons[eventType] || '📌';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">⚠️ {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Analysis Summary */}
      {showAnalysis && analysis && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Análisis de Comportamiento</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {analysis.behaviorScore}
              </div>
              <div className="text-sm text-gray-600">Puntuación</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                analysis.riskLevel === 'LOW' ? 'text-green-600' :
                analysis.riskLevel === 'MEDIUM' ? 'text-yellow-600' :
                analysis.riskLevel === 'HIGH' ? 'text-orange-600' :
                'text-red-600'
              }`}>
                {analysis.riskLevel}
              </div>
              <div className="text-sm text-gray-600">Nivel de Riesgo</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {analysis.totalEvents}
              </div>
              <div className="text-sm text-gray-600">Eventos Totales</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">
                {analysis.anomaliesCount}
              </div>
              <div className="text-sm text-gray-600">Anomalías</div>
            </div>
          </div>

          {analysis.suspiciousPatterns.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2">Patrones Sospechosos:</h4>
              <div className="space-y-1">
                {analysis.suspiciousPatterns.map((pattern, idx) => (
                  <div key={idx} className="text-sm text-red-600 flex items-center gap-2">
                    <span>⚠️</span>
                    <span>{pattern}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Evento
            </label>
            <select
              value={selectedEventType}
              onChange={(e) => {
                setSelectedEventType(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los eventos</option>
              <option value="LOGIN">Login</option>
              <option value="LOGOUT">Logout</option>
              <option value="CREDIT_REQUEST">Solicitud de Crédito</option>
              <option value="PROFILE_UPDATE">Actualización de Perfil</option>
              <option value="PASSWORD_CHANGE">Cambio de Contraseña</option>
              <option value="PAYMENT">Pago</option>
              <option value="DOCUMENT_UPLOAD">Carga de Documento</option>
              <option value="FAILED_LOGIN">Login Fallido</option>
              <option value="ACCOUNT_LOCKED">Cuenta Bloqueada</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nivel de Riesgo
            </label>
            <select
              value={selectedRiskLevel}
              onChange={(e) => {
                setSelectedRiskLevel(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los niveles</option>
              <option value="LOW">Bajo</option>
              <option value="MEDIUM">Medio</option>
              <option value="HIGH">Alto</option>
              <option value="CRITICAL">Crítico</option>
            </select>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Línea de Tiempo</h3>

        {events.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No hay eventos para mostrar
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event._id}
                className={`border-l-4 pl-4 py-3 ${
                  event.isAnomaly ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="text-2xl">{getEventIcon(event.eventType)}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{event.eventType}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getRiskLevelColor(event.riskLevel)}`}>
                          {event.riskLevel}
                        </span>
                        {event.isAnomaly && (
                          <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">
                            ⚠️ Anomalía
                          </span>
                        )}
                      </div>

                      <div className="text-sm text-gray-600 space-y-1">
                        <div>IP: {event.ipAddress}</div>
                        <div>Dispositivo: {event.deviceInfo}</div>
                        {event.isAnomaly && event.anomalyReason && (
                          <div className="text-red-600 font-medium">
                            Razón: {event.anomalyReason}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right text-sm text-gray-500">
                    {new Date(event.createdAt).toLocaleString('es-CO')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
            >
              Anterior
            </button>
            <span className="text-sm text-gray-600">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BehaviorTimeline;
