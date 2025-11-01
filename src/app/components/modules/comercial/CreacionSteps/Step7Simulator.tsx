'use client'
import React, { useState } from 'react'
import { CreacionFormData } from '../CreacionModule/CreacionModule'

interface Props {
  formData: CreacionFormData
  onNext: (data: Partial<CreacionFormData>) => void
}

interface SimulationData {
  // Preguntas iniciales
  requiresPortfolioPurchase: boolean
  activityType: string
  pensionType?: string
  
  // Producto y corretaje
  brokeragePercentage: number
  
  // Ingresos y descuentos
  monthlyIncome: number
  monthlyDeductions: Array<{ amount: number; description: string }>
  
  // Modo de simulación
  simulationMode: 'by-amount' | 'by-quota'
  desiredAmount?: number
  desiredQuota?: number
  desiredTerm?: number
}

const Step7Simulator = ({ formData, onNext }: Props) => {
  const [subStep, setSubStep] = useState(1)
  const [simulationData, setSimulationData] = useState<SimulationData>({
    requiresPortfolioPurchase: false,
    activityType: formData.pensionType ? 'pensionado' : 'empleado',
    pensionType: formData.pensionType,
    brokeragePercentage: 0,
    monthlyIncome: formData.monthlyIncome || 0,
    monthlyDeductions: [],
    simulationMode: 'by-amount',
    desiredAmount: formData.creditAmount,
    desiredTerm: formData.creditTerm,
  })
  const [simulationResult, setSimulationResult] = useState<any>(null)
  const [newDeduction, setNewDeduction] = useState({ amount: '', description: '' })
  const [showAmortizationTable, setShowAmortizationTable] = useState(false)

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Función para calcular la tabla de amortización
  const calculateFrenchAmortization = (principal: number, monthlyRate: number, term: number) => {
    // Fórmula de cuota fija: C = P × [i(1+i)^n] / [(1+i)^n - 1]
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1)
    
    const amortizationTable = []
    let balance = principal
    
    for (let period = 1; period <= term; period++) {
      const interestPayment = balance * monthlyRate
      const principalPayment = monthlyPayment - interestPayment
      balance = balance - principalPayment
      
      amortizationTable.push({
        period,
        monthlyPayment,
        interestPayment,
        principalPayment,
        balance: Math.max(0, balance), // Evitar negativos por redondeo
      })
    }
    
    return { monthlyPayment, amortizationTable }
  }

  const calculateSimulation = () => {
    // Tasas
    const annualRate = 0.18 // 18% anual (EA)
    const monthlyRate = Math.pow(1 + annualRate, 1/12) - 1 // Tasa efectiva mensual
    const insuranceRate = 0.006 // 0.6% mensual sobre saldo
    // administrationFee removed as requested
    
    const amount = simulationData.desiredAmount || 5000000
    const term = simulationData.desiredTerm || 12
    
    // Aplicar corretaje al inicio
    const brokerageAmount = (amount * simulationData.brokeragePercentage) / 100
    const deliverableAmount = amount - brokerageAmount
    
    // Calcular tabla de amortización
    const { monthlyPayment: basePayment, amortizationTable } = calculateFrenchAmortization(amount, monthlyRate, term)
    
    // Calcular seguros y administración sobre el plan
    const totalInsurance = amortizationTable.reduce((sum, row) => {
      const insurance = row.balance * insuranceRate
      return sum + insurance
    }, 0)
    
    // Calcular totales
    const totalInterest = amortizationTable.reduce((sum, row) => sum + row.interestPayment, 0)
    const totalPrincipal = amount
    const iva = totalInsurance * 0.19
    
    // Cuota mensual total (incluye seguro)
    const insuranceMonthly = (totalInsurance / term)
    const monthlyPaymentWithExtras = basePayment + insuranceMonthly
    
    const totalCost = totalInterest + totalInsurance + iva + brokerageAmount
    const totalToPay = amount + totalCost
    
    // Verificar capacidad de pago
    const totalDeductions = simulationData.monthlyDeductions.reduce((sum, d) => sum + d.amount, 0)
    const availableIncome = simulationData.monthlyIncome - totalDeductions
    const maxQuota = availableIncome * 0.5 // Máximo 50% del ingreso disponible
    
    // Agregar columnas adicionales a la tabla de amortización
    const enhancedAmortizationTable = amortizationTable.map((row) => ({
      ...row,
      insurance: row.balance * insuranceRate,
      totalPayment: row.monthlyPayment + (row.balance * insuranceRate),
    }))
    
    setSimulationResult({
      totalAmount: amount,
      deliverableAmount,
      brokerageAmount,
      interest: totalInterest,
      insurance: totalInsurance,
      iva,
      totalCost,
      monthlyPayment: monthlyPaymentWithExtras,
      basePayment,
      term,
      availableIncome,
      maxQuota,
      isAffordable: monthlyPaymentWithExtras <= maxQuota,
      amortizationTable: enhancedAmortizationTable,
      totalToPay,
    })
    
    setSubStep(4) // Ir a resultados
  }

  const handleFinalSubmit = () => {
    onNext({
      creditAmount: simulationResult?.totalAmount || simulationData.desiredAmount,
      creditTerm: simulationResult?.term || simulationData.desiredTerm,
      monthlyIncome: simulationData.monthlyIncome,
      monthlyExpenses: simulationData.monthlyDeductions.reduce((sum, d) => sum + d.amount, 0),
    })
  }

  const addDeduction = () => {
    if (newDeduction.amount && newDeduction.description) {
      setSimulationData({
        ...simulationData,
        monthlyDeductions: [
          ...simulationData.monthlyDeductions,
          {
            amount: parseFloat(newDeduction.amount),
            description: newDeduction.description,
          },
        ],
      })
      setNewDeduction({ amount: '', description: '' })
    }
  }

  const removeDeduction = (index: number) => {
    setSimulationData({
      ...simulationData,
      monthlyDeductions: simulationData.monthlyDeductions.filter((_, i) => i !== index),
    })
  }

  const totalDeductions = simulationData.monthlyDeductions.reduce((sum, d) => sum + d.amount, 0)
  const availableIncome = simulationData.monthlyIncome - totalDeductions

  const pensionTypes = [
    { value: 'propia-vejez', label: 'Propia por Vejez' },
    { value: 'sobreviviente', label: 'Sobreviviente' },
    { value: 'invalidez', label: 'Invalidez' },
    { value: 'otra', label: 'Otra' },
  ]

  // SUB-PASO 1: Preguntas Iniciales
  const renderSubStep1 = () => (
    <div className='space-y-6'>
      <div>
        <h3 className='text-2xl font-bold text-gray-800 mb-2'>Simulación Avanzada</h3>
        <p className='text-gray-600'>Paso 1 de 3: Preguntas Iniciales</p>
      </div>

      <div>
        <label className='block text-sm font-semibold text-gray-700 mb-3'>
          ¿Requiere compra de cartera?
        </label>
        <div className='flex gap-4'>
          <button
            type='button'
            onClick={() => setSimulationData({ ...simulationData, requiresPortfolioPurchase: true })}
            className={`flex-1 px-6 py-4 rounded-lg border-2 font-semibold transition-all ${
              simulationData.requiresPortfolioPurchase
                ? 'border-primary-color bg-primary-color text-white'
                : 'border-gray-300 hover:border-primary-color'
            }`}
          >
            Sí
          </button>
          <button
            type='button'
            onClick={() => setSimulationData({ ...simulationData, requiresPortfolioPurchase: false })}
            className={`flex-1 px-6 py-4 rounded-lg border-2 font-semibold transition-all ${
              !simulationData.requiresPortfolioPurchase
                ? 'border-primary-color bg-primary-color text-white'
                : 'border-gray-300 hover:border-primary-color'
            }`}
          >
            No
          </button>
        </div>
      </div>

      <div>
        <label className='block text-sm font-semibold text-gray-700 mb-3'>Tipo de Actividad</label>
        <select
          value={simulationData.activityType}
          onChange={(e) => setSimulationData({ ...simulationData, activityType: e.target.value, pensionType: e.target.value !== 'pensionado' ? undefined : simulationData.pensionType })}
          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
        >
          <option value='pensionado'>Pensionado</option>
          <option value='empleado'>Empleado</option>
          <option value='independiente'>Independiente</option>
        </select>
      </div>

      {simulationData.activityType === 'pensionado' && (
        <div>
          <label className='block text-sm font-semibold text-gray-700 mb-3'>Tipo de Pensión</label>
          <select
            value={simulationData.pensionType || ''}
            onChange={(e) => setSimulationData({ ...simulationData, pensionType: e.target.value })}
            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
          >
            <option value=''>Selecciona un tipo</option>
            {pensionTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
        <p className='text-sm text-blue-800'>
          ℹ️ Esta información nos ayuda a calcular las condiciones más adecuadas para tu crédito
        </p>
      </div>

      <button
        type='button'
        onClick={() => setSubStep(2)}
        className='w-full px-6 py-3 bg-gradient-to-r from-primary-color to-accent-color text-white font-semibold rounded-lg hover:shadow-lg transition-all'
      >
        Continuar →
      </button>
    </div>
  )

  // SUB-PASO 2: Corretaje
  const renderSubStep2 = () => (
    <div className='space-y-6'>
      <div>
        <h3 className='text-2xl font-bold text-gray-800 mb-2'>Simulación Avanzada</h3>
        <p className='text-gray-600'>Paso 2 de 3: Producto y Corretaje</p>
      </div>

      <div>
              <div className='flex justify-between mb-2'>
                <label className='block text-sm font-semibold text-gray-700'>Porcentaje de Corretaje</label>
                <span className='text-primary-color font-bold'>{simulationData.brokeragePercentage}%</span>
              </div>
              <input
                type='range'
                min='0'
                max='7'
                step='0.5'
                value={simulationData.brokeragePercentage}
                onChange={(e) => setSimulationData({ ...simulationData, brokeragePercentage: parseFloat(e.target.value) })}
                className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-color'
              />
              <div className='flex justify-between text-xs text-gray-500 mt-2'>
                <span>0%</span>
                <span>Máximo: 7%</span>
              </div>
        <p className='text-xs text-gray-600 mt-2'>
          El corretaje es la comisión que se descuenta del monto total
        </p>
      </div>


      <div className='flex gap-4'>
        <button
          type='button'
          onClick={() => setSubStep(1)}
          className='px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50'
        >
          ← Anterior
        </button>
        <button
          type='button'
          onClick={() => setSubStep(3)}
          className='flex-1 px-6 py-3 bg-gradient-to-r from-primary-color to-accent-color text-white font-semibold rounded-lg hover:shadow-lg'
        >
          Continuar →
        </button>
      </div>
    </div>
  )

  // SUB-PASO 3: Ingresos y Simulación
  const renderSubStep3 = () => (
    <div className='space-y-6'>
      <div>
        <h3 className='text-2xl font-bold text-gray-800 mb-2'>Simulación Avanzada</h3>
        <p className='text-gray-600'>Paso 3 de 3: Ingresos y Parámetros</p>
      </div>

      <div>
        <label className='block text-sm font-semibold text-gray-700 mb-2'>Ingresos Mensuales</label>
        <div className='relative'>
          <span className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold'>$</span>
          <input
            type='text'
            value={simulationData.monthlyIncome ? simulationData.monthlyIncome.toLocaleString('es-CO') : ''}
            onChange={(e) => {
              const value = e.target.value.replace(/[^\d]/g, '')
              setSimulationData({ ...simulationData, monthlyIncome: parseFloat(value) || 0 })
            }}
            placeholder='3,000,000'
            className='w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
          />
        </div>
      </div>

      <div>
        <label className='block text-sm font-semibold text-gray-700 mb-2'>Descuentos Mensuales</label>
        
        {simulationData.monthlyDeductions.length > 0 && (
          <div className='space-y-2 mb-4'>
            {simulationData.monthlyDeductions.map((deduction, index) => (
              <div key={index} className='flex items-center justify-between bg-gray-50 p-3 rounded-lg'>
                <div>
                  <p className='font-semibold text-gray-800'>{deduction.description}</p>
                  <p className='text-sm text-gray-600'>{formatCurrency(deduction.amount)}</p>
                </div>
                <button
                  type='button'
                  onClick={() => removeDeduction(index)}
                  className='px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm'
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}

        <div className='grid grid-cols-2 gap-3 mb-2'>
          <input
            type='text'
            value={newDeduction.description}
            onChange={(e) => setNewDeduction({ ...newDeduction, description: e.target.value })}
            placeholder='Descripción'
            className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
          />
          <div className='relative'>
            <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-sm'>$</span>
            <input
              type='text'
              value={newDeduction.amount ? parseFloat(newDeduction.amount).toLocaleString('es-CO') : ''}
              onChange={(e) => {
                const value = e.target.value.replace(/[^\d]/g, '')
                setNewDeduction({ ...newDeduction, amount: value })
              }}
              placeholder='500,000'
              className='w-full pl-7 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
            />
          </div>
        </div>
        <button
          type='button'
          onClick={addDeduction}
          className='w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold text-sm'
        >
          + Agregar Descuento
        </button>
      </div>

      <div>
        <label className='block text-sm font-semibold text-gray-700 mb-3'>Modo de Simulación</label>
        <div className='grid grid-cols-2 gap-4 mb-4'>
          <button
            type='button'
            onClick={() => setSimulationData({ ...simulationData, simulationMode: 'by-amount' })}
            className={`px-6 py-4 rounded-lg border-2 font-semibold transition-all ${
              simulationData.simulationMode === 'by-amount'
                ? 'border-primary-color bg-primary-color text-white'
                : 'border-gray-300 hover:border-primary-color'
            }`}
          >
            Por Monto
          </button>
          <button
            type='button'
            onClick={() => setSimulationData({ ...simulationData, simulationMode: 'by-quota' })}
            className={`px-6 py-4 rounded-lg border-2 font-semibold transition-all ${
              simulationData.simulationMode === 'by-quota'
                ? 'border-primary-color bg-primary-color text-white'
                : 'border-gray-300 hover:border-primary-color'
            }`}
          >
            Por Cuota
          </button>
        </div>

        {simulationData.simulationMode === 'by-amount' && (
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>Monto Deseado</label>
              <div className='relative'>
                <span className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold'>$</span>
                <input
                  type='text'
                  value={simulationData.desiredAmount ? simulationData.desiredAmount.toLocaleString('es-CO') : ''}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '')
                    setSimulationData({ ...simulationData, desiredAmount: parseFloat(value) || undefined })
                  }}
                  placeholder='10,000,000'
                  className='w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
                />
              </div>
            </div>
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>Plazo (meses)</label>
              <input
                type='number'
                value={simulationData.desiredTerm || ''}
                onChange={(e) => setSimulationData({ ...simulationData, desiredTerm: parseInt(e.target.value) || undefined })}
                placeholder='Ej: 36'
                min='6'
                max='72'
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
              />
            </div>
          </div>
        )}

        {simulationData.simulationMode === 'by-quota' && (
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>Cuota Deseada</label>
              <div className='relative'>
                <span className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold'>$</span>
                <input
                  type='text'
                  value={simulationData.desiredQuota ? simulationData.desiredQuota.toLocaleString('es-CO') : ''}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '')
                    setSimulationData({ ...simulationData, desiredQuota: parseFloat(value) || undefined })
                  }}
                  placeholder='300,000'
                  className='w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
                />
              </div>
            </div>
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>Plazo (meses)</label>
              <input
                type='number'
                value={simulationData.desiredTerm || ''}
                onChange={(e) => setSimulationData({ ...simulationData, desiredTerm: parseInt(e.target.value) || undefined })}
                placeholder='Ej: 36'
                min='6'
                max='72'
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
              />
            </div>
          </div>
        )}
      </div>

      <div className='flex gap-4'>
        <button
          type='button'
          onClick={() => setSubStep(2)}
          className='px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50'
        >
          ← Anterior
        </button>
        <button
          type='button'
          onClick={calculateSimulation}
          disabled={simulationData.monthlyIncome === 0}
          className='flex-1 px-6 py-3 bg-gradient-to-r from-primary-color to-accent-color text-white font-semibold rounded-lg hover:shadow-lg disabled:opacity-50'
        >
          Calcular Simulación →
        </button>
      </div>
    </div>
  )

  // SUB-PASO 4: Resultados
  const renderSubStep4 = () => (
    <div className='space-y-6'>
      <div>
        <h3 className='text-2xl font-bold text-gray-800 mb-2'>Resultado de la Simulación</h3>
        <p className='text-gray-600'>Resumen de tu crédito libranza</p>
      </div>


      {simulationResult && (
        <>
          <div className='bg-gradient-to-r from-primary-color to-accent-color rounded-xl p-6 text-white'>
            <p className='text-sm opacity-90 mb-1'>Cuota Mensual</p>
            <p className='text-4xl font-bold'>{formatCurrency(simulationResult.monthlyPayment)}</p>
            {simulationResult.isAffordable ? (
              <p className='text-sm mt-2 opacity-90'>✅ Dentro de tu capacidad de pago</p>
            ) : (
              <p className='text-sm mt-2 bg-red-500/20 px-3 py-1 rounded'>
                ⚠️ Supera tu capacidad de pago (máx: {formatCurrency(simulationResult.maxQuota)})
              </p>
            )}
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='bg-white border-2 border-gray-200 rounded-lg p-4'>
              <p className='text-sm text-gray-600 mb-1'>Monto Total</p>
              <p className='text-2xl font-bold text-gray-800'>{formatCurrency(simulationResult.totalAmount)}</p>
            </div>
            <div className='bg-white border-2 border-green-200 rounded-lg p-4'>
              <p className='text-sm text-gray-600 mb-1'>Monto a Entregar</p>
              <p className='text-2xl font-bold text-green-600'>{formatCurrency(simulationResult.deliverableAmount)}</p>
            </div>
          </div>

          <div className='bg-white border border-gray-200 rounded-lg p-4'>
            <h4 className='font-semibold text-gray-800 mb-3'>Desglose de Costos</h4>
            <div className='space-y-2 text-sm'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Corretaje:</span>
                <span className='font-bold'>{formatCurrency(simulationResult.brokerageAmount)}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Intereses:</span>
                <span className='font-bold'>{formatCurrency(simulationResult.interest)}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Seguro:</span>
                <span className='font-bold'>{formatCurrency(simulationResult.insurance)}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>IVA:</span>
                <span className='font-bold'>{formatCurrency(simulationResult.iva)}</span>
              </div>
              <div className='border-t pt-2 flex justify-between'>
                <span className='font-semibold text-gray-800'>Total Costos:</span>
                <span className='font-bold text-primary-color'>{formatCurrency(simulationResult.totalCost)}</span>
              </div>
            </div>
          </div>

          {/* Tabla de Amortización */}
          <div className='bg-white border-2 border-purple-200 rounded-xl overflow-hidden'>
            <button
              type='button'
              onClick={() => setShowAmortizationTable(!showAmortizationTable)}
              className='w-full flex items-center justify-between p-5 bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 transition-all'
            >
              <div className='flex items-center gap-3'>
                <span className='text-2xl'>📊</span>
                <div className='text-left'>
                  <h4 className='font-bold text-purple-900 text-lg'>Tabla de Amortización</h4>
                  <p className='text-sm text-purple-700'>Plan de pagos - {simulationResult.term} cuotas</p>
                </div>
              </div>
              <svg 
                className={`w-6 h-6 text-purple-700 transition-transform ${showAmortizationTable ? 'rotate-180' : ''}`} 
                fill='none' 
                stroke='currentColor' 
                viewBox='0 0 24 24'
              >
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
              </svg>
            </button>

            {showAmortizationTable && (
              <div className='p-5 bg-white max-h-96 overflow-y-auto'>
                <div className='overflow-x-auto'>
                  <table className='w-full text-sm'>
                    <thead className='bg-purple-600 text-white sticky top-0'>
                      <tr>
                        <th className='px-3 py-3 text-left font-semibold'>#</th>
                        <th className='px-3 py-3 text-right font-semibold'>Interés</th>
                        <th className='px-3 py-3 text-right font-semibold'>Capital</th>
                        <th className='px-3 py-3 text-right font-semibold'>Seguro</th>
                        <th className='px-3 py-3 text-right font-semibold'>Cuota Total</th>
                        <th className='px-3 py-3 text-right font-semibold'>Saldo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {simulationResult.amortizationTable.map((row: any, idx: number) => (
                        <tr 
                          key={idx} 
                          className={`border-b border-gray-200 hover:bg-purple-50 transition-colors ${
                            idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                          }`}
                        >
                          <td className='px-3 py-3 font-semibold text-purple-700'>{row.period}</td>
                          <td className='px-3 py-3 text-right text-red-600'>{formatCurrency(row.interestPayment)}</td>
                          <td className='px-3 py-3 text-right text-green-600 font-semibold'>{formatCurrency(row.principalPayment)}</td>
                          <td className='px-3 py-3 text-right text-orange-600'>{formatCurrency(row.insurance)}</td>
                          <td className='px-3 py-3 text-right font-bold text-purple-700'>{formatCurrency(row.totalPayment)}</td>
                          <td className='px-3 py-3 text-right font-semibold text-gray-700'>{formatCurrency(row.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className='bg-purple-100 font-bold'>
                      <tr>
                        <td className='px-3 py-4 text-left'>TOTALES:</td>
                        <td className='px-3 py-4 text-right text-red-600'>{formatCurrency(simulationResult.interest)}</td>
                        <td className='px-3 py-4 text-right text-green-600'>{formatCurrency(simulationResult.totalAmount)}</td>
                        <td className='px-3 py-4 text-right text-orange-600'>{formatCurrency(simulationResult.insurance)}</td>
                        <td className='px-3 py-4 text-right text-purple-700 text-lg'>{formatCurrency(simulationResult.totalToPay)}</td>
                        <td className='px-3 py-4 text-right text-green-600 font-bold'>$0</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Nota explicativa */}
                <div className='mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3'>
                  <p className='text-xs text-blue-800'>
                    <strong>Nota:</strong> La cuota total varía cada mes porque el seguro se calcula sobre el saldo pendiente. 
                    A medida que el saldo disminuye, el seguro también disminuye. La parte de capital + interés permanece constante.
                  </p>
                </div>
              </div>
            )}
          </div>


          <div className='flex gap-4'>
            <button
              type='button'
              onClick={() => setSubStep(3)}
              className='px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50'
            >
              ← Modificar
            </button>
            <button
              type='button'
              onClick={handleFinalSubmit}
              className='flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:shadow-lg'
            >
              Aceptar y Continuar →
            </button>
          </div>
        </>
      )}
    </div>
  )

  return (
    <div className='space-y-6'>
      {subStep === 1 && renderSubStep1()}
      {subStep === 2 && renderSubStep2()}
      {subStep === 3 && renderSubStep3()}
      {subStep === 4 && renderSubStep4()}
    </div>
  )
}

export default Step7Simulator
