'use client'
import React, { useState } from 'react'

interface Props {
  onContinue: () => void
}

const QuickCalculatorModule = ({ onContinue }: Props) => {
  const [amount, setAmount] = useState(8000000)
  const [term, setTerm] = useState(36)
  const monthlyRatePct = 1.5 // tasa fija nominal mensual
  const [brokeragePct, setBrokeragePct] = useState(3)
  const [convenio, setConvenio] = useState('conv-1')
  const [requiresPortfolioPurchase, setRequiresPortfolioPurchase] = useState(false)
  const [portfolioAmount, setPortfolioAmount] = useState(0)
  const [monthlyIncome, setMonthlyIncome] = useState(3500000)
  const [monthlyExpenses, setMonthlyExpenses] = useState(1200000)
  const [result, setResult] = useState<any>(null)

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value)
  const parseCurrency = (value: string) => parseInt(value.replace(/[^\d]/g, ''), 10) || 0

  const calculate = () => {
    const baseAmount = amount + (requiresPortfolioPurchase ? portfolioAmount : 0)
    const monthlyRate = monthlyRatePct / 100
    const brokerageAmount = (amount * brokeragePct) / 100
    const monthlyPaymentCore =
      baseAmount * (monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1)
    const monthlyPayment = monthlyPaymentCore
    const totalInterest = monthlyPaymentCore * term - baseAmount
    const fianza = amount * 0.03
    const totalToPay = monthlyPayment * term + fianza
    const tea = Math.pow(1 + monthlyRate, 12) - 1
    const netDisbursement = amount - brokerageAmount - fianza - (requiresPortfolioPurchase ? portfolioAmount : 0)
    const availableIncome = monthlyIncome - monthlyExpenses
    const maxQuota = Math.max(availableIncome * 0.5, 0)
    const affordability = monthlyPayment <= maxQuota

    const calcResult = {
      baseAmount,
      amount,
      term,
      monthlyRatePct,
      brokeragePct,
      monthlyPayment: Math.round(monthlyPayment),
      monthlyPaymentCore: Math.round(monthlyPaymentCore),
      totalInterest: Math.round(totalInterest),
      totalToPay: Math.round(totalToPay),
      tea: Math.round(tea * 10000) / 100, // %
      brokerageAmount: Math.round(brokerageAmount),
      fianza: Math.round(fianza),
      netDisbursement: Math.round(netDisbursement),
      requiresPortfolioPurchase,
      portfolioAmount,
      availableIncome,
      maxQuota,
      affordability,
    }
    setResult(calcResult)
  }

  const handleContinue = () => {
    if (!result) return
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(
        'calculatorDraft',
        JSON.stringify({
          creditAmount: result.amount,
          creditTerm: result.term,
          monthlyPayment: result.monthlyPayment,
          totalInterest: result.totalInterest,
          totalToPay: result.totalToPay,
          monthlyIncome,
          monthlyExpenses,
        }),
      )
    }
    onContinue()
  }

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-3xl font-bold text-gray-900 mb-2'>Calculadora avanzada de libranza</h2>
        <p className='text-gray-600'>Simula tu credito de libranza.</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div>
          <label className='block text-sm font-semibold text-gray-700 mb-2'>Monto solicitado</label>
          <input
            type='text'
            value={formatCurrency(amount)}
            onChange={(e) => setAmount(parseCurrency(e.target.value))}
            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
          />
        </div>
        <div>
          <label className='block text-sm font-semibold text-gray-700 mb-2'>Plazo (meses)</label>
          <input
            type='number'
            value={term}
            min={6}
            max={84}
            onChange={(e) => setTerm(parseInt(e.target.value || '0', 10))}
            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
          />
        </div>
        <div>
          <label className='block text-sm font-semibold text-gray-700 mb-2'>Tasa nominal mensual (fija)</label>
          <input
            type='text'
            value={`${monthlyRatePct}%`}
            disabled
            className='w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700'
          />
        </div>
        <div>
          <label className='block text-sm font-semibold text-gray-700 mb-2'>Corretaje (%)</label>
          <select
            value={brokeragePct}
            onChange={(e) => setBrokeragePct(parseInt(e.target.value, 10))}
            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
          >
            {[1, 2, 3, 4, 5, 6, 7].map((value) => (
              <option key={value} value={value}>
                {value}%
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className='block text-sm font-semibold text-gray-700 mb-2'>Convenio</label>
          <select
            value={convenio}
            onChange={(e) => setConvenio(e.target.value)}
            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
          >
            <option value='conv-1'>Convenio general</option>
            <option value='conv-2'>Empleados sector público</option>
            <option value='conv-3'>Pensionados</option>
            <option value='conv-4'>Independientes con retención</option>
          </select>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200'>
        <div className='flex items-center gap-3'>
          <input
            type='checkbox'
            checked={requiresPortfolioPurchase}
            onChange={(e) => setRequiresPortfolioPurchase(e.target.checked)}
            className='h-5 w-5'
          />
          <div>
            <p className='text-sm font-semibold text-gray-700'>Compra de cartera</p>
            <p className='text-xs text-gray-500'>Agregar saldo a cubrir en el monto</p>
          </div>
        </div>
        <div>
          <label className='block text-sm font-semibold text-gray-700 mb-2'>Saldo a comprar</label>
          <input
            type='text'
            value={formatCurrency(portfolioAmount)}
            disabled={!requiresPortfolioPurchase}
            onChange={(e) => setPortfolioAmount(parseCurrency(e.target.value))}
            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color disabled:bg-gray-100'
          />
        </div>
        <div>
          <label className='block text-sm font-semibold text-gray-700 mb-2'>Ingreso y gastos del cliente</label>
          <div className='grid grid-cols-2 gap-2'>
            <input
              type='text'
              value={formatCurrency(monthlyIncome)}
              onChange={(e) => setMonthlyIncome(parseCurrency(e.target.value))}
              placeholder='Ingreso'
              className='px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
            />
            <input
              type='text'
              value={formatCurrency(monthlyExpenses)}
              onChange={(e) => setMonthlyExpenses(parseCurrency(e.target.value))}
              placeholder='Gastos'
              className='px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color'
            />
          </div>
        </div>
      </div>

      <div className='flex gap-3'>
        <button
          onClick={calculate}
          className='px-6 py-3 bg-gradient-to-r from-primary-color to-accent-color text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300'
        >
          Calcular
        </button>
        {result && (
          <button
            onClick={handleContinue}
            className='px-6 py-3 border-2 border-primary-color text-primary-color font-semibold rounded-lg hover:bg-primary-color hover:text-white transition-all duration-300'
          >
            Continuar con este credito
          </button>
        )}
      </div>

      {result && (
        <div className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4 bg-white border border-gray-200 rounded-xl p-4'>
            <div>
              <p className='text-sm text-gray-600'>Cuota estimada</p>
              <p className='text-2xl font-bold text-gray-900'>{formatCurrency(result.monthlyPayment)}</p>
              <p className='text-xs text-gray-500'>Tasa fija: {monthlyRatePct}% mes (TEA {result.tea}%)</p>
            </div>
            <div>
              <p className='text-sm text-gray-600'>Total a pagar</p>
              <p className='text-2xl font-bold text-gray-900'>{formatCurrency(result.totalToPay)}</p>
              <p className='text-xs text-gray-500'>Interes: {formatCurrency(result.totalInterest)}</p>
              <p className='text-xs text-gray-500'>Incluye fianza: {formatCurrency(result.fianza)}</p>
            </div>
            <div>
              <p className='text-sm text-gray-600'>Entrega neta</p>
              <p className='text-2xl font-bold text-gray-900'>{formatCurrency(result.netDisbursement)}</p>
              <p className='text-xs text-gray-500'>Corretaje: {formatCurrency(result.brokerageAmount)}</p>
            </div>
            <div>
              <p className='text-sm text-gray-600'>TEA estimada</p>
              <p className='text-2xl font-bold text-gray-900'>{result.tea}%</p>
              <p className={`text-xs font-semibold ${result.affordability ? 'text-green-600' : 'text-red-600'}`}>
                Capacidad: {formatCurrency(result.maxQuota)} ({result.affordability ? 'viable' : 'excede'})
              </p>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='bg-white border border-gray-200 rounded-xl p-4'>
              <h4 className='text-lg font-semibold text-gray-800 mb-2'>Detalle del costo</h4>
              <ul className='text-sm text-gray-700 space-y-1'>
                <li>Capital: {formatCurrency(result.baseAmount)}</li>
                <li>Intereses: {formatCurrency(result.totalInterest)}</li>
                <li>Fianza: {formatCurrency(result.fianza)}</li>
                <li>Corretaje: {formatCurrency(result.brokerageAmount)}</li>
              </ul>
            </div>
            <div className='bg-white border border-gray-200 rounded-xl p-4'>
              <h4 className='text-lg font-semibold text-gray-800 mb-2'>Capacidad de pago</h4>
              <ul className='text-sm text-gray-700 space-y-1'>
                <li>Ingreso mensual: {formatCurrency(monthlyIncome)}</li>
                <li>Gastos y descuentos: {formatCurrency(monthlyExpenses)}</li>
                <li>Ingreso disponible: {formatCurrency(result.availableIncome)}</li>
                <li>Cuota maxima (50% disp.): {formatCurrency(result.maxQuota)}</li>
                <li>Cuota propuesta: {formatCurrency(result.monthlyPayment)}</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default QuickCalculatorModule
