/* eslint-disable new-cap */
import { useState } from 'react'
import { CreditData } from '../../../interfaces/creditData.interface'
import SquareButton from '../../atoms/SquareButton/SquareButton'
import AdminDataCreditBlock from '../../molecules/AdminDataCreditBlock/AdminDataCreditBlock'
import AdminDetailCreditUserBlock from '../../molecules/AdminDetailCreditUserBlock/AdminDetailCreditUserBlock'
import AdminUserMinimalCreditBlock from '../../molecules/AdminUserMinimalCreditBlock/AdminUserMinimalCreditBlock'
import TaxInfoBlock from '../../molecules/TaxInfoBlock/TaxInfoBlock'
import postGeneratePromissory from '../../../services/postGeneratePromissory'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import getUserToken from '../../../helpers/getUserToken'
import putUpdateCredit from '../../../services/putUpdateCredit'
import { CreditStatusesProperties } from '../../../constants/CreditStatusesProperties'

interface DisburseDetailPromissoryPendientProps {
  creditData: CreditData
  setShowForm: (position: boolean) => void
}

const DisburseDetailPromissoryPendient = ({
  creditData,
  setShowForm,
}: DisburseDetailPromissoryPendientProps) => {
  /**
   * State to show the promissory
   */
  const [promissory, setPromissory] = useState(false)
  /**
   * State to show the loading promissory
   */
  const [loading, setLoading] = useState(false)
  /**
   * State to show the loading send promissory
   */
  const [loadingSending, setLoadingSending] = useState(false)
  /**
   * A string that contains the error message.
   */
  const [errorMessage, setErrorMessage] = useState<string>('')
  /**
   * State to save the pdf
   */
  const [pdf, setPdf] = useState<jsPDF>()
  /**
   * State to show the iframe
   */
  const [iframe, setIframe] = useState<HTMLIFrameElement>()
  /**
   * Function to load the promissory
   */
  const loadPromissory = async () => {
    setLoading(true)
    const iframeLocal = document.createElement('iframe')
    iframeLocal.className = 'w-[1500px] h-[1000px] xl:w-[80%] 2xl:w-[50%]'
    iframeLocal.style.border = 'black'
    iframeLocal.style.borderStyle = 'double'
    iframeLocal.style.margin = 'auto'
    iframeLocal.src = `${
      process.env.NEXT_PUBLIC_FRONTEND_URL
    }/creditToPay/${creditData.code.toString()}?token=${await getUserToken()}`
    iframeLocal.onload = () => {
      setTimeout(() => {
        const input: HTMLElement =
          iframeLocal.contentWindow?.document?.getElementById(
            'iframePromissory'
          )!!
        if (input) {
          html2canvas(input, {
            scale: 3,
          }).then((canvas) => {
            const imgWidth = 208
            const imgHeight = (canvas.height * imgWidth) / canvas.width
            const imgData = canvas.toDataURL('image/png')
            const pdf = new jsPDF('p', 'mm', 'a4')
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
            setPdf(pdf)
          })
        }
      }, 1500)
    }
    setPromissory(true)
    setIframe(iframeLocal)
    document.getElementById('iframe-position')?.appendChild(iframeLocal)
    iframeLocal.scrollIntoView({ behavior: 'smooth' })
  }
  /**
   * Function to send the promissory
   */
  const sendPromissory = async () => {
    setLoadingSending(true)
    const blob = pdf?.output('blob')
    const bodyFormData = new FormData()
    const userToSign = [
      {
        firstName: creditData?.name,
        lastName: creditData?.lastname,
        identification: creditData?.documentNumber,
        identificationKind: creditData?.documentType,
        email: creditData?.user?.email,
        city: '',
        country: 'CO',
        cellphone: creditData?.phoneNumber,
        principalSigner: true,
        typeSign: 'Solicitante',
        iteration: 1,
      },
    ]
    bodyFormData.append('file', blob!, `pagaré_crédito_#${creditData.code}.pdf`)
    bodyFormData.append('name', `pagaré_crédito_#${creditData.code}`)
    bodyFormData.append('kind', 'API')
    bodyFormData.append('pattern', process.env.NEXT_PUBLIC_PATTERN_ARKDIA ?? '')
    bodyFormData.append(
      'directory',
      process.env.NEXT_PUBLIC_DIRECTORY_ARKDIA ?? ''
    )
    bodyFormData.append('signersList', JSON.stringify(userToSign))
    postGeneratePromissory(bodyFormData)
      .then((res) => {
        if (res.status === 200) {
          putUpdateCredit(
            creditData?._id,
            CreditStatusesProperties[6].status,
            res.data?.data?._id,
            res.data?.data?.code
          ).then((res) => {
            setShowForm(false)
            iframe?.remove()
          })
          return
        }
        setErrorMessage('Error al enviar el pagaré, inténtelo nuevamente')
        setLoadingSending(false)
      })
      .catch(() => {
        setErrorMessage('Error al generar el pagaré, inténtelo nuevamente')
        setLoadingSending(false)
      })
  }

  return (
    <section className='py-[1rem] xl:ml-[300px] xl:mr-[50px] max-lg:px-4 text-primary-color'>
      <p
        className='text-[1.25rem] font-bold my-8 cursor-pointer'
        onClick={() => {
          iframe?.remove()
          setShowForm(false)
        }}
      >
        {'< Volver'}
      </p>
      <p className='text-[1.25rem] font-semibold mb-4'>{`Crédito #${creditData.code}`}</p>
      <AdminDetailCreditUserBlock creditUserData={creditData} withReference />
      <AdminDataCreditBlock creditUserData={creditData} />
      <TaxInfoBlock creditUserData={creditData} />
      <AdminUserMinimalCreditBlock creditUserData={creditData} />
      <div className='mx-auto my-12 font-bold w-[235px] h-[70px]'>
        <SquareButton
          text='Generar pagaré'
          disable={loading}
          onClickHandler={() => loadPromissory()}
        />
      </div>
      {promissory && (
        <p className='text-[1.375rem] font-semibold text-black w-full my-2 py-4 border-t-2 border-black'>
          Se há generado el pagaré #{creditData.code}
        </p>
      )}
      <div id='iframe-position' className='max-xl:overflow-scroll' />
      {promissory && (
        <div className='mx-auto my-12 font-bold w-[235px] h-[70px]'>
          <SquareButton
            text='Enviar pagaré'
            disable={loadingSending}
            onClickHandler={() => {
              sendPromissory()
            }}
          />
        </div>
      )}
      {errorMessage && (
        <p className='text-center text-white bg-red-300 py-4 mb-6 rounded'>
          {errorMessage}
        </p>
      )}
    </section>
  )
}

export default DisburseDetailPromissoryPendient
