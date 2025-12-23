'use client'
import React, { useEffect, useState } from 'react'
import { CreacionFormData } from '../CreacionModule/CreacionModule'
import { calculateSimulation as calculateSimulationAPI, saveSimulation } from '../../../../services/commercialSimulation'

interface Props {
  formData: CreacionFormData
  onNext: (data: Partial<CreacionFormData>) => void
}

interface SimulationData {
  // Preguntas iniciales
  requiresPortfolioPurchase: boolean
  activityType: string
  pensionType?: string
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
  
  // Producto y corretaje
  brokeragePercentage: number
  
  // Ingresos y capacidad
  monthlyIncome: number
  monthlyExpenseAuto: number
  maxQuota: number
  maxAmount: number

  // Selección editable
  desiredAmount: number
  desiredQuota: number
  desiredTerm: number
}

const Step7Simulator = ({ formData, onNext }: Props) => {
  const randomObligation = () => `${Math.floor(100000 + Math.random() * 900000)}`

  const portfolioSeed = [
    {
      id: 'deuda-1',
      entity: 'Banco de Occidente',
      balance: 4500,
      installment: 210,
      lineOfCredit: 'VEH',
      obligationNumber: randomObligation(),
      status: 'Vigente',
      rating: 'A',
      selected: true,
    },
    {
      id: 'deuda-2',
      entity: 'Banco Popular',
      balance: 2800,
      installment: 150,
      lineOfCredit: 'LIB',
      obligationNumber: randomObligation(),
      status: 'Vencida',
      rating: 'B',
      selected: false,
    },
    {
      id: 'deuda-3',
      entity: 'Banco de Bogotá',
      balance: 1800,
      installment: 120,
      lineOfCredit: 'TDC',
      obligationNumber: randomObligation(),
      status: 'Saldada',
      rating: 'C',
      selected: false,
    },
  ]

  // Determinar tipo de actividad basado en personType seleccionado en identificación
  const getActivityType = () => {
    if (formData.personType === 'empleado') return 'empleado'
    return 'pensionado' // Default para pensionados o si no está definido
  }

  const [subStep, setSubStep] = useState(1)
  const [simulationData, setSimulationData] = useState<SimulationData>({
    requiresPortfolioPurchase: formData.requiresPortfolioPurchase || false,
    activityType: getActivityType(),
    pensionType: formData.pensionType,
    brokeragePercentage: 0,
    monthlyIncome: formData.monthlyIncome || 0,
    monthlyExpenseAuto: Math.round((formData.monthlyIncome || 0) * 0.08),
    maxQuota: Math.round(((formData.monthlyIncome || 0) - (formData.monthlyIncome || 0) * 0.08) / 2) || 0,
    maxAmount: 0,
    desiredAmount: formData.creditAmount || 0,
    desiredQuota: formData.monthlyPayment || 0,
    desiredTerm: formData.creditTerm || 144,
    portfolioDebts: portfolioSeed,
  })
  const [simulationResult, setSimulationResult] = useState<any>(null)
  const [showAmortizationTable, setShowAmortizationTable] = useState(false)
  const [lastEdit, setLastEdit] = useState<'amount' | 'quota' | 'auto'>('auto')
  const activityLabels: Record<string, string> = {
    pensionado: 'Pensionado',
    empleado: 'Empleado',
    independiente: 'Independiente',
  }

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
    const term = simulationData.desiredTerm || 12
    const fpm = factorByMonths[term] || factorByMonths[144]

    // Determinar monto/cuota según última edición
    let amount = simulationData.desiredAmount || 0
    if (lastEdit === 'quota') {
      amount = simulationData.desiredQuota ? (simulationData.desiredQuota * 1_000_000) / fpm : 0
    }
    const derivedQuota = fpm ? (amount / 1_000_000) * fpm : 0

    // Tasas demo para la tabla (referencial)
    const annualRate = 0.18
    const monthlyRate = Math.pow(1 + annualRate, 1/12) - 1
    const insuranceRate = 0.006

    const brokerageAmount = (amount * simulationData.brokeragePercentage) / 100
    const deliverableAmount = amount - brokerageAmount

    const { amortizationTable } = calculateFrenchAmortization(amount, monthlyRate, term)

    const totalInsurance = amortizationTable.reduce((sum, row) => sum + row.balance * insuranceRate, 0)
    const totalInterest = amortizationTable.reduce((sum, row) => sum + row.interestPayment, 0)
    const iva = totalInsurance * 0.19
    const totalCost = totalInterest + totalInsurance + iva + brokerageAmount
    const totalToPay = amount + totalCost

    const enhancedAmortizationTable = amortizationTable.map((row) => ({
      ...row,
      insurance: row.balance * insuranceRate,
      totalPayment: row.monthlyPayment + row.balance * insuranceRate,
    }))

    setSimulationResult({
      totalAmount: amount,
      deliverableAmount,
      brokerageAmount,
      interest: totalInterest,
      insurance: totalInsurance,
      iva,
      totalCost,
      monthlyPayment: derivedQuota,
      basePayment: derivedQuota,
      term,
      availableIncome: simulationData.monthlyIncome - simulationData.monthlyExpenseAuto,
      maxQuota: simulationData.maxQuota,
      isAffordable: derivedQuota <= simulationData.maxQuota,
      amortizationTable: enhancedAmortizationTable,
      totalToPay,
    })

    setSubStep(4) // Ir a resultados
  }

  const handleFinalSubmit = async () => {
    // Solo intentamos guardar simulación en modo demo; si falla, continuamos igual
    const isDemoMode = (() => {
      if (typeof window === 'undefined') return false
      const token = sessionStorage.getItem('comercial_token')
      return token?.startsWith('demo-token-') ?? false
    })()

    if (simulationResult && isDemoMode) {
      const simulationToSave = {
        requiresPortfolioPurchase: simulationData.requiresPortfolioPurchase,
        activityType: simulationData.activityType,
        pensionType: simulationData.pensionType,
        monthlyIncome: simulationData.monthlyIncome,
        monthlyExpenseAuto: simulationData.monthlyExpenseAuto,
        desiredAmount: simulationData.desiredAmount,
        desiredQuota: simulationData.desiredQuota,
        desiredTerm: simulationData.desiredTerm,
        brokeragePercentage: simulationData.brokeragePercentage,
        clientName: `${formData.firstName} ${formData.lastName}`,
        clientDocument: formData.identificationNumber,
      }

      try {
        await saveSimulation(simulationToSave)
      } catch {
        // ignorar en demo
      }
    }

    // Pasar los datos al siguiente paso
    onNext({
      creditAmount: simulationResult?.deliverableAmount || simulationData.desiredAmount,
      creditTerm: simulationResult?.term || simulationData.desiredTerm,
      monthlyPayment: simulationResult?.monthlyPayment,
      totalInterest: simulationResult?.interest,
      totalToPay: simulationResult?.totalToPay,
      monthlyIncome: simulationData.monthlyIncome,
      monthlyExpenses: simulationData.monthlyExpenseAuto,
      maxQuota: simulationData.maxQuota,
      maxAmount: simulationData.maxAmount,
      desiredQuota: simulationData.desiredQuota,
      requiresPortfolioPurchase: simulationData.requiresPortfolioPurchase,
      portfolioDebts: simulationData.portfolioDebts,
    })
  }

  // Factores por millón extendidos hasta 144 meses (valores demo decrecientes)
  const factorByMonths: Record<number, number> = {
    12: 94539,
    24: 51122,
    36: 36752,
    48: 29643,
    60: 25437,
    72: 23000,
    84: 21000,
    96: 19500,
    108: 18200,
    120: 17000,
    132: 16000,
    144: 15000,
  }

  const recalcCapacity = (income: number, term: number) => {
    const sanitizedIncome = income || 0
    const expense = Math.round(sanitizedIncome * 0.08)
    const quotaCap = Math.round((sanitizedIncome - expense) / 2)
    const fpm = factorByMonths[term] || factorByMonths[144]
    const maxAmount = fpm ? Math.round((quotaCap * 1_000_000) / fpm) : 0

    setSimulationData((prev) => ({
      ...prev,
      monthlyIncome: sanitizedIncome,
      monthlyExpenseAuto: expense,
      maxQuota: quotaCap,
      maxAmount,
      desiredTerm: term,
      desiredQuota: quotaCap,
      desiredAmount: maxAmount,
    }))
    setLastEdit('auto')
  }

  useEffect(() => {
    recalcCapacity(simulationData.monthlyIncome, simulationData.desiredTerm || 144)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const selectedPortfolioDebts = (simulationData.portfolioDebts || []).filter((d) => d.selected)
  const totalPortfolioBalance = selectedPortfolioDebts.reduce((sum, d) => sum + d.balance, 0)
  const totalPortfolioInstallment = selectedPortfolioDebts.reduce((sum, d) => sum + d.installment, 0)

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

      <div className='bg-gray-50 border border-gray-200 rounded-lg p-4'>
        <p className='text-xs uppercase text-gray-500 font-semibold tracking-wide'>Tipo de actividad registrado</p>
        <p className='text-lg font-bold text-gray-800'>
          {activityLabels[simulationData.activityType] || 'No especificado'}
        </p>
        <p className='text-sm text-gray-500'>Dato traido de los pasos anteriores del cliente</p>
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

      {simulationData.requiresPortfolioPurchase && (
          <div className='bg-white border border-gray-200 rounded-lg p-4 space-y-3'>
            <h4 className='text-lg font-semibold text-gray-800'>Compra de Cartera</h4>
            <p className='text-sm text-gray-600'>Selecciona las deudas que se comprarán y se sumarán al monto solicitado.</p>
            <div className='overflow-x-auto border border-gray-200 rounded-lg'>
              <table className='min-w-full text-sm'>
                <thead className='bg-gray-100 text-gray-700'>
                  <tr>
                    <th className='px-3 py-2 text-left'>Seleccionar</th>
                    <th className='px-3 py-2 text-left'>Entidad</th>
                    <th className='px-3 py-2 text-left'>Línea de crédito</th>
                    <th className='px-3 py-2 text-left'>No. Obligación</th>
                    <th className='px-3 py-2 text-right'>Saldo</th>
                    <th className='px-3 py-2 text-right'>Valor cuota</th>
                    <th className='px-3 py-2 text-left'>Estado</th>
                    <th className='px-3 py-2 text-left'>Calificación</th>
                  </tr>
                </thead>
                <tbody>
                  {simulationData.portfolioDebts?.map((debt) => (
                    <tr key={debt.id} className='border-t border-gray-200 hover:bg-gray-50 transition-colors'>
                      <td className='px-3 py-3'>
                        <input
                          type='checkbox'
                          checked={!!debt.selected}
                          onChange={() =>
                            setSimulationData({
                              ...simulationData,
                              portfolioDebts: simulationData.portfolioDebts?.map((d) =>
                                d.id === debt.id ? { ...d, selected: !d.selected } : d
                              ),
                            })
                          }
                          className='h-4 w-4'
                        />
                      </td>
                      <td className='px-3 py-3 font-semibold text-gray-800'>{debt.entity}</td>
                      <td className='px-3 py-3 text-gray-700'>{debt.lineOfCredit}</td>
                      <td className='px-3 py-3 text-gray-700'>{debt.obligationNumber}</td>
                      <td className='px-3 py-3 text-right font-semibold text-gray-900'>
                        {formatCurrency(debt.balance)}
                      </td>
                      <td className='px-3 py-3 text-right text-gray-800'>
                        {formatCurrency(debt.installment)}
                      </td>
                      <td className='px-3 py-3'>
                        <span className='inline-flex px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold'>
                          {debt.status}
                        </span>
                      </td>
                      <td className='px-3 py-3'>
                        <span className='inline-flex px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold'>
                          {debt.rating}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className='flex items-center justify-between text-sm text-gray-700'>
              <span>Saldo a comprar seleccionado:</span>
              <span className='font-semibold text-gray-900'>{formatCurrency(totalPortfolioBalance)}</span>
            </div>
            <div className='flex items-center justify-between text-sm text-gray-700'>
              <span>Cuotas actuales de esas deudas:</span>
              <span className='font-semibold text-gray-900'>{formatCurrency(totalPortfolioInstallment)}</span>
            </div>
          </div>
        )}

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

  // SUB-PASO 3: Ingresos y Simulación (simplificado)
  const renderSubStep3 = () => (
    <div className='space-y-6'>
      <div>
        <h3 className='text-2xl font-bold text-gray-800 mb-2'>Simulación Avanzada</h3>
        <p className='text-gray-600'>Paso 3 de 3: Ingresos y capacidad</p>
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
              const incomeVal = parseFloat(value) || 0
              recalcCapacity(incomeVal, simulationData.desiredTerm || 144)
            }}
            placeholder='3,000,000'
            className='w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
          />
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='bg-gray-50 border border-gray-200 rounded-lg p-4'>
          <p className='text-sm text-gray-600 font-semibold mb-1'>Egresos automáticos (8%)</p>
          <p className='text-2xl font-bold text-gray-800'>{formatCurrency(simulationData.monthlyExpenseAuto)}</p>
          <p className='text-xs text-gray-500 mt-1'>Calculado automáticamente sobre tus ingresos</p>
        </div>
        <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
          <p className='text-sm text-green-700 font-semibold mb-1'>Cuota máxima sugerida</p>
          <p className='text-2xl font-bold text-green-700'>{formatCurrency(simulationData.maxQuota)}</p>
        </div>
      </div>

      <div className='bg-white border border-gray-200 rounded-lg p-4 space-y-4'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>Plazo (meses)</label>
            <select
              value={simulationData.desiredTerm}
              onChange={(e) => {
                const termVal = parseInt(e.target.value) || 144
                recalcCapacity(simulationData.monthlyIncome, termVal)
              }}
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color bg-white'
            >
              {Object.keys(factorByMonths)
                .map((m) => parseInt(m))
                .sort((a, b) => a - b)
                .map((months) => (
                  <option key={months} value={months}>
                    {months} meses
                  </option>
                ))}
            </select>
            <p className='text-xs text-gray-500 mt-1'>Por defecto 144 meses para máxima capacidad.</p>
          </div>
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>Cuota máxima (auto)</label>
            <input
              type='text'
              value={simulationData.maxQuota ? Math.round(simulationData.maxQuota).toLocaleString('es-CO') : ''}
              readOnly
              className='w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700'
            />
          </div>
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>Monto máximo (auto)</label>
            <input
              type='text'
              value={simulationData.maxAmount ? Math.round(simulationData.maxAmount).toLocaleString('es-CO') : ''}
              readOnly
              className='w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700'
            />
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>Cuota deseada (editable)</label>
            <div className='relative'>
              <span className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold'>$</span>
              <input
                type='text'
                value={simulationData.desiredQuota ? Math.round(simulationData.desiredQuota).toLocaleString('es-CO') : ''}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^\d]/g, '')
                  setSimulationData({ ...simulationData, desiredQuota: parseInt(value) || 0 })
                  setLastEdit('quota')
                }}
                className='w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
              />
            </div>
          </div>
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>Monto deseado (editable)</label>
            <div className='relative'>
              <span className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold'>$</span>
              <input
                type='text'
                value={simulationData.desiredAmount ? Math.round(simulationData.desiredAmount).toLocaleString('es-CO') : ''}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^\d]/g, '')
                  setSimulationData({ ...simulationData, desiredAmount: parseInt(value) || 0 })
                  setLastEdit('amount')
                }}
                className='w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
              />
            </div>
          </div>
        </div>

        <div className='flex items-center justify-between text-sm text-gray-700'>
          <span>Factor por millón para {simulationData.desiredTerm} meses:</span>
          <span className='font-semibold text-gray-900'>
            {formatCurrency(factorByMonths[simulationData.desiredTerm] || factorByMonths[144])}
          </span>
        </div>
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
