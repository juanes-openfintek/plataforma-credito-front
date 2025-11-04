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
import { createCliente, updateCliente } from '../../../../services/commercialClientes'
import { useRouter } from 'next/navigation'

export interface CreacionFormData {
  // Step 1
  identificationType?: string
  identificationNumber?: string
  phone?: string
  // Step 2
  otp?: string
  otpVerified?: boolean
  // Step 3
  pensionIssuer?: string
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
  // Step 6
  riskStatus?: string
  riskScore?: number
  riskDetails?: any
  // Step 7
  creditAmount?: number
  creditTerm?: number
  monthlyPayment?: number
  totalInterest?: number
  totalToPay?: number
  simulationId?: string
  // Step 8
  requirements?: File[]
  documents?: any[]
  // Step 9
  healthStatus?: string
  disability?: string
  idIssuancePlace?: string
  idIssuanceDate?: string
  birthPlace?: string
  birthCountry?: string
  educationLevel?: string
  maritalStatus?: string
  laborInfo?: any
  financialDetails?: any
}

const CreacionModule = () => {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<CreacionFormData>({})
  const [clienteId, setClienteId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const totalSteps = 8 // Reduced from 9 (removed Step5 Financial Info)

  const handleNextStep = async (newData: Partial<CreacionFormData>) => {
    const updatedFormData = { ...formData, ...newData }
    setFormData(updatedFormData)
    setError(null)
    setIsLoading(true)

    try {
      // Step 1: Crear cliente con información básica
      if (currentStep === 1 && !clienteId) {
        const clienteData = {
          identificationType: updatedFormData.identificationType,
          identificationNumber: updatedFormData.identificationNumber,
          phone: updatedFormData.phone,
        }
        const createdCliente = await createCliente(clienteData)
        setClienteId(createdCliente._id)
        console.log('Cliente creado:', createdCliente._id)
      }
      // Step 2: Actualizar con verificación OTP
      else if (currentStep === 2 && clienteId) {
        await updateCliente(clienteId, {
          otpVerified: true,
        })
        console.log('OTP verificado')
      }
      // Step 3: Actualizar con datos de pensión
      else if (currentStep === 3 && clienteId) {
        await updateCliente(clienteId, {
          pensionIssuer: updatedFormData.pensionIssuer,
          pensionType: updatedFormData.pensionType,
        })
        console.log('Datos de pensión guardados')
      }
      // Step 4: Actualizar con datos básicos
      else if (currentStep === 4 && clienteId) {
        await updateCliente(clienteId, {
          firstName: updatedFormData.firstName,
          lastName: updatedFormData.lastName,
          birthDate: updatedFormData.birthDate,
          email: updatedFormData.email,
          gender: updatedFormData.gender,
        })
        console.log('Datos básicos guardados')
      }
      // Step 5 (RiskCentral): Actualizar con datos de riesgo
      else if (currentStep === 5 && clienteId) {
        await updateCliente(clienteId, {
          riskStatus: updatedFormData.riskStatus || 'pendiente',
          riskScore: updatedFormData.riskScore,
          riskDetails: updatedFormData.riskDetails,
        })
        console.log('Datos de riesgo guardados')
      }
      // Step 6 (Simulator): Actualizar con datos de simulación
      else if (currentStep === 6 && clienteId) {
        await updateCliente(clienteId, {
          creditAmount: updatedFormData.creditAmount,
          creditTerm: updatedFormData.creditTerm,
          monthlyPayment: updatedFormData.monthlyPayment,
          totalInterest: updatedFormData.totalInterest,
          totalToPay: updatedFormData.totalToPay,
          monthlyIncome: updatedFormData.monthlyIncome,
          monthlyExpenses: updatedFormData.monthlyExpenses,
        })
        console.log('Simulación guardada')
      }
      // Step 7 (Requirements): Actualizar con documentos subidos
      else if (currentStep === 7 && clienteId) {
        await updateCliente(clienteId, {
          documents: updatedFormData.documents || [],
        })
        console.log('Documentos guardados')
      }
      // Step 8 (DetailedForms): Actualizar con formularios detallados y finalizar
      else if (currentStep === 8 && clienteId) {
        await updateCliente(clienteId, {
          healthStatus: updatedFormData.healthStatus,
          disability: updatedFormData.disability,
          idIssuancePlace: updatedFormData.idIssuancePlace,
          idIssuanceDate: updatedFormData.idIssuanceDate,
          birthPlace: updatedFormData.birthPlace,
          birthCountry: updatedFormData.birthCountry,
          educationLevel: updatedFormData.educationLevel,
          maritalStatus: updatedFormData.maritalStatus,
          laborInfo: updatedFormData.laborInfo,
          financialDetails: updatedFormData.financialDetails,
          status: 'completado', // Marcar como completado
        })
        console.log('Formularios detallados guardados - Cliente completado')
        
        // Mostrar mensaje de éxito y redirigir
        alert('¡Crédito radicado exitosamente! 🎉')
        router.push('/comercial') // Redirigir al dashboard
        return
      }

      // Avanzar al siguiente paso
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1)
      }
    } catch (err: any) {
      console.error('Error guardando datos:', err)
      setError(err.response?.data?.message || 'Error al guardar los datos. Intenta nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStepChange = (step: number) => {
    if (!isLoading) {
      setCurrentStep(step)
    }
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
        {clienteId && (
          <p className='text-sm text-green-600 mt-2'>
            ✓ Cliente ID: {clienteId.substring(0, 8)}...
          </p>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className='bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-xl flex items-start gap-3'>
          <span className='text-xl'>⚠️</span>
          <div className='flex-1'>
            <p className='font-semibold'>Error</p>
            <p className='text-sm'>{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className='text-red-600 hover:text-red-800 font-bold'
          >
            ✕
          </button>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className='bg-blue-50 border border-blue-300 text-blue-800 px-4 py-3 rounded-xl flex items-center gap-3'>
          <div className='w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin'></div>
          <p className='font-semibold'>Guardando datos...</p>
        </div>
      )}

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
          disabled={currentStep === 1 || isLoading}
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

        {/* Los botones de siguiente se manejan en los componentes de cada paso */}
        <div className='w-32'></div>
      </div>
    </div>
  )
}

export default CreacionModule
