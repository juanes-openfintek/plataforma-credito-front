import { useEffect, useState } from 'react'
import { CreditData } from '../../../interfaces/creditData.interface'
import putUpdateCredit from '../../../services/putUpdateCredit'
import SquareButton from '../../atoms/SquareButton/SquareButton'
import AdminDataExpandedCreditBlock from '../../molecules/AdminDataExpandedCreditBlock/AdminDataExpandedCreditBlock'
import AdminDetailCreditUserBlock from '../../molecules/AdminDetailCreditUserBlock/AdminDetailCreditUserBlock'
import { CreditStatusesProperties } from '../../../constants/CreditStatusesProperties'
import getPromissoryVersion from '../../../services/getPromissoryVersion'
import getPromissoryDocument from '../../../services/getPromissoryDocument'
import postMonoTransaction from '../../../services/postMonoTransaction'

interface DisburseDetailPromissorySignedProps {
  creditData: CreditData
  setShowForm: (position: boolean) => void
}

const DisburseDetailPromissorySigned = ({
  creditData,
  setShowForm,
}: DisburseDetailPromissorySignedProps) => {
  /**
   * @description State to disable button
   */
  const [disable, setDisable] = useState(false)
  /**
   * State to show the iframe
   */
  const [iframe, setIframe] = useState<HTMLIFrameElement>()
  /**
   * State to show the anchor
   */
  const [anchor, setAnchor] = useState<HTMLAnchorElement>()
  /**
   * State to show the error
   */
  const [errorLoadDocument, setErrorLoadDocument] = useState('')
  /**
   * A string that contains the error message.
   */
  const [errorMessage, setErrorMessage] = useState<string>('')
  /**
   * @description Change status credit
   * @param status - Status to change
   */
  const changeStatusCredit = async (status: string) => {
    setDisable(true)
    postMonoTransaction(creditData._id)
      .then(async (res) => {
        if (res.errors) {
          setErrorMessage('No se pudo realizar el desembolso, intentelo nuevamente')
          setDisable(false)
          return
        }
        putUpdateCredit(creditData._id, status)
          .then((response: any) => {
            setDisable(false)
            if (response.status === 200) {
              iframe?.remove()
              setShowForm(false)
            }
          })
          .catch(() => {
            setDisable(false)
          })
      })
      .catch(() => {
        setDisable(false)
      })
  }
  /**
   * useEffect to get promissory document
   */
  useEffect(() => {
    getPromissoryVersion(creditData?.arkdia?._id)
      .then((response) => {
        if (response.data[0].assetStatus === 1) {
          setErrorLoadDocument('No se ha firmado el pagaré')
        }
        if (response.data[0].assetStatus === 2) {
          setErrorLoadDocument(
            'No se ha validado el pagaré por el servicio de firmas'
          )
        }
        getPromissoryDocument(response.data[0]._id).then((response) => {
          const downloadUrl = window.URL.createObjectURL(response)
          const iframeLocal = document.createElement('iframe')
          iframeLocal.className =
            'max-xl:hidden w-[1500px] h-[1500px] 2xl:w-[50%]'
          iframeLocal.src = downloadUrl
          iframeLocal.style.margin = 'auto'
          setIframe(iframeLocal)
          const anchorLocal = document.createElement('a')
          anchorLocal.className = 'xl:hidden text-center block w-full'
          anchorLocal.href = downloadUrl
          anchorLocal.download = `${creditData?.arkdia?.documentId} - Pagaré.pdf`
          anchorLocal.textContent = 'Descargar pagaré'
          setAnchor(anchorLocal)
          document.getElementById('iframe-position')?.appendChild(iframeLocal)
          document.getElementById('iframe-position')?.appendChild(anchorLocal)
        })
      })
      .catch(() => {
        setErrorLoadDocument('No se ha encontrado el documento')
      })
  }, [])

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
      <AdminDataExpandedCreditBlock
        dataCredit={creditData}
        title='Información del crédito'
      />
      {errorLoadDocument !== '' && (
        <h3 className='text-[2rem] text-primary-color font-bold text-center my-10'>
          {errorLoadDocument}
        </h3>
      )}
      {anchor && (
        <p className='xl:hidden text-center text-light-color-two'>
          No disponible la vista previa en dispositivos móviles
        </p>
      )}
      <div id='iframe-position' className='my-8' />
      <div className='mx-auto my-12 font-bold w-[235px] h-[70px]'>
        <SquareButton
          text='Confirmar'
          disable={disable || errorLoadDocument !== ''}
          onClickHandler={() =>
            changeStatusCredit(CreditStatusesProperties[7].status)}
        />
      </div>
      {errorMessage && (
        <p className='text-center text-white bg-red-300 py-4 mb-6 rounded'>
          {errorMessage}
        </p>
      )}
    </section>
  )
}

export default DisburseDetailPromissorySigned
