'use client';

import React, { useState } from 'react';

interface DocumentUploadProps {
  label: string;
  description: string;
  onUpload: (file: File) => void;
  isUploaded: boolean;
}

const DocumentUploadField: React.FC<DocumentUploadProps> = ({
  label,
  description,
  onUpload,
  isUploaded,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onUpload(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-900">{label}</label>
          <p className="text-xs text-gray-600">{description}</p>
        </div>
        {isUploaded && <span className="text-green-600 font-medium text-sm">Cargado</span>}
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        } ${isUploaded ? 'border-green-300 bg-green-50' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileSelect}
          className="hidden"
        />
        <div className="text-gray-600">
          <p className="font-medium">Arrastra el archivo o haz clic</p>
          <p className="text-xs text-gray-500 mt-1">JPG, PNG o PDF (max 5MB)</p>
        </div>
      </div>
    </div>
  );
};

interface RiskCentralVerificationProps {
  onComplete: (data: any) => void;
  onBack: () => void;
}

const RiskCentralVerification: React.FC<RiskCentralVerificationProps> = ({
  onComplete,
  onBack,
}) => {
  const [documents, setDocuments] = useState({
    selfie: null as File | null,
    cedula: null as File | null,
    incomeCertificate: null as File | null,
  });

  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);

  const handleDocumentUpload = (type: string, file: File) => {
    setDocuments({ ...documents, [type]: file });
  };

  const handleVerify = async () => {
    if (!documents.selfie || !documents.cedula || !documents.incomeCertificate) {
      return;
    }

    setLoading(true);
    // Simulación de verificación de riesgo
    setTimeout(() => {
      setVerificationResult({
        status: 'approved',
        message: 'Verificacion de centrales de riesgo completada exitosamente',
        score: Math.floor(Math.random() * 30 + 70), // 70-99
      });
      setLoading(false);
    }, 3000);
  };

  const handleContinue = () => {
    onComplete({
      selfie: documents.selfie?.name || '',
      cedula: documents.cedula?.name || '',
      incomeCertificate: documents.incomeCertificate?.name || '',
    });
  };

  if (verificationResult) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Verificacion de Centrales de Riesgo
          </h3>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="text-center space-y-3">
            <div className="text-4xl font-bold text-green-600">✓</div>
            <p className="text-lg font-semibold text-green-900">{verificationResult.message}</p>
            <div className="bg-white rounded p-3 mt-4">
              <p className="text-sm text-gray-600">Puntaje de verificacion</p>
              <p className="text-3xl font-bold text-green-600">{verificationResult.score}%</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleContinue}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          Continuar
        </button>
      </div>
    );
  }

  const allDocumentsUploaded =
    documents.selfie && documents.cedula && documents.incomeCertificate;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Verificacion de Centrales de Riesgo
        </h3>
        <p className="text-gray-600">
          Necesitamos verificar tu informacion en las centrales de riesgo. Carga los siguientes documentos.
        </p>
      </div>

      <div className="space-y-4">
        <DocumentUploadField
          label="Selfie (foto tuya)"
          description="Foto clara de tu rostro"
          onUpload={(file) => handleDocumentUpload('selfie', file)}
          isUploaded={!!documents.selfie}
        />

        <DocumentUploadField
          label="Cedula o Documento de Identidad"
          description="Foto o escan de tu cedula"
          onUpload={(file) => handleDocumentUpload('cedula', file)}
          isUploaded={!!documents.cedula}
        />

        <DocumentUploadField
          label="Certificado de Ingresos"
          description="Certificado laboral, recibo de nomina o declaracion de impuestos"
          onUpload={(file) => handleDocumentUpload('incomeCertificate', file)}
          isUploaded={!!documents.incomeCertificate}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={onBack}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Atras
        </button>
        <button
          onClick={handleVerify}
          disabled={loading || !allDocumentsUploaded}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {loading ? 'Verificando...' : 'Verificar Documentos'}
        </button>
      </div>
    </div>
  );
};

export default RiskCentralVerification;
