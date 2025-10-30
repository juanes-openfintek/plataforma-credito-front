'use client';

import React, { useState, useEffect } from 'react';

interface CreditSimulationProps {
  amount: number;
  days: number;
  onComplete: (data: any) => void;
  onBack: () => void;
}

const CreditSimulation: React.FC<CreditSimulationProps> = ({
  amount,
  days,
  onComplete,
  onBack,
}) => {
  const [interest, setInterest] = useState(0);
  const [insurance, setInsurance] = useState(0);
  const [administration, setAdministration] = useState(0);
  const [iva, setIva] = useState(0);
  const [total, setTotal] = useState(0);
  const [monthlyPayment, setMonthlyPayment] = useState(0);

  useEffect(() => {
    // Default tax rates for simulation
    const interestRate = 2.5; // 2.5% monthly equivalent
    const insuranceRate = 0.5; // 0.5%
    const administrationRate = 1.2; // 1.2%
    const ivaRate = 19; // 19%

    // Calculate interest based on months (days parameter is actually months)
    const calculatedInterest = amount * (interestRate / 100) * days;
    const calculatedInsurance = amount * (insuranceRate / 100) * days;
    const calculatedAdministration = amount * (administrationRate / 100) * days;

    // Calculate IVA on sum of costs
    const subtotal = amount + calculatedInterest + calculatedInsurance + calculatedAdministration;
    const calculatedIva = subtotal * (ivaRate / 100);

    // Set values
    setInterest(calculatedInterest);
    setInsurance(calculatedInsurance);
    setAdministration(calculatedAdministration);
    setIva(calculatedIva);

    // Calculate total
    const calculatedTotal = subtotal + calculatedIva;
    setTotal(calculatedTotal);

    // Calculate monthly payment (days is already in months)
    const monthlyPaymentAmount = calculatedTotal / (days > 0 ? days : 1);
    setMonthlyPayment(monthlyPaymentAmount);
  }, [amount, days]);

  const handleContinue = () => {
    onComplete({
      interest,
      insurance,
      administration,
      iva,
      total,
      monthlyPayment,
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

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Simulacion de Credito</h3>
        <p className="text-gray-600">Aqui esta el desglose completo de tu credito</p>
      </div>

      {/* Loan Details Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Monto solicitado:</span>
            <span className="text-lg font-bold text-gray-900">{formatCurrency(amount)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Plazo:</span>
            <span className="text-lg font-bold text-gray-900">{days} meses</span>
          </div>
        </div>
      </div>

      {/* Fees Breakdown */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Desglose de Costos</h4>

        <div className="space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <span className="text-gray-700">Capital:</span>
            <span className="font-semibold text-gray-900">{formatCurrency(amount)}</span>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <span className="text-gray-700">Intereses (2.5% mensual):</span>
            <span className="font-semibold text-gray-900">{formatCurrency(interest)}</span>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <span className="text-gray-700">Seguro:</span>
            <span className="font-semibold text-gray-900">{formatCurrency(insurance)}</span>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <span className="text-gray-700">Administracion:</span>
            <span className="font-semibold text-gray-900">{formatCurrency(administration)}</span>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <span className="text-gray-700">IVA (19%):</span>
            <span className="font-semibold text-gray-900">{formatCurrency(iva)}</span>
          </div>

          <div className="flex justify-between items-center pt-3 bg-gray-50 p-4 rounded-lg">
            <span className="text-lg font-bold text-gray-900">Valor Total:</span>
            <span className="text-2xl font-bold text-blue-600">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      {/* Monthly Payment Estimate */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h4 className="text-sm font-semibold text-green-900 mb-2">Cuota Mensual Estimada</h4>
        <div className="text-3xl font-bold text-green-700">{formatCurrency(monthlyPayment)}</div>
        <p className="text-xs text-green-600 mt-2">
          Calculada sobre {days} mes(es)
        </p>
      </div>

      {/* Important Note */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Nota importante:</strong> Esta es una simulacion con tasas estandar. Las tasas finales pueden variar segun tu perfil de riesgo y aprobacion del credito.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={onBack}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
        >
          Atras
        </button>
        <button
          onClick={handleContinue}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default CreditSimulation;
