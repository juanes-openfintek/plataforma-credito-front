'use client'
import { useEffect, useState, useMemo } from 'react'
import SquareButton from '../../atoms/SquareButton/SquareButton'
import ChartView from '../../molecules/ChartView/ChartView'
import getAmountCirculation from '../../../services/getAmountCirculation'
import { convertNumberToCurrency } from '../../../helpers/calculationsHelpers'
import getAmountCollectedTickets from '../../../services/getAmountCollectedTickets'

const AdminStatisticsOverview = () => {
  /**
   * Initialization of the states used to store the data
   */
  const [totalCirculation, setTotalCirculation] = useState(0)
  const [totalCollected, setTotalCollected] = useState(0)
  const [collectedStatistics, setCollectedStatistics] = useState([])
  const [selectedFilter, setSelectedFilter] = useState(() => {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    return date
  })

  /**
   * Initialization of the dates used to filter the statistics
   */
  const today = useMemo(() => {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    return date
  }, [])

  const weekAgo = useMemo(() => {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    date.setDate(date.getDate() - 7)
    return date
  }, [])

  const monthAgo = useMemo(() => {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    date.setMonth(date.getMonth() - 1)
    return date
  }, [])

  /**
   * useEffect to fetch the amounts of money collected
   */
  useEffect(() => {
    const fetchAmounts = async () => {
      try {
        const response = await getAmountCollectedTickets(
          selectedFilter.toISOString().split('T')[0]
        )
        setCollectedStatistics(response?.values || [])
        if (response?.total?.[0]?.total) {
          setTotalCollected(response.total[0].total)
        } else {
          setTotalCollected(0)
        }
      } catch (error) {
        console.error('Error fetching collected tickets:', error)
        setCollectedStatistics([])
        setTotalCollected(0)
      }
    }
    const fetchAmountsCirculation = async () => {
      try {
        const response = await getAmountCirculation(selectedFilter.toISOString().split('T')[0])
        if (response?.total?.[0]?.total) {
          setTotalCirculation(response.total[0].total)
        } else {
          setTotalCirculation(0)
        }
      } catch (error) {
        console.error('Error fetching circulation:', error)
        setTotalCirculation(0)
      }
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
      {collectedStatistics && collectedStatistics.length > 0 && (
        <ChartView collectedData={collectedStatistics} />
      )}
    </div>
  )
}

export default AdminStatisticsOverview
