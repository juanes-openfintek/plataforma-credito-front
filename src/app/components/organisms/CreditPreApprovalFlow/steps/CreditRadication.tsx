'use client';

import React, { useState, useEffect } from 'react';

interface CreditRadicationProps {
  creditData: any;
  onComplete: (data: any) => void;
  onBack: () => void;
}

const CreditRadication: React.FC<CreditRadicationProps> = ({
  creditData,
  onComplete,
  onBack,
}) => {
  const [radicationNumber, setRadicationNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    // Generate radicacion number on component mount
    const generateRadicationNumber = () => {
      const year = new Date().getFullYear();
      const month = String(new Date().getMonth() + 1).padStart(2, '0');
      const day = String(new Date().getDate()).padStart(2, '0');
      const random = String(Math.floor(Math.random() * 10000)).padStart(5, '0');
      return `RAD-${year}-${month}${day}-${random}`;
    };
    setRadicationNumber(generateRadicationNumber());
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate submission delay
    setTimeout(() => {
      setShowConfirmation(true);
      setIsSubmitting(false);
    }, 2000);
  };

  const handleComplete = () => {
    onComplete({
      radicationNumber,
      submittedAt: new Date().toISOString(),
      status: 'PENDING_REVIEW',
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  if (showConfirmation) {
    return (
      <div className="space-y-6 text-center">
        <div className="pt-8 pb-6">
          <div className="text-6xl mb-4">OK</div>
          <h3 className="text-2xl font-bold text-green-700 mb-2">Solicitud Radicada Exitosamente</h3>
          <p className="text-gray-600">Tu solicitud de credito ha sido registrada en nuestro sistema</p>
        </div>

        {/* Radicacion Number */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <p className="text-sm font-medium text-green-900 mb-2">Numero de Radicacion</p>
          <p className="text-3xl font-bold text-green-700 font-mono">{radicationNumber}</p>
          <p className="text-xs text-green-600 mt-3">
            Guarda este numero para hacer seguimiento a tu solicitud
          </p>
        </div>

        {/* Submission Details */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-left space-y-4">
          <h4 className="font-semibold text-gray-900">Resumen de tu Solicitud</h4>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Monto Solicitado</p>
              <p className="font-bold text-gray-900">{formatCurrency(creditData.amount)}</p>
            </div>
            <div>
              <p className="text-gray-600">Plazo (dias)</p>
              <p className="font-bold text-gray-900">{creditData.days}</p>
            </div>
            <div>
              <p className="text-gray-600">Nombre Completo</p>
              <p className="font-bold text-gray-900">{creditData.name} {creditData.lastName}</p>
            </div>
            <div>
              <p className="text-gray-600">Documento</p>
              <p className="font-bold text-gray-900">{creditData.documentNumber}</p>
            </div>
            <div>
              <p className="text-gray-600">Telefono</p>
              <p className="font-bold text-gray-900">{creditData.phoneNumber}</p>
            </div>
            <div>
              <p className="text-gray-600">Email</p>
              <p className="font-bold text-gray-900">{creditData.email}</p>
            </div>
            <div>
              <p className="text-gray-600">Banco</p>
              <p className="font-bold text-gray-900">{creditData.bankName}</p>
            </div>
            <div>
              <p className="text-gray-600">Ingresos Mensuales</p>
              <p className="font-bold text-gray-900">{formatCurrency(creditData.monthlyIncome)}</p>
            </div>
          </div>
        </div>

        {/* What Happens Next */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-left">
          <h4 className="font-semibold text-blue-900 mb-3">Proximo paso</h4>
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-900">
            <li>Revisaremos tu informacion y documentos</li>
            <li>Te contactaremos para confirmar detalles</li>
            <li>Una vez aprobado, se desembolsara a tu cuenta bancaria</li>
          </ol>
          <p className="text-xs text-blue-700 mt-4">
            Tiempo estimado de respuesta: 1-3 dias habiles
          </p>
        </div>

        {/* Important Note */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Importante:</strong> Hemos enviado un correo de confirmacion a {creditData.email}. Por favor revisa tu bandeja de entrada.
          </p>
        </div>

        {/* Final Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={handleComplete}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Ir al Inicio
          </button>
          <button
            onClick={() => {
              const textToCopy = `Mi numero de radicacion es: ${radicationNumber}`;
              navigator.clipboard.writeText(textToCopy);
              alert('Numero de radicacion copiado al portapapeles');
            }}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          >
            Copiar Numero
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Confirmacion y Radicacion</h3>
        <p className="text-gray-600">Por favor revisa tus datos antes de enviar la solicitud</p>
      </div>

      {/* Review Data */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-6">
        {/* Personal Information */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Informacion Personal</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-white p-3 rounded border border-gray-200">
              <p className="text-gray-600 text-xs">Nombre</p>
              <p className="font-semibold text-gray-900">{creditData.name}</p>
            </div>
            <div className="bg-white p-3 rounded border border-gray-200">
              <p className="text-gray-600 text-xs">Apellido</p>
              <p className="font-semibold text-gray-900">{creditData.lastName}</p>
            </div>
            <div className="bg-white p-3 rounded border border-gray-200">
              <p className="text-gray-600 text-xs">Documento</p>
              <p className="font-semibold text-gray-900">{creditData.documentNumber}</p>
            </div>
            <div className="bg-white p-3 rounded border border-gray-200">
              <p className="text-gray-600 text-xs">Telefono</p>
              <p className="font-semibold text-gray-900">{creditData.phoneNumber}</p>
            </div>
          </div>
        </div>

        {/* Employment Information */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Informacion Laboral</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-white p-3 rounded border border-gray-200">
              <p className="text-gray-600 text-xs">Empresa</p>
              <p className="font-semibold text-gray-900">{creditData.company}</p>
            </div>
            <div className="bg-white p-3 rounded border border-gray-200">
              <p className="text-gray-600 text-xs">Cargo</p>
              <p className="font-semibold text-gray-900">{creditData.position}</p>
            </div>
            <div className="col-span-2 bg-white p-3 rounded border border-gray-200">
              <p className="text-gray-600 text-xs">Ingresos Mensuales</p>
              <p className="font-semibold text-gray-900">{formatCurrency(creditData.monthlyIncome)}</p>
            </div>
          </div>
        </div>

        {/* Credit Information */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Solicitud de Credito</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-white p-3 rounded border border-gray-200">
              <p className="text-gray-600 text-xs">Monto Solicitado</p>
              <p className="font-semibold text-gray-900">{formatCurrency(creditData.amount)}</p>
            </div>
            <div className="bg-white p-3 rounded border border-gray-200">
              <p className="text-gray-600 text-xs">Plazo (dias)</p>
              <p className="font-semibold text-gray-900">{creditData.days}</p>
            </div>
            <div className="col-span-2 bg-white p-3 rounded border border-gray-200">
              <p className="text-gray-600 text-xs">Banco</p>
              <p className="font-semibold text-gray-900">{creditData.bankName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Declaration */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>Declaracion:</strong> Confirmo que toda la informacion proporcionada es veraz y correcta. Acepto los terminos y condiciones del servicio.
        </p>
      </div>

      {/* Submission Status */}
      {isSubmitting && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-sm font-medium text-blue-900">Radicando solicitud...</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50"
        >
          Atras
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
        >
          {isSubmitting ? 'Radicando...' : 'Radicacion Final'}
        </button>
      </div>
    </div>
  );
};

export default CreditRadication;
