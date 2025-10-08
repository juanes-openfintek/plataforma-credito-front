'use client'
import { useEffect, useState } from 'react'
import SquareButton from '../../atoms/SquareButton/SquareButton'
import ChartView from '../../molecules/ChartView/ChartView'
import getAmountCirculation from '../../../services/getAmountCirculation'
import { convertNumberToCurrency } from '../../../helpers/calculationsHelpers'
import getAmountCollectedTickets from '../../../services/getAmountCollectedTickets'

const AdminStatisticsOverview = () => {
  /**
   * Initialization of the dates used to filter the statistics
   */
  const today = new Date()
  const weekAgo = new Date(today)
  const monthAgo = new Date(today)
  today.setHours(0, 0, 0, 0)
  weekAgo.setHours(0, 0, 0, 0)
  monthAgo.setHours(0, 0, 0, 0)
  weekAgo.setDate(today.getDate() - 7)
  monthAgo.setMonth(today.getMonth() - 1)

  /**
   * Initialization of the states used to store the data
   */
  const [totalCirculation, setTotalCirculation] = useState<number>(0)
  const [totalCollected, setTotalCollected] = useState<number>(0)
  const [collectedStatistics, setCollectedStatistics] = useState<any>(0)
  const [selectedFilter, setSelectedFilter] = useState<Date>(today)

  /**
   * useEffect to fetch the amounts of money collected
   */
  useEffect(() => {
    const fetchAmounts = async () => {
      const response = await getAmountCollectedTickets(
        selectedFilter.toISOString().split('T')[0]
      )
      setCollectedStatistics(response?.values)
      if (response?.total[0]?.total) {
        setTotalCollected(response?.total[0].total)
        return
      }
      setTotalCollected(0)
    }
    const fetchAmountsCirculation = async () => {
      const response = await getAmountCirculation(selectedFilter.toISOString().split('T')[0])

      if (response?.total[0]?.total) {
        setTotalCirculation(response?.total[0]?.total)
        return
      }
      setTotalCirculation(0)
    }
    fetchAmounts()
    fetchAmountsCirculation()
  }, [selectedFilter])

  return (
    <div className='flex flex-row gap-6 w-full justify-between h-[50vh] items-center'>
      <div className='flex flex-col gap-4 w-[30%] text-black text-center'>
        <div className='bg-light-color-one p-8 rounded-xl'>
          <h3>Dinero en circulación</h3>
          <p className='font-bold text-[1.875rem]'>
            {convertNumberToCurrency(totalCirculation)}
          </p>
        </div>
        <div className='bg-light-color-one p-8 rounded-xl'>
          <h3>Recaudado</h3>
          <p className='font-bold text-[1.875rem]'>
            {convertNumberToCurrency(totalCollected)}
          </p>
          <div className='flex flex-row gap-4 mt-4'>
            <SquareButton
              text='Hoy'
              gray={
                selectedFilter.toISOString().split('T')[0] !==
                today.toISOString().split('T')[0]
              }
              onClickHandler={() => {
                setSelectedFilter(today)
              }}
            />
            <SquareButton
              text='Semana'
              gray={
                selectedFilter.toISOString().split('T')[0] !==
                weekAgo.toISOString().split('T')[0]
              }
              onClickHandler={() => {
                setSelectedFilter(weekAgo)
              }}
            />
            <SquareButton
              text='Mes'
              gray={
                selectedFilter.toISOString().split('T')[0] !==
                monthAgo.toISOString().split('T')[0]
              }
              onClickHandler={() => setSelectedFilter(monthAgo)}
            />
          </div>
        </div>
      </div>
      {collectedStatistics && <ChartView collectedData={collectedStatistics} />}
    </div>
  )
}

export default AdminStatisticsOverview
