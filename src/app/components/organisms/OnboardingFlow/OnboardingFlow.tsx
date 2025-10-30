'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import decryptData from '../../../helpers/decryptData';
import startOnboarding, { OnboardingSession } from '../../../services/startOnboarding';
import getOnboardingStatus from '../../../services/getOnboardingStatus';
import uploadOnboardingDocument from '../../../services/uploadOnboardingDocument';
import verifyBiometry from '../../../services/verifyBiometry';
import DocumentUpload from './DocumentUpload';
import BiometryVerification from './BiometryVerification';
import {
  completeEmployment,
  completeBanking,
  updateOnboardingStage,
} from '../../../services/completeOnboardingStep';
import finishOnboarding from '../../../services/finishOnboarding';

interface OnboardingFlowProps {
  userId: string | null;
  onComplete?: (session: OnboardingSession) => void;
}

type DocumentType = 'dni' | 'selfie' | 'proof';

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ userId, onComplete }) => {
  const { data: session, status } = useSession();
  const encryptedUser = session?.user as string | undefined;

  const decryptedUser = useMemo(() => {
    if (!encryptedUser || typeof encryptedUser !== 'string') {
      return null;
    }
    try {
      return decryptData(encryptedUser);
    } catch (error) {
      console.error('Error al descifrar la sesion mientras se iniciaba el onboarding:', error);
      return null;
    }
  }, [encryptedUser]);

  const authToken: string | undefined = decryptedUser?.token;
  const resolvedUserId = userId ?? decryptedUser?.uid ?? decryptedUser?.id ?? decryptedUser?._id ?? null;

  const [onboardingSession, setOnboardingSession] = useState<OnboardingSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStage, setCurrentStage] = useState(1);

  const [employmentData, setEmploymentData] = useState({
    company: '',
    position: '',
    monthlyIncome: '',
    employmentType: '',
    yearsEmployed: '',
  });

  const [bankingData, setBankingData] = useState({
    bankName: '',
    accountType: '',
    accountNumber: '',
    hasDebts: false,
    monthlyDebts: '',
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!authToken || !resolvedUserId) {
      setLoading(false);
      return;
    }
    initOnboarding();
  }, [status, authToken, resolvedUserId]);

  const initOnboarding = async () => {
    if (!authToken || !resolvedUserId) return;
    try {
      setLoading(true);
      setError(null);
      const deviceInfo = typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown';
      const sessionStarted = await startOnboarding(authToken, {
        userId: resolvedUserId,
        ipAddress: '0.0.0.0',
        deviceInfo,
      });
      setOnboardingSession(sessionStarted);
      setCurrentStage(sessionStarted.stage);
    } catch (err: any) {
      console.error('Error inicializando onboarding:', err);
      setError(err?.message ?? 'No fue posible iniciar el onboarding. Intentalo nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const refreshSession = async () => {
    if (!authToken || !onboardingSession) return;
    try {
      const updated = await getOnboardingStatus(authToken, onboardingSession.sessionId);
      setOnboardingSession(updated);
      setCurrentStage(updated.stage);
    } catch (err: any) {
      console.error('Error refrescando la sesion de onboarding:', err);
    }
  };

  const handleNextStage = async () => {
    if (!authToken || !onboardingSession) return;
    try {
      setLoading(true);
      const nextStage = currentStage + 1;
      await updateOnboardingStage(authToken, onboardingSession.sessionId, nextStage);
      await refreshSession();
    } catch (err: any) {
      console.error('Error avanzando al siguiente paso:', err);
      setError(err?.response?.data?.message ?? 'No fue posible avanzar al siguiente paso.');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadDocument = async (type: DocumentType, url: string): Promise<void> => {
    if (!authToken || !onboardingSession || !url) return;
    try {
      setLoading(true);
      await uploadOnboardingDocument(authToken, onboardingSession.sessionId, type, url);
      await refreshSession();
      setError(null);
    } catch (err: any) {
      console.error('Error subiendo documento de onboarding:', err);
      setError('No fue posible registrar el documento, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyBiometry = async () => {
    if (!authToken || !onboardingSession) return;
    try {
      setLoading(true);
      await verifyBiometry(authToken, onboardingSession.sessionId);
      await refreshSession();
    } catch (err: any) {
      console.error('Error verificando biometria:', err);
      setError('No fue posible completar la biometria.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteEmployment = async () => {
    if (!authToken || !onboardingSession) return;
    try {
      setLoading(true);
      await completeEmployment(authToken, onboardingSession.sessionId, {
        company: employmentData.company,
        position: employmentData.position,
        employmentType: employmentData.employmentType,
        monthlyIncome: Number(employmentData.monthlyIncome) || 0,
        yearsEmployed: Number(employmentData.yearsEmployed) || 0,
      });
      await refreshSession();
      handleNextStage();
    } catch (err: any) {
      console.error('Error registrando datos laborales:', err);
      setError('No fue posible guardar la informacion laboral.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteBanking = async () => {
    if (!authToken || !onboardingSession) return;
    try {
      setLoading(true);
      await completeBanking(authToken, onboardingSession.sessionId, {
        bankName: bankingData.bankName,
        accountType: bankingData.accountType,
        accountNumber: bankingData.accountNumber,
        hasDebts: bankingData.hasDebts,
        monthlyDebts: Number(bankingData.monthlyDebts) || 0,
      });
      await refreshSession();
      handleNextStage();
    } catch (err: any) {
      console.error('Error registrando datos bancarios:', err);
      setError('No fue posible guardar la informacion bancaria.');
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = async () => {
    if (!authToken || !onboardingSession) return;
    try {
      setLoading(true);
      const completed = await finishOnboarding(authToken, onboardingSession.sessionId);
      setOnboardingSession(completed);
      if (onComplete) {
        onComplete(completed);
      }
    } catch (err: any) {
      console.error('Error finalizando onboarding:', err);
      setError('No fue posible finalizar el onboarding.');
    } finally {
      setLoading(false);
    }
  };

  const documentsUploaded = {
    dni: onboardingSession?.documents?.dni?.uploaded ?? false,
    selfie: onboardingSession?.documents?.selfie?.uploaded ?? false,
    proof: onboardingSession?.documents?.proof?.uploaded ?? false,
  };

  const canAdvanceFromDocuments = documentsUploaded.dni && documentsUploaded.selfie && documentsUploaded.proof;
  const biometryCompleted = onboardingSession?.biometry?.biometryStatus === 'APPROVED';
  const employmentCompleted = onboardingSession?.employmentCompleted ?? false;
  const bankingCompleted = onboardingSession?.bankingCompleted ?? false;

  if (status === 'loading') {
    return <div className="p-8 text-center text-gray-600">Preparando tu onboarding...</div>;
  }

  if (!authToken || !resolvedUserId) {
    return (
      <div className="p-8 text-center text-gray-600">
        Inicia sesion para continuar con tu onboarding.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold">Onboarding OpenFintek</h2>
        <p className="text-gray-600">
          Completa los siguientes pasos para activar tu cuenta. El proceso es guiado y toma solo unos minutos.
        </p>
      </header>

      {/* Stage 1 */}
      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Paso 1. Datos basicos</h3>
        <p className="text-sm text-gray-600">
          Comenzaremos reuniendo la informacion clave para validar tu identidad. Ten a la mano tu documento, una selfie y datos laborales.
        </p>
        {currentStage === 1 && (
          <div className="mt-4">
            <button
              onClick={handleNextStage}
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Cargando...' : 'Comenzar →'}
            </button>
          </div>
        )}
      </section>

      {/* Stage 2 */}
      {currentStage >= 2 && (
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Paso 2. Documentos</h3>
          <p className="text-sm text-gray-600 mb-4">
            Sube los archivos desde tu computadora. Aceptamos imagenes (JPG, PNG, WebP) y PDF.
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            <DocumentUpload
              label="Documento de identidad"
              documentType="dni"
              isUploaded={documentsUploaded.dni}
              onUpload={(fileUrl) => handleUploadDocument('dni', fileUrl)}
            />
            <DocumentUpload
              label="Selfie"
              documentType="selfie"
              isUploaded={documentsUploaded.selfie}
              onUpload={(fileUrl) => handleUploadDocument('selfie', fileUrl)}
            />
            <DocumentUpload
              label="Comprobante de domicilio"
              documentType="proof"
              isUploaded={documentsUploaded.proof}
              onUpload={(fileUrl) => handleUploadDocument('proof', fileUrl)}
            />
          </div>

          {currentStage === 2 && (
            <div className="mt-6 text-right">
              <button
                onClick={handleNextStage}
                disabled={loading || !canAdvanceFromDocuments}
                className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Continuar →'}
              </button>
            </div>
          )}
        </section>
      )}

      {/* Stage 3 */}
      {currentStage >= 3 && (
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Paso 3. Verificacion biometrica</h3>
          <p className="text-sm text-gray-600 mb-4">
            Necesitamos capturar tu rostro y verificar tu identidad. Asegurate de tener buena iluminacion.
          </p>

          <BiometryVerification
            onVerify={handleVerifyBiometry}
            isVerified={biometryCompleted}
            isLoading={loading}
          />

          {currentStage === 3 && biometryCompleted && (
            <div className="mt-6 text-right">
              <button
                onClick={handleNextStage}
                disabled={loading}
                className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Continuar →'}
              </button>
            </div>
          )}
        </section>
      )}

      {/* Stage 4 */}
      {currentStage >= 4 && (
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Paso 4. Informacion laboral</h3>
          <p className="text-sm text-gray-600 mb-4">
            Completa tu informacion laboral para evaluar tu capacidad crediticia.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Empresa"
              value={employmentData.company}
              onChange={(e) => setEmploymentData({ ...employmentData, company: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              placeholder="Cargo"
              value={employmentData.position}
              onChange={(e) => setEmploymentData({ ...employmentData, position: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="number"
              placeholder="Ingreso mensual"
              value={employmentData.monthlyIncome}
              onChange={(e) => setEmploymentData({ ...employmentData, monthlyIncome: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md"
            />
            <select
              value={employmentData.employmentType}
              onChange={(e) => setEmploymentData({ ...employmentData, employmentType: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Tipo de empleo</option>
              <option value="FULL_TIME">Tiempo completo</option>
              <option value="PART_TIME">Medio tiempo</option>
              <option value="CONTRACTOR">Contratista</option>
              <option value="SELF_EMPLOYED">Independiente</option>
            </select>
            <input
              type="number"
              placeholder="Anos de experiencia"
              value={employmentData.yearsEmployed}
              onChange={(e) => setEmploymentData({ ...employmentData, yearsEmployed: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {currentStage === 4 && (
            <div className="mt-6 text-right">
              <button
                onClick={handleCompleteEmployment}
                disabled={loading}
                className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Continuar →'}
              </button>
            </div>
          )}
        </section>
      )}

      {/* Stage 5 */}
      {currentStage >= 5 && (
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Paso 5. Informacion bancaria</h3>
          <p className="text-sm text-gray-600 mb-4">
            Proporciona tus datos bancarios para facilitar los desembolsos.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Banco"
              value={bankingData.bankName}
              onChange={(e) => setBankingData({ ...bankingData, bankName: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md"
            />
            <select
              value={bankingData.accountType}
              onChange={(e) => setBankingData({ ...bankingData, accountType: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Tipo de cuenta</option>
              <option value="SAVINGS">Ahorros</option>
              <option value="CHECKING">Corriente</option>
            </select>
            <input
              type="text"
              placeholder="Numero de cuenta"
              value={bankingData.accountNumber}
              onChange={(e) => setBankingData({ ...bankingData, accountNumber: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md md:col-span-2"
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={bankingData.hasDebts}
                onChange={(e) => setBankingData({ ...bankingData, hasDebts: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm">Tengo deudas activas</span>
            </label>
            {bankingData.hasDebts && (
              <input
                type="number"
                placeholder="Cuota mensual de deudas"
                value={bankingData.monthlyDebts}
                onChange={(e) => setBankingData({ ...bankingData, monthlyDebts: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
            )}
          </div>

          {currentStage === 5 && (
            <div className="mt-6 text-right">
              <button
                onClick={handleCompleteBanking}
                disabled={loading}
                className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Continuar →'}
              </button>
            </div>
          )}
        </section>
      )}

      {/* Stage 6 */}
      {currentStage >= 6 && (
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-semibold mb-2">Listo! Tu onboarding esta completo</h3>
          <p className="text-gray-600 mb-6">
            Tu cuenta ha sido activada exitosamente. Ahora puedes acceder a todos los servicios de OpenFintek.
          </p>
          {currentStage === 6 && (
            <button
              onClick={handleFinish}
              disabled={loading}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Finalizando...' : 'Finalizar'}
            </button>
          )}
        </section>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Advertencia: {error}</p>
        </div>
      )}
    </div>
  );
};

export default OnboardingFlow;
