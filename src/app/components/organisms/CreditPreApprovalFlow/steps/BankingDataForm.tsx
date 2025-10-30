'use client';

import React, { useState } from 'react';

interface BankingDataFormProps {
  initialData: any;
  onComplete: (data: any) => void;
  onBack: () => void;
}

const BankingDataForm: React.FC<BankingDataFormProps> = ({
  initialData,
  onComplete,
  onBack,
}) => {
  const [formData, setFormData] = useState({
    bankName: initialData.bankName || '',
    accountType: initialData.accountType || 'SAVINGS',
    accountNumber: initialData.accountNumber || '',
    hasDebts: initialData.hasDebts || false,
    monthlyDebts: initialData.monthlyDebts || '',
  });

  const [errors, setErrors] = useState<any>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, type, value, checked } = e.target as any;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.bankName.trim()) newErrors.bankName = 'Banco requerido';
    if (!formData.accountNumber.trim()) newErrors.accountNumber = 'Numero de cuenta requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onComplete({
        ...formData,
        monthlyDebts: formData.hasDebts ? Number(formData.monthlyDebts) : 0,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Informacion Bancaria</h3>
        <p className="text-gray-600">Completa tu informacion bancaria para los desembolsos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Banco</label>
          <input
            type="text"
            name="bankName"
            value={formData.bankName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Nombre del banco"
          />
          {errors.bankName && <p className="text-red-600 text-sm mt-1">{errors.bankName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Cuenta</label>
          <select
            name="accountType"
            value={formData.accountType}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="SAVINGS">Ahorros</option>
            <option value="CHECKING">Corriente</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Numero de Cuenta</label>
          <input
            type="text"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="0000000000"
          />
          {errors.accountNumber && <p className="text-red-600 text-sm mt-1">{errors.accountNumber}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="hasDebts"
              checked={formData.hasDebts}
              onChange={handleChange}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm font-medium text-gray-700">Tengo deudas activas</span>
          </label>
        </div>

        {formData.hasDebts && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cuota Mensual de Deudas
            </label>
            <input
              type="number"
              name="monthlyDebts"
              value={formData.monthlyDebts}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="0"
            />
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={onBack}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Atras
        </button>
        <button
          onClick={handleSubmit}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default BankingDataForm;
