'use client'
import React, { useEffect, useState } from 'react'
import Step1Identification from '../CreacionSteps/Step1Identification'
import Step2OTP from '../CreacionSteps/Step2OTP'
import Step3FullProfile from '../CreacionSteps/Step3FullProfile'
import Step6RiskCentral from '../CreacionSteps/Step6RiskCentral'
import Step7Simulator from '../CreacionSteps/Step7Simulator'
import Step8Requirements from '../CreacionSteps/Step8Requirements'
import { createCliente, updateCliente, submitClienteAsCredit } from '../../../../services/commercialClientes'
import { useRouter } from 'next/navigation'

export interface CreacionFormData {
  identificationType?: string
  identificationNumber?: string
  phone?: string
  otp?: string
  otpVerified?: boolean
  personType?: 'pensionado' | 'empleado'
  pensionIssuer?: string
  pensionType?: string
  firstName?: string
  lastName?: string
  birthDate?: string
  email?: string
  gender?: string
  idIssuancePlace?: string
  idIssuanceDate?: string
  birthPlace?: string
  birthCountry?: string
  educationLevel?: string
  maritalStatus?: string
  laborInfo?: any
  financialDetails?: any
  monthlyIncome?: number
  monthlyExpenses?: number
  creditExperience?: string
  riskStatus?: string
  riskScore?: number
  riskDetails?: any
  creditAmount?: number
  creditTerm?: number
  monthlyPayment?: number
  totalInterest?: number
  totalToPay?: number
  simulationId?: string
  requiresPortfolioPurchase?: boolean
  portfolioDebts?: Array<{
    id: string
    entity: string
    balance: number
    installment: number
    lineOfCredit: string
    obligationNumber: string
    status: string
    rating: string
    selected?: boolean
  }>
  maxQuota?: number
  maxAmount?: number
  desiredQuota?: number
  action?: 'finish' | 'finishAndSubmit'
  requirements?: File[]
  documents?: any[]
}

