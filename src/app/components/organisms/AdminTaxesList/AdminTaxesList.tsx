import { Taxes } from '../../../interfaces/taxes.interface'
import SquareButton from '../../atoms/SquareButton/SquareButton'
import AdminTaxesBlock from '../../molecules/AdminTaxesBlock/AdminTaxesBlock'
import Paginator from '../../molecules/Paginator/Paginator'

interface AdminTaxesListProps {
  taxes: Taxes[]
  page: number
  perPage: number
  setPage: (page: number) => void
  handleShowForm: (id?: number) => void
}

const AdminTaxesList = ({
  taxes,
  page,
  perPage,
  setPage,
  handleShowForm,
}: AdminTaxesListProps) => {
  return (
    <>
      <div className='flex flex-row justify-between items-center my-12'>
        <h2 className='text-[1.5625rem] font-semibold'>Tasas</h2>
        <div className='w-[200px]'>
          <SquareButton
            text='Crear tasa'
            onClickHandler={() => handleShowForm()}
          />
        </div>
      </div>
      <div className='bg-light-color-one rounded-2xl px-6 py-6 '>
        <div className='grid grid-cols-8 max-lg:grid-cols-3 text-center text-accent-color font-bold text-[1.125rem]'>
          <h3>Rangos</h3>
          <h3>Tasa E.M</h3>
          <h3 className='max-lg:hidden'>Tasa E.A</h3>
          <h3 className='max-lg:hidden'>Tasa de mora</h3>
          <h3 className='max-lg:hidden'>IVA</h3>
          <h3 className='max-lg:hidden'>Seguro</h3>
          <h3 className='max-lg:hidden'>Administración</h3>
          <h3>Editar</h3>
        </div>
        {taxes.slice((page - 1) * perPage, page * perPage).map((tax, index) => (
          <AdminTaxesBlock
            key={`${tax.id}-${index}`}
            tax={tax}
            position={index}
            setSelectedTax={handleShowForm}
          />
        ))}
        {taxes.length === 0 && (
          <div className='text-center text-accent-color mt-8 font-bold text-[1.5rem]'>
            No hay tasas registradas
          </div>
        )}
      </div>
      <Paginator
        total={taxes.length}
        perPage={perPage}
        page={page}
        onChange={(page) => setPage(page)}
      />
    </>
  )
}

export default AdminTaxesList
