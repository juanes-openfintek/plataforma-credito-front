'use client'
import axios from 'axios'
import LoadDocument from '../../atoms/LoadDocument/LoadDocument'
import SquareButton from '../../atoms/SquareButton/SquareButton'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useRegisterState } from '../../../context/registerContext'
import encryptData from '../../../helpers/encryptData'
import postNewFile from '../../../services/postNewFile'
import encryptCryptoData from '../../../helpers/encryptCryptoData'
import postVerifyCreditUser from '../../../services/postVerifyCreditUser'
import postDeleteSelfUser from '../../../services/postDeleteSelfUser'

interface DocumentDataRegisterProps {
  setPersonalVisibility: any
}
/**
 * DocumentDataRegister is a component that renders the document data register
 * @example <DocumentDataRegister setPersonalVisibility={setPersonalVisibility} />
 * @returns The DocumentDataRegister component
 */
const DocumentDataRegister = ({
  setPersonalVisibility,
}: DocumentDataRegisterProps) => {
  /**
   * RegisterContext instance to manage the register data
   */
  const { registerData, bankAllData, saveMessage, saveUserData } =
    useRegisterState()
  /**
   * Router instance to manage the routes
   */
  const router = useRouter()
  /**
   * State to manage the file
   */
  const [file, setFile] = useState<any>()
  /**
   * State to manage the loading
   */
  const [loading, setLoading] = useState(false)
  /**
   * State to manage the loading
   */
  const [submit, setSubmit] = useState(false)
  /**
   * @description This function is used to send the data to the backend
   */
  const handleSendData = async () => {
    setLoading(true)
    await axios
      .post('/api/auth/register', {
        token: encryptData({
          email: registerData?.email,
          password: registerData?.password,
        }),
      })
      .then(async (res: any) => {
        const token = res.data.token;
        const fileUploaded = postNewFile(file)
        const splitName = registerData?.name?.trim()?.split(' ')
        const nameFormatted = splitName[0]
        let middleNameFormatted
        if (splitName.length > 1) {
          middleNameFormatted = splitName[1]
        }
        const splitLastname = registerData?.lastName?.trim()?.split(' ')
        const lastnameFormatted = splitLastname[0]
        let secondLastnameFormatted
        if (splitName.length > 1) {
          secondLastnameFormatted = splitLastname[1]
        }
        const update = axios.put(
          process.env.NEXT_PUBLIC_BACKEND_URL + '/auth/update-user',
          {
            name: nameFormatted,
            lastname: lastnameFormatted,
            secondName: middleNameFormatted,
            secondLastname: secondLastnameFormatted,
            phoneNumber: registerData?.phoneNumber,
            dateOfBirth: registerData?.dateOfBirth,
            documentType: registerData?.documentType,
            documentNumber: registerData?.documentNumber,
          },
          {
            headers: {
              'x-security-token': process.env.NEXT_PUBLIC_SECURITY_TOKEN,
              Authorization: 'Bearer ' + res.data.token,
            },
          }
        )
        Promise.all([fileUploaded, update])
          .then(async (values) => {
            const bank = bankAllData.find(
              (bank: any) => bank.name === registerData?.accountEntity
            )
            await axios
              .post(
                process.env.NEXT_PUBLIC_BACKEND_URL + '/account/add-account',
                {
                  accountNumber: encryptCryptoData(registerData?.accountNumber),
                  accountType: registerData?.accountType,
                  accountEntity: registerData?.accountEntity,
                  urlCertificate: values[0],
                  detail: bank,
                  isActive: true,
                  default: true,
                },
                {
                  headers: {
                    'x-security-token': process.env.NEXT_PUBLIC_SECURITY_TOKEN,
                    Authorization: 'Bearer ' + token,
                  },
                }
              )
              .then(async (res: any) => {
                await postVerifyCreditUser(token ?? '')
                if (res.data.user) {
                  const callbackUrl = '/usuario/creditos'
                  const login = await signIn('credentials', {
                    redirect: false,
                    email: registerData?.email,
                    password: registerData?.password,
                    callbackUrl,
                  })
                  setLoading(false)
                  if (!login?.error) {
                    router.push(callbackUrl)
                  }
                } else {
                  return null
                }
              })
              .catch(() => {
                saveMessage('Ha ocurrido un problema')
                saveUserData(
                  '',
                  '',
                  registerData.name,
                  registerData.lastName,
                  registerData.phoneNumber,
                  registerData.dateOfBirth,
                  registerData.documentType,
                  registerData.documentNumber,
                  registerData.accountType,
                  registerData.accountNumber,
                  registerData.accountEntity
                )
              })
          })
          .catch(async () => {
            await postDeleteSelfUser(token)
            saveMessage('Ha ocurrido un problema')
            saveUserData(
              '',
              '',
              registerData.name,
              registerData.lastName,
              registerData.phoneNumber,
              registerData.dateOfBirth,
              registerData.documentType,
              registerData.documentNumber,
              registerData.accountType,
              registerData.accountNumber,
              registerData.accountEntity
            )
          })
      })
      .catch((err: any) => {
        saveMessage('Ha ocurrido un problema')
        if (err?.response?.status === 409) {
          saveMessage('El correo electrónico ya está registrado')
        }
        saveUserData(
          '',
          '',
          registerData.name,
          registerData.lastName,
          registerData.phoneNumber,
          registerData.dateOfBirth,
          registerData.documentType,
          registerData.documentNumber,
          registerData.accountType,
          registerData.accountNumber,
          registerData.accountEntity
        )
        setLoading(false)
      })
  }

  return (
    <section className='flex flex-col max-lg:px-10 h-screen text-primary-color p-16 justify-between'>
      <div>
        <h2 className='text-[2.1875rem] max-md:leading-[2rem] leading-[1.5625rem] font-bold mb-6'>
          Para continuar, carga el certificado del número de tu cuenta bancaria
        </h2>
        <h3 className='text-[1.875rem] max-md:leading-[2rem] leading-[1.5625rem]'>
          Debe ser una foto o pantallazo en archivo .PDF .JPG .PNG, no mayor a
          5MB
        </h3>
      </div>
      <LoadDocument setFile={setFile} file={file} />
      {!file && submit && (
        <p className='text-center text-white bg-red-300 py-4 mb-6 rounded'>
          Por favor anexe un certificado de su cuenta bancaria para continuar
        </p>
      )}
      <div className='flex self-center mt-6 mb-12 max-md:w-[90%] w-[500px] gap-8'>
        <SquareButton
          text='Guardar'
          disable={loading}
          onClickHandler={() => {
            setSubmit(true)
            if (file) {
              handleSendData()
            }
          }}
        />
        <SquareButton
          text='Volver'
          disable={loading}
          transparent
          onClickHandler={() => {
            setPersonalVisibility(true)
          }}
        />
      </div>
    </section>
  )
}

export default DocumentDataRegister
