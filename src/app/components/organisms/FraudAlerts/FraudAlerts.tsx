'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import getFraudAlerts from '../../../services/getFraudAlerts';
import resolveFraudAlert from '../../../services/resolveFraudAlert';
import { FraudCheckResult } from '../../../services/checkUserFraud';

interface FraudAlertsProps {
  showResolved?: boolean;
  onAlertResolved?: () => void;
}

const FraudAlerts: React.FC<FraudAlertsProps> = ({
  showResolved = false,
  onAlertResolved
}) => {
  const { data: session } = useSession() as { data: any };
  const [alerts, setAlerts] = useState<FraudCheckResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<string>('');
  const [selectedRecommendation, setSelectedRecommendation] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Resolution modal
  const [resolvingAlert, setResolvingAlert] = useState<FraudCheckResult | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [resolutionAction, setResolutionAction] = useState<'APPROVED' | 'REJECTED'>('APPROVED');

  useEffect(() => {
    if (session?.accessToken) {
      loadAlerts();
    }
  }, [session, selectedRiskLevel, selectedRecommendation, currentPage]);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters: any = {
        page: currentPage,
        limit: 20,
        resolved: showResolved,
      };

      if (selectedRiskLevel) filters.riskLevel = selectedRiskLevel;
      if (selectedRecommendation) filters.recommendation = selectedRecommendation;

      const data = await getFraudAlerts(session!.accessToken, filters);

      setAlerts(data.checks || data);
      setTotalPages(data.totalPages || 1);
    } catch (err: any) {
      console.error('Error loading fraud alerts:', err);
      setError(err.message || 'Error cargando alertas de fraude');
    } finally {
      setLoading(false);
    }
  };

  const handleResolveAlert = async () => {
    if (!resolvingAlert || !session?.user) return;

    try {
      await resolveFraudAlert(
        session.accessToken,
        resolvingAlert._id,
        {
          resolvedBy: session.user.id || session.user.email,
          resolution: resolutionAction,
          notes: resolutionNotes,
        }
      );

      setResolvingAlert(null);
      setResolutionNotes('');
      loadAlerts();

      if (onAlertResolved) {
        onAlertResolved();
      }
    } catch (err: any) {
      console.error('Error resolving alert:', err);
      alert('Error al resolver la alerta: ' + (err.message || 'Error desconocido'));
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'bg-green-100 text-green-800 border-green-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'APPROVE': return 'text-green-600';
      case 'REVIEW': return 'text-yellow-600';
      case 'REJECT': return 'text-orange-600';
      case 'BLOCK': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getScoreColor = (score: number) => {
    if (score < 30) return 'text-green-600';
    if (score < 50) return 'text-yellow-600';
    if (score < 70) return 'text-orange-600';
    return 'text-red-600';
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
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recomendación
            </label>
            <select
              value={selectedRecommendation}
              onChange={(e) => {
                setSelectedRecommendation(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las recomendaciones</option>
              <option value="APPROVE">Aprobar</option>
              <option value="REVIEW">Revisar</option>
              <option value="REJECT">Rechazar</option>
              <option value="BLOCK">Bloquear</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
            {showResolved ? 'No hay alertas resueltas' : 'No hay alertas activas'}
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert._id}
              className={`bg-white rounded-lg shadow-sm p-6 border-l-4 ${
                getRiskLevelColor(alert.riskLevel).split(' ')[2]
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      getRiskLevelColor(alert.riskLevel)
                    }`}>
                      {alert.riskLevel}
                    </span>
                    <span className="text-sm text-gray-600">
                      {alert.checkType.replace(/_/g, ' ')}
                    </span>
                    {alert.resolvedAt && (
                      <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                        ✓ Resuelto
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <div className="text-sm text-gray-600">Puntuación de Fraude</div>
                      <div className={`text-2xl font-bold ${getScoreColor(alert.fraudScore)}`}>
                        {alert.fraudScore}/100
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Recomendación</div>
                      <div className={`text-xl font-semibold ${getRecommendationColor(alert.recommendation)}`}>
                        {alert.recommendation}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">Detalles:</div>
                  <div className="text-sm text-gray-600">{alert.details}</div>
                </div>

                {alert.flags.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Indicadores:</div>
                    <div className="flex flex-wrap gap-2">
                      {alert.flags.map((flag, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 rounded bg-red-50 text-red-700 border border-red-200"
                        >
                          🚩 {flag.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {alert.resolvedAt && alert.resolution && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-sm font-medium text-gray-700 mb-1">Resolución:</div>
                    <div className="text-sm text-gray-600">
                      <div>Acción: <span className="font-medium">{alert.resolution}</span></div>
                      <div>Por: {alert.resolvedBy}</div>
                      <div>Fecha: {new Date(alert.resolvedAt).toLocaleString('es-CO')}</div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    Verificado: {new Date(alert.checkedAt).toLocaleString('es-CO')}
                  </div>

                  {!alert.resolvedAt && (
                    <button
                      onClick={() => setResolvingAlert(alert)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                    >
                      Resolver
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
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

      {/* Resolution Modal */}
      {resolvingAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Resolver Alerta de Fraude</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Acción
                </label>
                <select
                  value={resolutionAction}
                  onChange={(e) => setResolutionAction(e.target.value as 'APPROVED' | 'REJECTED')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="APPROVED">Aprobar</option>
                  <option value="REJECTED">Rechazar</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas (opcional)
                </label>
                <textarea
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Agregar notas sobre la resolución..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setResolvingAlert(null);
                  setResolutionNotes('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleResolveAlert}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FraudAlerts;