const CreacionModule = () => {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<CreacionFormData>({})
  const [clienteId, setClienteId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const totalSteps = 6

  useEffect(() => {
    const draft = typeof window !== 'undefined' ? window.localStorage.getItem('calculatorDraft') : null
    if (draft) {
      try {
        const parsed = JSON.parse(draft)
        setFormData((prev) => ({ ...prev, ...parsed }))
      } catch (e) {
        console.warn('No se pudo leer el borrador de calculadora', e)
      }
      window.localStorage.removeItem('calculatorDraft')
    }
  }, [])

  const handleNextStep = async (newData: Partial<CreacionFormData>) => {
    const action = newData.action as 'finish' | 'finishAndSubmit' | undefined
    const updatedFormData = { ...formData, ...newData }
    delete (updatedFormData as any).action
    setFormData(updatedFormData)
    setError(null)
    setIsLoading(true)

    try {
      // Nuevo orden de pasos:
      // 1. Identificación (+ personType)
      // 2. OTP
      // 3. Centrales de Riesgo
      // 4. Simulador
      // 5. Perfil y Formularios
      // 6. Requerimientos

      if (currentStep === 1 && !clienteId) {
        // Paso 1: Crear cliente con identificación y tipo de persona
        const createdCliente = await createCliente({
          identificationType: updatedFormData.identificationType,
          identificationNumber: updatedFormData.identificationNumber,
          phone: updatedFormData.phone,
          personType: updatedFormData.personType,
        })
        setClienteId(createdCliente._id)
      } else if (currentStep === 2 && clienteId) {
        // Paso 2: Verificación OTP
        await updateCliente(clienteId, { otpVerified: true })
      } else if (currentStep === 3 && clienteId) {
        // Paso 3: Centrales de Riesgo
        await updateCliente(clienteId, {
          riskStatus: updatedFormData.riskStatus || 'pendiente',
          riskScore: updatedFormData.riskScore,
          riskDetails: updatedFormData.riskDetails,
        })
      } else if (currentStep === 4 && clienteId) {
        // Paso 4: Simulador
        await updateCliente(clienteId, {
          creditAmount: updatedFormData.creditAmount,
          creditTerm: updatedFormData.creditTerm,
          monthlyPayment: updatedFormData.monthlyPayment,
          totalInterest: updatedFormData.totalInterest,
          totalToPay: updatedFormData.totalToPay,
          monthlyIncome: updatedFormData.monthlyIncome,
          monthlyExpenses: updatedFormData.monthlyExpenses,
          maxQuota: updatedFormData.maxQuota,
          maxAmount: updatedFormData.maxAmount,
          desiredQuota: updatedFormData.desiredQuota,
          requiresPortfolioPurchase: updatedFormData.requiresPortfolioPurchase,
          portfolioDebts: updatedFormData.portfolioDebts,
        })
      } else if (currentStep === 5 && clienteId) {
        // Paso 5: Perfil y Formularios
        await updateCliente(clienteId, {
          laborInfo: updatedFormData.laborInfo,
          firstName: updatedFormData.firstName,
          lastName: updatedFormData.lastName,
          birthDate: updatedFormData.birthDate,
          email: updatedFormData.email,
          gender: updatedFormData.gender,
          idIssuancePlace: updatedFormData.idIssuancePlace,
          idIssuanceDate: updatedFormData.idIssuanceDate,
          birthPlace: updatedFormData.birthPlace,
          birthCountry: updatedFormData.birthCountry,
          financialDetails: updatedFormData.financialDetails,
          pensionIssuer: updatedFormData.pensionIssuer,
        })
      } else if (currentStep === 6 && clienteId) {
        // Paso 6: Requerimientos (final)
        await updateCliente(clienteId, {
          documents: updatedFormData.documents || [],
          status: 'completado',
          notes: 'Cliente completado por comercial. Pendiente de revisión por Analista 1.',
        })
        if (action === 'finishAndSubmit') {
          await submitClienteAsCredit(clienteId)
          alert('Crédito radicado y enviado al Analista 1 para revisión.')
        } else {
          alert('Crédito guardado como completado. Puedes radicarlo cuando quieras.')
        }
        router.push('/comercial')
        return
      }

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
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleStepChange = (step: number) => {
    if (!isLoading) setCurrentStep(step)
  }

  const getStepComponent = () => {
    switch (currentStep) {
      case 1:
        return <Step1Identification formData={formData} onNext={handleNextStep} />
      case 2:
        return <Step2OTP formData={formData} onNext={handleNextStep} />
      case 3:
        return <Step6RiskCentral formData={formData} onNext={handleNextStep} />
      case 4:
        return <Step7Simulator formData={formData} onNext={handleNextStep} />
      case 5:
        return <Step3FullProfile formData={formData} onNext={handleNextStep} />
      case 6:
        return <Step8Requirements formData={formData} onNext={handleNextStep} />
      default:
        return null
    }
  }

  const stepLabels = [
    'Identificación',
    'Verificación OTP',
    'Centrales Riesgo',
    'Simulador',
    'Perfil y formularios',
    'Requerimientos',
  ]

  return (
    <div className='space-y-8'>
      <div className='mb-6'>
        <h2 className='text-4xl font-bold text-gray-900 mb-2'>Nuevo Crédito</h2>
        <p className='text-gray-600'>Completa el formulario paso a paso</p>
        {clienteId && (
          <p className='text-sm text-green-600 mt-2'>
            Cliente ID: {clienteId.substring(0, 8)}...
          </p>
        )}
      </div>

      {error && (
        <div className='bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-xl flex items-start gap-3'>
          <span className='text-xl'>!</span>
          <div className='flex-1'>
            <p className='font-semibold'>Error</p>
            <p className='text-sm'>{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className='text-red-600 hover:text-red-800 font-bold'
          >
            x
          </button>
        </div>
      )}

      {isLoading && (
        <div className='bg-blue-50 border border-blue-300 text-blue-800 px-4 py-3 rounded-xl flex items-center gap-3'>
          <div className='w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin'></div>
          <p className='font-semibold'>Guardando datos...</p>
        </div>
      )}

      <div className='bg-white rounded-2xl shadow-md p-6 border border-purple-100'>
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

      <div className='bg-white rounded-2xl shadow-md p-8 border border-gray-100'>
        {getStepComponent()}
      </div>

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

        <div className='w-32'></div>
      </div>
    </div>
  )
}

export default CreacionModule
