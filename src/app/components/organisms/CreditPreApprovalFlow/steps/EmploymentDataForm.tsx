'use client';

import React, { useState } from 'react';

interface EmploymentDataFormProps {
  initialData: any;
  onComplete: (data: any) => void;
  onBack: () => void;
}

const EmploymentDataForm: React.FC<EmploymentDataFormProps> = ({
  initialData,
  onComplete,
  onBack,
}) => {
  const [formData, setFormData] = useState({
    company: initialData.company || '',
    position: initialData.position || '',
    monthlyIncome: initialData.monthlyIncome || '',
    employmentType: initialData.employmentType || 'FULL_TIME',
    yearsEmployed: initialData.yearsEmployed || '',
  });

  const [errors, setErrors] = useState<any>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.company.trim()) newErrors.company = 'Empresa requerida';
    if (!formData.position.trim()) newErrors.position = 'Cargo requerido';
    if (!formData.monthlyIncome) newErrors.monthlyIncome = 'Ingreso mensual requerido';
    if (!formData.yearsEmployed) newErrors.yearsEmployed = 'Anos de experiencia requeridos';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onComplete({
        ...formData,
        monthlyIncome: Number(formData.monthlyIncome),
        yearsEmployed: Number(formData.yearsEmployed),
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Informacion Laboral</h3>
        <p className="text-gray-600">Completa tu informacion de empleo</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Nombre de la empresa"
          />
          {errors.company && <p className="text-red-600 text-sm mt-1">{errors.company}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Tu cargo"
          />
          {errors.position && <p className="text-red-600 text-sm mt-1">{errors.position}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ingreso Mensual</label>
          <input
            type="number"
            name="monthlyIncome"
            value={formData.monthlyIncome}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="1000000"
          />
          {errors.monthlyIncome && <p className="text-red-600 text-sm mt-1">{errors.monthlyIncome}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Anos de Experiencia</label>
          <input
            type="number"
            name="yearsEmployed"
            value={formData.yearsEmployed}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="2"
          />
          {errors.yearsEmployed && <p className="text-red-600 text-sm mt-1">{errors.yearsEmployed}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Empleo</label>
          <select
            name="employmentType"
            value={formData.employmentType}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="FULL_TIME">Tiempo Completo</option>
            <option value="PART_TIME">Medio Tiempo</option>
            <option value="CONTRACTOR">Contratista</option>
            <option value="SELF_EMPLOYED">Independiente</option>
          </select>
        </div>
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

export default EmploymentDataForm;
