'use client'
import { BarChart } from 'chartist'
import { useEffect, useRef } from 'react'
import { convertNumberToCurrency } from '../../../helpers/calculationsHelpers'
import 'chartist/dist/index.css'

interface ChartViewProps {
  collectedData: {
    _id: string
    total: number
  }[]
}

const ChartView = ({ collectedData }: ChartViewProps) => {
  const chart = useRef(null)
  
  // Validar que collectedData sea un array
  const safeCollectedData = Array.isArray(collectedData) ? collectedData : []
  
  /**
   * labelsParsed is used to get the labels for the chart
   */
  const labelsParsed = safeCollectedData.map((element) => element._id)
  /**
   * seriesParsed is used to get the series for the chart
   */
  const seriesParsed = safeCollectedData.map((element) => element.total)

  useEffect(() => {
    const chartInstance = new BarChart(
      chart.current,
      {
        labels: labelsParsed,
        series: [seriesParsed],
      },
      {
        axisY: {
          labelInterpolationFnc: (value) =>
            convertNumberToCurrency(Number(value)),
          offset: 100,
        },
        axisX: {
          showGrid: false,
        },
      }
    )

    return () => {
      chartInstance.detach()
    }
  }, [seriesParsed])

  return <div ref={chart} className='h-[50vh] w-full' />
}

export default ChartView
