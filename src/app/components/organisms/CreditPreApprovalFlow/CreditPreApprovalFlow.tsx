'use client';

import React, { useState } from 'react';
import OTPVerification from './steps/OTPVerification';
import RiskCentralVerification from './steps/RiskCentralVerification';
import BasicDataForm from './steps/BasicDataForm';
import EmploymentDataForm from './steps/EmploymentDataForm';
import BankingDataForm from './steps/BankingDataForm';
import CreditSimulation from './steps/CreditSimulation';
import CreditRadication from './steps/CreditRadication';

interface CreditPreApprovalFlowProps {
  email?: string;
  amount?: number;
  days?: number;
  onComplete?: (creditData: any) => void;
  onCancel?: () => void;
}

const CreditPreApprovalFlow: React.FC<CreditPreApprovalFlowProps> = ({
  email,
  amount,
  days,
  onComplete,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [creditData, setCreditData] = useState({
    email: email || '',
    amount: amount || 0,
    days: days || 0,
    otp: '',
    otpVerified: false,
    // Radicacion data
    selfie: '',
    cedula: '',
    incomeCertificate: '',
    // Basic data
    name: '',
    lastName: '',
    phoneNumber: '',
    documentType: '',
    documentNumber: '',
    dateOfBirth: '',
    // Employment data
    company: '',
    position: '',
    monthlyIncome: 0,
    employmentType: '',
    yearsEmployed: 0,
    // Banking data
    bankName: '',
    accountType: '',
    accountNumber: '',
    hasDebts: false,
    monthlyDebts: 0,
  });

  const handleStepComplete = (stepData: any) => {
    setCreditData({ ...creditData, ...stepData });
    setCurrentStep(currentStep + 1);
  };

  const handleStepBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onCancel?.();
    }
  };

  const handleFinalSubmit = async (finalData: any) => {
    const completeData = { ...creditData, ...finalData };
    console.log('Credit pre-approval complete:', completeData);
    onComplete?.(completeData);
  };

  const progressPercentage = (currentStep / 7) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
          <h2 className="text-2xl font-bold mb-2">Solicitud de Credito PreAprobado</h2>
          <p className="text-blue-100">Paso {currentStep} de 7</p>
          <div className="mt-4 bg-blue-700 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Step 1: OTP Verification */}
          {currentStep === 1 && (
            <OTPVerification
              email={creditData.email}
              onComplete={handleStepComplete}
              onBack={handleStepBack}
            />
          )}

          {/* Step 2: Risk Central Verification (Radicacion) */}
          {currentStep === 2 && (
            <RiskCentralVerification
              onComplete={handleStepComplete}
              onBack={handleStepBack}
            />
          )}

          {/* Step 3: Basic Data */}
          {currentStep === 3 && (
            <BasicDataForm
              initialData={creditData}
              onComplete={handleStepComplete}
              onBack={handleStepBack}
            />
          )}

          {/* Step 4: Employment Data */}
          {currentStep === 4 && (
            <EmploymentDataForm
              initialData={creditData}
              onComplete={handleStepComplete}
              onBack={handleStepBack}
            />
          )}

          {/* Step 5: Banking Data */}
          {currentStep === 5 && (
            <BankingDataForm
              initialData={creditData}
              onComplete={handleStepComplete}
              onBack={handleStepBack}
            />
          )}

          {/* Step 6: Credit Simulation */}
          {currentStep === 6 && (
            <CreditSimulation
              amount={creditData.amount}
              days={creditData.days}
              onComplete={handleStepComplete}
              onBack={handleStepBack}
            />
          )}

          {/* Step 7: Credit Radication */}
          {currentStep === 7 && (
            <CreditRadication
              creditData={creditData}
              onComplete={handleFinalSubmit}
              onBack={handleStepBack}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CreditPreApprovalFlow;
