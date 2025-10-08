'use client'
import { useParams, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CreditData } from '../../interfaces/creditData.interface'
import getCreditByID from '../../services/getCreditByID'
import {
  calculateAllInterest,
  calculateInterest,
  convertNumberToCurrency,
} from '../../helpers/calculationsHelpers'
import NextImage from '../../components/atoms/NextImage/NextImage'
import formatDateAdmin from '../../helpers/formatDateAdmin'

export default function Page() {
  const params = useParams()
  const query = useSearchParams()

  const [creditData, setCreditData] = useState<CreditData>()

  useEffect(() => {
    const getCreditData = async () => {
      const credit = await getCreditByID(
        params.id.toString(),
        query.get('token') ?? ''
      )
      if (credit.length > 0) {
        setCreditData(credit[0])
      }
    }
    getCreditData()
  }, [])

  return (
    <div id='iframePromissory'>
      <div className='text-center m-8'>
        <div className='flex flex-row justify-between items-center my-8'>
          <h1 id='code-credit' className='text-[3rem] font-bold'>
            Crédito #{creditData?.code}
          </h1>
          <NextImage
            src='/images/feelpay-logo.png'
            alt='logo'
            width={150}
            height={30}
            className='w-[150px] h-[30px]'
          />
        </div>
        <p>
          Yo{' '}
          <span className='font-semibold uppercase'>
            {creditData?.name} {creditData?.lastname}
          </span>{' '}
          debo a <span className='font-semibold uppercase'>Marca Blanca Creditos</span>{' '}
          este pagaré generado el dia{' '}
          <span className='font-semibold uppercase'>
            {formatDateAdmin(new Date().toISOString(), 'onlyDate')}
          </span>{' '}
          por la cantidad de{' '}
          <span className='font-semibold uppercase'>
            {convertNumberToCurrency(calculateAllInterest(creditData!!))}{' '}
          </span>
          en <span className='font-semibold uppercase'>Pesos colombianos</span>
        </p>
        <h2 className='font-semibold text-[1.5rem] text-white bg-primary-color mt-8'>
          Datos del pagaré:
        </h2>
        <div className='grid grid-cols-3 gap-4 p-4 bg-light-color-one justify-center'>
          <h2 className='font-semibold text-[1.5rem]'>Solicitante:</h2>
          <h2 className='font-semibold text-[1.5rem]'>Cuotas:</h2>
          <h2 className='font-semibold text-[1.5rem]'>Monto final:</h2>
          <p>
            {creditData?.name} {creditData?.lastname}
          </p>
          <p>{creditData?.quotasNumber}</p>
          <p>{convertNumberToCurrency(calculateAllInterest(creditData!!))}</p>
        </div>
        <div className='grid grid-cols-5 gap-4 p-4 bg-light-color-one justify-center'>
          <h2 className='font-semibold text-[1rem]'>Capital:</h2>
          <h2 className='font-semibold text-[1rem]'>Intereses:</h2>
          <h2 className='font-semibold text-[1rem]'>Seguro:</h2>
          <h2 className='font-semibold text-[1rem]'>Administración:</h2>
          <h2 className='font-semibold text-[1rem]'>Iva:</h2>
          <p>{convertNumberToCurrency(creditData?.amount ?? 0)}</p>
          <p>
            {`${calculateInterest(
              creditData?.quotasNumber ?? 0,
              creditData?.taxes!!
            )}%`}
          </p>
          <p>{`${creditData?.taxes?.rateInsurance}%`}</p>
          <p>{`${creditData?.taxes?.rateAdministration}%`}</p>
          <p>{`${creditData?.taxes?.iva}%`}</p>
        </div>
        <p className='my-8'>
          En caso de no cumplir con el pago en la fecha acordada, se generará un
          interés de mora por:{' '}
          <span className='font-semibold uppercase'>
            {creditData?.taxes?.rateDefault}%
          </span>{' '}
          mensual
        </p>
        <div className='flex flex-row justify-between gap-8'>
          <div className='flex flex-col w-[50%]'>
            <h2 className='font-semibold text-[1.125rem] text-white bg-primary-color'>
              Datos del deudor
            </h2>
            <div className='grid grid-cols-3 pl-2'>
              <h3 className='text-start'>Nombre</h3>
              <p className='col-span-2 border-b-2 border-black'>
                {creditData?.name} {creditData?.lastname}
              </p>
              <h3 className='text-start'>Documento</h3>
              <p className='col-span-2 border-b-2 border-black'>
                {creditData?.documentType} {creditData?.documentNumber}
              </p>
              <h3 className='text-start'>Teléfono</h3>
              <p className='col-span-2 border-b-2 border-black'>
                {creditData?.phoneNumber}
              </p>
              <h3 className='text-start'>Email</h3>
              <p className='col-span-2 border-b-2 border-black'>
                {creditData?.user?.email}
              </p>
            </div>
          </div>
          <div className='flex flex-col justify-center m-auto w-[50%]'>
            <p className='font-bold'>Acepto y pagaré a su vencimiento</p>
            <div className='border-b-2 border-black mt-16' />
            <p>Firma</p>
          </div>
        </div>
      </div>
    </div>
  )
}
