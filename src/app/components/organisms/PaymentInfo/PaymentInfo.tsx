import { FormikProvider, useFormik } from 'formik'
import PaymentOption from '../../atoms/PaymentOption/PaymentOption'
import CreditPendingBlock from '../../molecules/CreditPendingBlock/CreditPendingBlock'
import SquareButton from '../../atoms/SquareButton/SquareButton'
import { useState } from 'react'
import LoadDocument from '../../atoms/LoadDocument/LoadDocument'
import { Ticket } from '../../../interfaces/ticket.interface'
import postMonoPSE from '../../../services/postMonoPSE'

// zulisadayb@gmail.com - admin
// angelica.approver@yopmail.com - aprobador
// angelica.disburser@yopmail.com - desembolsador
// nicolas.1657@yopmail.com - normal
// Todos con asdQWE123? de contraseña

// luz.riano@yopmail.com
// aprobador.creditos@yopmail.com
// desembolsador.creditos@yopmail.com
// rogerperlaza@gmail.com

// angelica.romero@yopmail.com - este si es admin jajaja la misma pass que las otras

interface Credit {
  ticketValue: Ticket | undefined
  creditNumber: string
  quotas: number
}
/**
 * PaymentInfo component is used to display the payment info
 * @param ticketValue - The credit value
 * @returns A PaymentInfo component
 */
const PaymentInfo = ({ ticketValue, quotas, creditNumber }: Credit) => {
  /**
   * State to manage the payment method
   */
  const [paymentMethod, setPaymentMethod] = useState<string>('')
  /**
   * State to manage the file
   */
  const [file, setFile] = useState<any>()
  /**
   * State to manage the loading state
   */
  const [loading, setLoading] = useState<boolean>(false)
  /**
   * A string that contains the error message.
   */
  const [errorMessage, setErrorMessage] = useState<string>('')
  /**
   * Formik instance to manage the forms
   */
  const formik = useFormik({
    initialValues: {
      selection: '',
    },
    onSubmit: (values) => {
      if (values.selection === 'pse') {
        setLoading(true)
        postMonoPSE(ticketValue?.amount ?? 0, ticketValue?._id ?? '')
          .then((response) => {
            setLoading(false)
            window.open(response?.link, '_self')
          })
          .catch(() => {
            setLoading(false)
            setErrorMessage(
              'Hubo un error al generar el link de pago, por favor intenta de nuevo.'
            )
          })
        return
      }
      setPaymentMethod(values.selection)
    },
  })
  return (
    <>
      {paymentMethod === '' && ticketValue !== undefined && (
        <section>
          <div className='w-full 2xl:w-1/2 m-auto'>
            <CreditPendingBlock
              title='Pagos pendientes'
              toPayData={ticketValue}
              creditNumber={creditNumber}
              quotas={quotas}
              customMargin
              onClickHandler={() => {
                return null
              }}
            />
          </div>
          <h3 className='text-[1.5625rem] font-bold'>
            Selecciona el método de pago
          </h3>
          <h4 className='text-[1.25rem] text-black font-light'>
            Recuerda que puedes ir abonando pequeños pago para tu mayor
            comodidad.
          </h4>
          <FormikProvider value={formik}>
            <div
              className='flex justify-evenly mt-20 max-lg:flex-col max-lg:items-center'
              role='group'
            >
              <PaymentOption
                name='selection'
                image='/images/pse-icon.png'
                title='pse'
              />
              <PaymentOption
                name='selection'
                image='/images/cash-icon.png'
                title='efectivo'
              />
            </div>
            <div className='w-[430px] mx-auto mt-10 max-md:w-full text-[1.125rem]'>
              <SquareButton
                text='Pagar'
                disable={loading}
                onClickHandler={() => formik.handleSubmit()}
              />
            </div>
          </FormikProvider>
          {errorMessage && (
            <p className='text-center text-white bg-red-300 py-4 mb-6 rounded'>
              {errorMessage}
            </p>
          )}
        </section>
      )}
      {paymentMethod === 'efectivo' && (
        <section>
          <h3 className='text-[1.5625rem] font-bold'>
            Paga en efectivo en cualquier punto de Baloto o Efecty
          </h3>
          <h4 className='text-[1.25rem] text-black font-light'>
            Recuerda que puedes ir abonando pequeños pago para tu mayor
            comodidad.
          </h4>
          <h4 className='text-[1.25rem] text-black font-light mb-8'>
            Sube un comprobante de pago para confimar tu pago
          </h4>
          <LoadDocument setFile={setFile} file={file} />
        </section>
      )}
    </>
  )
}

export default PaymentInfo
