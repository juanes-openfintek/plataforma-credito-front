'use client';

import React, { useEffect, useState } from 'react';

interface BiometryVerificationProps {
  onVerify: () => Promise<void>;
  isVerified: boolean;
  isLoading: boolean;
}

const BiometryVerification: React.FC<BiometryVerificationProps> = ({
  onVerify,
  isVerified,
  isLoading,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [biometryScore, setBiometryScore] = useState(0);
  const [verified, setVerified] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Esperar a que el video esté listo
        await new Promise(resolve => {
          videoRef.current!.onloadedmetadata = () => resolve(null);
        });
      }
      setShowCamera(true);
    } catch (err) {
      console.error('Error accediendo a la camara:', err);
      alert('No se pudo acceder a la camara. Revisa los permisos.');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setShowCamera(false);
  };

  const processBiometry = async () => {
    setIsProcessing(true);
    setBiometryScore(0);
    let currentScore = 0;

    // Simular procesamiento por 5 segundos
    const interval = setInterval(() => {
      currentScore += Math.random() * 20 + 10;
      if (currentScore > 100) currentScore = 100;
      setBiometryScore(Math.floor(currentScore));

      if (currentScore >= 90) {
        clearInterval(interval);
        setBiometryScore(Math.floor(Math.random() * 8 + 92)); // 92-99%
        setVerified(true);

        // Llamar al servicio de verificacion
        onVerify();
        setIsProcessing(false);
        stopCamera();
      }
    }, 800);

    setTimeout(() => {
      if (!verified) {
        clearInterval(interval);
      }
    }, 5000);
  };

  return (
    <div className="space-y-4">
      {!isVerified ? (
        <div className="flex flex-col items-center">
          {!showCamera ? (
            <div className="text-center">
              <div className="text-6xl mb-4">📸</div>
              <p className="text-gray-600 mb-4">
                Necesitamos capturar tu rostro para continuar. Asegurate de tener buena iluminacion.
              </p>
              <button
                onClick={startCamera}
                disabled={isLoading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Iniciar camara
              </button>
            </div>
          ) : (
            <div className="w-full space-y-4">
              <div className="relative w-full rounded-lg overflow-hidden bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full bg-black"
                  style={{ display: 'block', width: '100%', maxHeight: '400px' }}
                />
                <div className="absolute inset-0 border-4 border-blue-500 rounded-lg flex items-center justify-center pointer-events-none">
                  <div className="w-32 h-40 border-4 border-white rounded-lg opacity-50"></div>
                </div>
              </div>

              {isProcessing && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-center">
                    <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                    <p className="text-sm font-medium text-blue-900">
                      Procesando biometria...
                    </p>
                    <p className="text-3xl font-bold text-blue-600 mt-2">
                      {biometryScore}%
                    </p>
                  </div>
                </div>
              )}

              {verified && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-5xl mb-2">✓</div>
                    <p className="text-lg font-semibold text-green-800">
                      Verificacion exitosa
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      Coincidencia facial: {biometryScore}%
                    </p>
                  </div>
                </div>
              )}

              {!isProcessing && !verified && (
                <div className="flex gap-3">
                  <button
                    onClick={processBiometry}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Capturar y verificar
                  </button>
                  <button
                    onClick={stopCamera}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="text-5xl mb-3">✓</div>
          <p className="text-xl font-semibold text-green-800">Verificacion completada</p>
          <p className="text-sm text-green-600 mt-2">
            Tu identidad ha sido verificada correctamente
          </p>
        </div>
      )}
    </div>
  );
};

export default BiometryVerification;
