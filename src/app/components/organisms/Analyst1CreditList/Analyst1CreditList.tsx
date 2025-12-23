'use client'
import { CreditData } from '../../../interfaces/creditData.interface'
import TagStatus from '../../atoms/TagStatus/TagStatus'
import { CreditStatusesProperties } from '../../../constants/CreditStatusesProperties'

interface Props {
  creditsList: CreditData[]
  page: number
  perPage: number
  onSelectCredit: (credit: CreditData) => void
}

const Analyst1CreditList = ({
  creditsList,
  page,
  perPage,
  onSelectCredit,
}: Props) => {
  const startIndex = (page - 1) * perPage
  const endIndex = startIndex + perPage
  const paginatedCredits = creditsList.slice(startIndex, endIndex)

  if (creditsList.length === 0) {
    return (
      <div className='flex justify-center items-center h-64'>
        <p className='text-xl text-gray-500'>No hay créditos pendientes</p>
      </div>
    )
  }

  return (
    <div className='mt-8'>
      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead className='bg-primary-color text-white'>
            <tr>
              <th className='p-3 text-left'>Radicado</th>
              <th className='p-3 text-left'>Cliente</th>
              <th className='p-3 text-left'>Documento</th>
              <th className='p-3 text-left'>Monto</th>
              <th className='p-3 text-left'>Estado</th>
              <th className='p-3 text-left'>Fecha</th>
              <th className='p-3 text-center'>Acción</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCredits.map((credit, index) => {
              const statusProp = CreditStatusesProperties.find(
                (s) => s.status === credit.status
              )
              return (
                <tr
                  key={credit._id || index}
                  className='border-b hover:bg-gray-50 transition-colors'
                >
                  <td className='p-3'>{credit.radicationNumber || credit.code}</td>
                  <td className='p-3'>
                    {credit.name} {credit.lastname}
                  </td>
                  <td className='p-3'>{credit.documentNumber}</td>
                  <td className='p-3'>
                    ${Number(credit.amount || 0).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </td>
                  <td className='p-3'>
                    <TagStatus
                      text={statusProp?.text || credit.status}
                      background={statusProp?.background}
                    />
                  </td>
                  <td className='p-3'>
                    {credit.radicationDate
                      ? new Date(credit.radicationDate).toLocaleDateString()
                      : new Date(credit.created).toLocaleDateString()}
                  </td>
                  <td className='p-3 text-center'>
                    <button
                      onClick={() => onSelectCredit(credit)}
                      className='bg-primary-color text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors'
                    >
                      Revisar
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Analyst1CreditList

