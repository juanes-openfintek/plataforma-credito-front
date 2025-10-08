'use client'
import UserInfoBlock from '../../../components/molecules/UserInfoBlock/UserInfoBlock'
import ThreeColumnInputs from '../../../components/molecules/ThreeColumnInputs/ThreeColumnInputs'
import { useFormik } from 'formik'
import SquareButton from '../../../components/atoms/SquareButton/SquareButton'
import BreadcrumbLabel from '../../../components/atoms/BreadcrumbLabel/BreadcrumbLabel'
import useDecryptedSession from '../../../hooks/useDecryptedSession'
import { UserDataToken } from '../../../interfaces/userDataToken.interface'
import axios from 'axios'
import { validateNewPassword } from '../../../helpers/validationsForms'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import encryptData from '../../../helpers/encryptData'

const PageChangePassword = () => {
  /**
   * Router instance to manage the routes
   */
  const router = useRouter()
  /**
   * Loading state to manage the loading of the page
   */
  const [loading, setLoading] = useState(false)
  /**
   * A string that contains the error message.
   */
  const [errorMessage, setErrorMessage] = useState<string>('')
  /**
   * userData is the data of the user
   */
  const userData: UserDataToken = useDecryptedSession()
  /**
   * Formik instance to manage the forms
   */
  const formik = useFormik({
    initialValues: {
      actualPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    validate: validateNewPassword,
    onSubmit: async (values) => {
      setLoading(true)
      await axios
        .post('/api/auth/change-password', {
          token: encryptData({
            email: userData?.email,
            password: values.actualPassword,
            newPassword: values.newPassword,
          }),
        })
        .then((res) => {
          if (res.status === 200) {
            router.push('/usuario/perfil')
          }
          setLoading(false)
        })
        .catch(() => {
          setErrorMessage('Ha ocurrido un problema cambiando su contraseña')
          setLoading(false)
        })
    },
  })
  /**
   * Array of objects to manage the bank information inputs
   */
  const passwordInfo = [
    {
      value: formik.values.actualPassword,
      errors: formik.errors.actualPassword,
      type: 'password',
      label: 'Contraseña actual',
      name: 'actualPassword',
    },
    {
      value: formik.values.newPassword,
      errors: formik.errors.newPassword,
      type: 'password',
      label: 'Nueva contraseña',
      name: 'newPassword',
    },
    {
      value: formik.values.confirmNewPassword,
      errors: formik.errors.confirmNewPassword,
      type: 'password',
      label: 'Confirmar nueva contraseña',
      name: 'confirmNewPassword',
    },
  ]
  return (
    <main>
      <section className='p-[1rem] xl:ml-[300px] xl:mr-[50px] max-lg:pt-14 text-primary-color'>
        <BreadcrumbLabel link='/usuario/perfil' text='Contraseña' leftArrow />
        {errorMessage && (
          <p className='text-center text-white bg-red-300 py-4 mb-6 rounded'>
            {errorMessage}
          </p>
        )}
        <UserInfoBlock
          name={userData?.name}
          lastname={userData?.lastname}
          documentNumber={userData?.documentNumber}
        />
        <ThreeColumnInputs
          fields={passwordInfo}
          headerAlternative
          border
          noLowerLine
          onHandleChange={formik.handleChange}
        />
        <div className='w-[30%] max-md:w-[75%] h-[70px] mx-auto md:mt-10'>
          <SquareButton
            text='Guardar cambios'
            disable={loading}
            onClickHandler={() => {
              formik.handleSubmit()
            }}
          />
        </div>
      </section>
    </main>
  )
}

export default PageChangePassword
