'use client'
import React, { useState } from 'react'
import Step1Identification from '../CreacionSteps/Step1Identification'
import Step2OTP from '../CreacionSteps/Step2OTP'
import Step3Pension from '../CreacionSteps/Step3Pension'
import Step4BasicData from '../CreacionSteps/Step4BasicData'
// Step5FinancialInfo removed - data collected in simulator
import Step6RiskCentral from '../CreacionSteps/Step6RiskCentral'
import Step7Simulator from '../CreacionSteps/Step7Simulator'
import Step8Requirements from '../CreacionSteps/Step8Requirements'
import Step9DetailedForms from '../CreacionSteps/Step9DetailedForms'

export interface CreacionFormData {
  // Step 1
  identificationType?: string
  identificationNumber?: string
  phone?: string
  // Step 2
  otp?: string
  // Step 3
  pensioneRaIssuer?: string
  pensionType?: string
  // Step 4
  firstName?: string
  lastName?: string
  birthDate?: string
  email?: string
  gender?: string
  // Step 5
  monthlyIncome?: number
  monthlyExpenses?: number
  creditExperience?: string
  // Step 7
  creditAmount?: number
  creditTerm?: number
  // Step 8
  requirements?: File[]
  // Step 9
  insurability?: string
  idIssuancePlace?: string
  idIssuanceDate?: string
  birthPlace?: string
  birthCountry?: string
  education?: string
  maritalStatus?: string
  references?: any[]
  laborInfo?: any
  financialInfo?: any
}

const CreacionModule = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<CreacionFormData>({})

  const totalSteps = 8 // Reduced from 9 (removed Step5 Financial Info)

  const handleNextStep = (newData: Partial<CreacionFormData>) => {
    setFormData({ ...formData, ...newData })
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStepChange = (step: number) => {
    setCurrentStep(step)
  }

  const getStepComponent = () => {
    switch (currentStep) {
      case 1:
        return <Step1Identification formData={formData} onNext={handleNextStep} />
      case 2:
        return <Step2OTP formData={formData} onNext={handleNextStep} />
      case 3:
        return <Step3Pension formData={formData} onNext={handleNextStep} />
      case 4:
        return <Step4BasicData formData={formData} onNext={handleNextStep} />
      case 5:
        return <Step6RiskCentral formData={formData} onNext={handleNextStep} />
      case 6:
        return <Step7Simulator formData={formData} onNext={handleNextStep} />
      case 7:
        return <Step8Requirements formData={formData} onNext={handleNextStep} />
      case 8:
        return <Step9DetailedForms formData={formData} onNext={handleNextStep} />
      default:
        return null
    }
  }

  const stepLabels = [
    'Identificación',
    'Verificación OTP',
    'Datos Pensión',
    'Datos Básicos',
    'Centrales Riesgo',
    'Simulador',
    'Requerimientos',
    'Formularios',
  ]

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='mb-6'>
        <h2 className='text-4xl font-bold text-gray-900 mb-2'>Nuevo Crédito</h2>
        <p className='text-gray-600'>Completa el formulario paso a paso</p>
      </div>

      {/* Progress Bar */}
      <div className='bg-white rounded-2xl shadow-md p-6 border border-purple-100'>
        {/* Progress Steps */}
        <div className='flex items-center justify-between mb-6 overflow-x-auto pb-4'>
          {stepLabels.map((label, index) => {
            const step = index + 1
            const isCompleted = step < currentStep
            const isActive = step === currentStep

            return (
              <div key={step} className='flex items-center flex-shrink-0'>
                <button
                  onClick={() => handleStepChange(step)}
                  className={`flex items-center justify-center w-11 h-11 rounded-xl font-bold text-sm transition-all duration-300 ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-lg scale-110'
                      : isCompleted
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  {isCompleted ? '✓' : step}
                </button>
                <div className='hidden lg:block ml-2 mr-4'>
                  <p
                    className={`text-xs font-semibold whitespace-nowrap ${
                      isActive
                        ? 'text-purple-600'
                        : isCompleted
                        ? 'text-green-500'
                        : 'text-gray-500'
                    }`}
                  >
                    {label}
                  </p>
                </div>
                {step < totalSteps && (
                  <div
                    className={`h-1 flex-shrink-0 mr-4 rounded ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                    style={{ width: '40px' }}
                  ></div>
                )}
              </div>
            )
          })}
        </div>

        {/* Progress Percentage */}
        <div className='w-full bg-gray-200 rounded-full h-2.5'>
          <div
            className='bg-gradient-to-r from-purple-600 to-purple-400 h-2.5 rounded-full transition-all duration-300'
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
        <p className='text-right text-sm text-gray-600 mt-2 font-medium'>
          Paso {currentStep} de {totalSteps}
        </p>
      </div>

      {/* Step Content */}
      <div className='bg-white rounded-2xl shadow-md p-8 border border-gray-100'>
        {getStepComponent()}
      </div>

      {/* Navigation Buttons */}
      <div className='flex gap-4 justify-between items-center'>
        <button
          onClick={handlePreviousStep}
          disabled={currentStep === 1}
          className='px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300'
        >
          ← Anterior
        </button>

        <div className='text-center'>
          <div className='flex gap-2'>
            {Array.from({ length: totalSteps }).map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx < currentStep ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {currentStep === totalSteps ? (
          <button className='px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300'>
            Finalizar ✓
          </button>
        ) : (
          <button
            onClick={() => handleNextStep({})}
            className='px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300'
          >
            Siguiente →
          </button>
        )}
      </div>
    </div>
  )
}

export default CreacionModule
