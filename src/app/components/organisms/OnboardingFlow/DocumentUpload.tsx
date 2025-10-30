'use client';

import React, { useRef, useState } from 'react';

interface DocumentUploadProps {
  label: string;
  documentType: 'dni' | 'selfie' | 'proof';
  isUploaded: boolean;
  onUpload: (fileUrl: string) => Promise<void>;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  label,
  documentType,
  isUploaded,
  onUpload,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setError('Solo se permiten imágenes (JPG, PNG, WebP) o PDF');
      return;
    }

    // Validar tamaño (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('El archivo no debe exceder 5MB');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Convertir archivo a base64 para simular URL
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64String = e.target?.result as string;
        setPreview(base64String);

        // Crear un blob URL que pueda ser usado
        const blob = new Blob([file], { type: file.type });
        const blobUrl = URL.createObjectURL(blob);

        try {
          await onUpload(blobUrl);
          setError('');
        } catch (err: any) {
          setError(err.message || 'Error al subir el documento');
          setPreview('');
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setError('Error al procesar el archivo');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='border border-gray-300 rounded-lg p-4'>
      <label className='block text-sm font-medium text-gray-700 mb-2'>
        {label}
        {isUploaded && <span className='ml-2 text-green-600'>✓ Subido</span>}
      </label>

      <div className='space-y-3'>
        {/* Área de carga */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isUploaded
              ? 'border-green-300 bg-green-50'
              : 'border-gray-300 bg-gray-50 hover:border-blue-400'
          }`}
        >
          <input
            ref={fileInputRef}
            type='file'
            accept='image/*,.pdf'
            onChange={handleFileSelect}
            disabled={loading}
            className='hidden'
          />

          <div className='text-4xl mb-2'>
            {documentType === 'dni' && '🆔'}
            {documentType === 'selfie' && '📸'}
            {documentType === 'proof' && '🏠'}
          </div>

          <p className='text-gray-700 font-medium'>
            {loading ? 'Procesando...' : 'Haz clic o arrastra un archivo'}
          </p>
          <p className='text-xs text-gray-500 mt-1'>
            JPG, PNG, WebP o PDF (máx 5MB)
          </p>
        </div>

        {/* Preview */}
        {preview && (
          <div className='space-y-2'>
            <p className='text-xs text-gray-600'>Vista previa:</p>
            {preview.startsWith('data:image') ? (
              <img src={preview} alt='preview' className='w-full h-32 object-cover rounded' />
            ) : (
              <div className='bg-red-50 p-3 rounded text-sm text-red-600'>
                📄 PDF cargado
              </div>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className='bg-red-50 border border-red-200 rounded p-3 text-sm text-red-600'>
            ⚠️ {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentUpload;
