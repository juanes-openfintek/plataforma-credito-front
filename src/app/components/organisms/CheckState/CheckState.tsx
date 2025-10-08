import { useEffect, useState } from 'react'
import NextImage from '../../atoms/NextImage/NextImage'
import RoundButton from '../../atoms/RoundButton/RoundButton'
import getAllCreditsByDocument from '../../../services/getAllCreditsByDocument'
import { useFormik } from 'formik'
import { CreditData } from '../../../interfaces/creditData.interface'
import { CreditStatusesProperties } from '../../../constants/CreditStatusesProperties'
import { validateCheckCredit } from '../../../helpers/validationsForms'

/**
 * CheckState is a component that renders the check state
 * @example <CheckState />
 * @returns The CheckState component
 */
const CheckState = () => {
  /**
   * State to save the data of the credit
   */
  const [state, setState] = useState<CreditData>()

  /**
   * Formik instance to manage the forms
   */
  const formik = useFormik({
    initialValues: {
      documentType: 'CC',
      documentNumber: '',
    },
    validate: validateCheckCredit,
    onSubmit: async (values: {
      documentNumber: string
      documentType: string
    }) => {
      if (values.documentNumber !== '') {
        setState(
          await getAllCreditsByDocument(
            values.documentType,
            values.documentNumber
          )
        )
      }
    },
  })

  useEffect(() => {
    setState(undefined)
  }, [formik.values.documentType, formik.values.documentNumber])

  return (
    <section className='flex flex-col h-[32rem] max-lg:h-[50rem] bg-cover justify-center bg-white bg-wave-pattern w-full lg:items-center'>
      <div
        className={`flex flex-col lg:flex-row ${
          state || formik.errors.documentNumber ? 'h-[10rem] max-lg:h-[30rem]' : 'h-[32rem]'
        } justify-center lg:justify-start w-full lg:items-center`}
      >
        <div className='w-1/2 flex max-lg:w-full'>
          <NextImage
            className='absolute lg:relative w-[250px] 2xl:full'
            src='/images/dots-left.png'
            alt='Check State'
            width={450}
            height={450}
          />
          <h2 className='font-sans text-4xl 2xl:text-[3.125rem] leading-[3rem] text-white z-10 2xl:px-10 2xl:mr-10 max-lg:text-center self-center max-lg:mt-16'>
            <span className='font-bold'>Consulta el estado</span> de tu crédito
            aquí
          </h2>
        </div>
        <form className='flex max-lg:flex-col max-lg:items-center w-1/2 max-2xl:text-center z-10 max-lg:w-2/3 max-lg:self-center max-lg:mt-6'>
          <select
            className='bg-white rounded-3xl text-black w-20 py-2 px-2 mx-2 max-lg:w-full max-lg:my-3'
            id='type-document'
            name='documentType'
            onChange={formik.handleChange}
          >
            <option value='CC'>CC</option>
            <option value='CE'>CE</option>
          </select>
          <input
            type='text'
            name='documentNumber'
            onChange={formik.handleChange}
            className='bg-white rounded-3xl text-black py-2 px-4 mx-4 max-lg:w-full 2xl:w-1/2 max-lg:my-3 max-lg:mx-2'
            placeholder='Número'
          />
          <div className='w-[130px]'>
            <RoundButton
              text='Consultar'
              onClickHandler={formik.handleSubmit}
            />
          </div>
        </form>
      </div>
      {formik.errors.documentNumber ? <div className='text-white font-bold z-10 mx-10'>{formik.errors.documentNumber}</div> : null}
      {state && (
        <>
          {state.status && (
            <div className='z-10 mx-10'>
              <p className='text-white text-2xl mb-4 text-center'>
                El estado de tu credito es{' '}
                <span className='font-bold lowercase'>
                  {
                    CreditStatusesProperties.find(
                      (property: { status: string }) =>
                        property.status === state.status
                    )?.text
                  }
                </span>
                , para mas información inicia sesión en{' '}
              </p>
              <a href='/login'>
                <RoundButton text='Iniciar sesión' />
              </a>
            </div>
          )}
          {!state.status && (
            <div className='z-10 mx-10'>
              <p className='text-white text-2xl mb-4 text-center'>
                No se ha encontrado un crédito asociado a este documento, puedes
                solicitar uno ingresando a
              </p>
              <a href='/login'>
                <RoundButton text='Iniciar sesión' />
              </a>
            </div>
          )}
        </>
      )}
    </section>
  )
}

export default CheckState
