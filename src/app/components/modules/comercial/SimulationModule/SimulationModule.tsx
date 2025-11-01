'use client'
import React, { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import { useCommercialAuth } from '../../../../context/CommercialAuthContext'
import { calculateSimulation, saveSimulation, getSimulations } from '../../../../services/commercialSimulation'
import SimulationStep1 from '../SimulationSteps/SimulationStep1'
import SimulationStep2 from '../SimulationSteps/SimulationStep2'
import SimulationStep3 from '../SimulationSteps/SimulationStep3'
import SimulationResults from '../SimulationSteps/SimulationResults'

export interface SimulationFormData {
  // Step 1: Preguntas iniciales
  requiresPortfolioPurchase: boolean
  pensionType?: string

  // Step 2: Selección de producto
  brokeragePercentage: number
  activityType: string

  // Step 3: Ingresos y descuentos
  monthlyIncome: number
  monthlyDeductions: Array<{ amount: number; description: string }>

  // Step 4: Modo de simulación
  simulationMode: 'by-amount' | 'by-quota'
  desiredAmount?: number
  desiredQuota?: number
  desiredTerm?: number

  // Cliente info (opcional)
  clienteId?: string
  clientName?: string
  clientDocument?: string
  notes?: string
}

const SimulationModule = () => {
  const { isAuthenticated } = useCommercialAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [simulationResult, setSimulationResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [savedSimulations, setSavedSimulations] = useState<any[]>([])

  const formik = useFormik<SimulationFormData>({
    initialValues: {
      requiresPortfolioPurchase: false,
      brokeragePercentage: 0,
      activityType: 'pensionado',
      monthlyIncome: 0,
      monthlyDeductions: [],
      simulationMode: 'by-amount',
      desiredTerm: 36,
    },
    onSubmit: async (values) => {
      // This will be handled in SimulationResults
    },
  })

  const calculateSimulationHandler = async () => {
    setLoading(true)
    try {
      const data = await calculateSimulation({
        requiresPortfolioPurchase: formik.values.requiresPortfolioPurchase,
        pensionType: formik.values.pensionType,
        brokeragePercentage: formik.values.brokeragePercentage,
        activityType: formik.values.activityType,
        monthlyIncome: formik.values.monthlyIncome,
        monthlyDeductions: formik.values.monthlyDeductions,
        simulationMode: formik.values.simulationMode,
        desiredAmount: formik.values.desiredAmount,
        desiredQuota: formik.values.desiredQuota,
        desiredTerm: formik.values.desiredTerm,
      })
      setSimulationResult(data)
      setCurrentStep(4)
    } catch (error: any) {
      console.error('Error calculating simulation:', error)
      alert(error.response?.data?.message || 'Error al calcular la simulación')
    } finally {
      setLoading(false)
    }
  }

  const saveSimulationHandler = async () => {
    setLoading(true)
    try {
      await saveSimulation({
        ...formik.values,
        clienteId: formik.values.clienteId,
      })
      alert('Simulación guardada exitosamente')
      fetchSavedSimulations()
    } catch (error: any) {
      console.error('Error saving simulation:', error)
      alert(error.response?.data?.message || 'Error al guardar la simulación')
    } finally {
      setLoading(false)
    }
  }

  const fetchSavedSimulations = async () => {
    try {
      const data = await getSimulations('saved')
      setSavedSimulations(data)
    } catch (error) {
      console.error('Error fetching saved simulations:', error)
    }
  }

  useEffect(() => {
    if (session) {
      fetchSavedSimulations()
    }
  }, [session])

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleCalculate = () => {
    // Validate required fields
    if (currentStep === 1 && !formik.values.pensionType && formik.values.activityType === 'pensionado') {
      alert('Por favor selecciona el tipo de pensión')
      return
    }
    if (currentStep === 2 && formik.values.brokeragePercentage === 0) {
      alert('Por favor ingresa el porcentaje de corretaje')
      return
    }
    if (currentStep === 3 && formik.values.monthlyIncome === 0) {
      alert('Por favor ingresa los ingresos mensuales')
      return
    }
    calculateSimulationHandler()
  }

  const getStepComponent = () => {
    switch (currentStep) {
      case 1:
        return (
          <SimulationStep1
            formData={formik.values}
            onNext={handleNext}
            onChange={(data) => formik.setValues({ ...formik.values, ...data })}
          />
        )
      case 2:
        return (
          <SimulationStep2
            formData={formik.values}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onChange={(data) => formik.setValues({ ...formik.values, ...data })}
          />
        )
      case 3:
        return (
          <SimulationStep3
            formData={formik.values}
            onNext={handleCalculate}
            onPrevious={handlePrevious}
            onChange={(data) => formik.setValues({ ...formik.values, ...data })}
          />
        )
      case 4:
        return (
          <SimulationResults
            simulationResult={simulationResult}
            formData={formik.values}
            onSave={saveSimulationHandler}
            onBack={handlePrevious}
            onConvert={() => {
              // Navigate to credit creation
              alert('Funcionalidad de conversión a crédito próximamente')
            }}
            loading={loading}
          />
        )
      default:
        return null
    }
  }

  const stepLabels = [
    'Preguntas Iniciales',
    'Selección de Producto',
    'Ingresos y Descuentos',
    'Resultados',
  ]

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div>
        <h2 className='text-3xl font-bold text-gray-800 mb-2'>Simulación de Crédito</h2>
        <p className='text-gray-600'>Simula créditos de libranza para tus clientes</p>
      </div>

      {/* Progress Bar */}
      {currentStep < 4 && (
        <div className='bg-white rounded-lg shadow-md p-6'>
          <div className='flex items-center justify-between mb-6 overflow-x-auto pb-4'>
            {stepLabels.map((label, index) => {
              const step = index + 1
              const isCompleted = step < currentStep
              const isActive = step === currentStep

              return (
                <div key={step} className='flex items-center flex-shrink-0'>
                  <button
                    onClick={() => step <= currentStep && setCurrentStep(step)}
                    className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-primary-color to-accent-color text-white shadow-lg scale-110'
                        : isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-300 text-gray-700'
                    }`}
                  >
                    {isCompleted ? '✓' : step}
                  </button>
                  <div className='hidden lg:block ml-2 mr-4'>
                    <p
                      className={`text-xs font-semibold ${
                        isActive
                          ? 'text-primary-color'
                          : isCompleted
                          ? 'text-green-500'
                          : 'text-gray-600'
                      }`}
                    >
                      {label}
                    </p>
                  </div>
                  {step < stepLabels.length && (
                    <div
                      className={`h-1 flex-shrink-0 mr-4 ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                      style={{ width: '40px' }}
                    ></div>
                  )}
                </div>
              )
            })}
          </div>

          <div className='w-full bg-gray-200 rounded-full h-2'>
            <div
              className='bg-gradient-to-r from-primary-color to-accent-color h-2 rounded-full transition-all duration-300'
              style={{ width: `${(currentStep / stepLabels.length) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Step Content */}
      <div className='bg-white rounded-lg shadow-md p-8'>{getStepComponent()}</div>

      {/* Saved Simulations */}
      {savedSimulations.length > 0 && currentStep === 1 && (
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h3 className='text-xl font-bold text-gray-800 mb-4'>Simulaciones Guardadas</h3>
          <div className='space-y-3'>
            {savedSimulations.map((sim) => (
              <div
                key={sim._id}
                className='border border-gray-200 rounded-lg p-4 hover:border-primary-color transition-colors'
              >
                <div className='flex justify-between items-start'>
                  <div>
                    <p className='font-semibold text-gray-800'>
                      {sim.clientName || 'Cliente sin nombre'}
                    </p>
                    <p className='text-sm text-gray-600'>
                      {sim.clientDocument || 'Sin documento'}
                    </p>
                    <p className='text-sm text-gray-500 mt-1'>
                      {sim.finalAmount
                        ? `Monto: ${new Intl.NumberFormat('es-CO', {
                            style: 'currency',
                            currency: 'COP',
                          }).format(sim.finalAmount)}`
                        : 'Simulación sin calcular'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      // Load simulation data
                      formik.setValues({
                        ...sim,
                        monthlyDeductions: sim.monthlyDeductions || [],
                      })
                      if (sim.finalAmount) {
                        setSimulationResult(sim)
                        setCurrentStep(4)
                      } else {
                        setCurrentStep(2)
                      }
                    }}
                    className='px-4 py-2 bg-primary-color text-white rounded-lg hover:bg-accent-color transition-colors text-sm'
                  >
                    Cargar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SimulationModule

