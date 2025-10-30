'use client';

import React, { useState, useEffect } from 'react';

interface OTPVerificationProps {
  email: string;
  onComplete: (data: any) => void;
  onBack: () => void;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({ email, onComplete, onBack }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Simular envío de OTP
    setMessage('Se ha enviado un código OTP a tu correo');
    setCountdown(60);
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setMessage('El codigo debe tener 6 digitos');
      return;
    }

    setLoading(true);
    // Simulación de verificación
    setTimeout(() => {
      onComplete({ otp, otpVerified: true });
      setLoading(false);
    }, 1500);
  };

  const handleResendOTP = () => {
    setOtp('');
    setMessage('Se ha enviado un nuevo codigo OTP');
    setCountdown(60);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Verificacion de Identidad</h3>
        <p className="text-gray-600">
          Ingresa el codigo OTP enviado a <span className="font-medium">{email}</span>
        </p>
      </div>

      {message && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
          {message}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Codigo OTP (6 digitos)
        </label>
        <input
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
          placeholder="000000"
          className="w-full px-4 py-3 text-center text-2xl tracking-widest border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>

      {countdown > 0 && (
        <p className="text-center text-sm text-gray-600">
          Reenviar codigo en {countdown}s
        </p>
      )}

      {countdown === 0 && (
        <button
          onClick={handleResendOTP}
          className="w-full text-blue-600 hover:text-blue-700 font-medium text-sm"
        >
          Reenviar codigo OTP
        </button>
      )}

      <div className="flex gap-3 pt-4">
        <button
          onClick={onBack}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          onClick={handleVerifyOTP}
          disabled={loading || otp.length !== 6}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Verificando...' : 'Verificar OTP'}
        </button>
      </div>
    </div>
  );
};

export default OTPVerification;
