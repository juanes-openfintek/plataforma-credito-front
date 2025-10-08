'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import IconArrowButton from '../../components/atoms/IconArrowButton/IconArrowButton'
import BreadcrumbLabel from '../../components/atoms/BreadcrumbLabel/BreadcrumbLabel'
import Modal from '../../components/molecules/Modal/Modal'
import postDisableSelfUser from '../../services/postDisableSelfUser'
import { signOut } from 'next-auth/react'

const Profile = () => {
  /**
   * Defines a state variable to control the visibility of a modal.
   * @typeParam boolean - The type of the state variable.
   * @defaultValue false - The initial value of the state variable.
   */
  const [showModal, setShowModal] = useState(false)
  /**
   * router is the router of the page
   */
  const router = useRouter()
  /**
   * Defines a state variable to control the visibility of a modal.
   */
  const [loading, setLoading] = useState(false)
  /**
   * Defines a function that disables the user.
   */
  const disableUser = async () => {
    setLoading(true)
    const response = await postDisableSelfUser()
    if (response === 201) {
      signOut()
    }
    setLoading(false)
  }
  return (
    <main>
      <section className='p-[1rem] xl:ml-[300px] xl:mr-[50px] max-lg:pt-14 text-primary-color'>
        <BreadcrumbLabel text='Perfil' />
        <div className='grid grid-cols-2 gap-20 p-14 mt-14'>
          <IconArrowButton
            title='Contraseña'
            description='Puedes cambiar tu contraseña en el momento que desees.'
            image='icon-lock'
            onClickHandler={() =>
              router.push('/usuario/perfil/cambio-contrasena')}
          />
          <IconArrowButton
            title='Datos personales'
            description='Actualiza tu celular o correo electrónico si es necesario'
            image='icon-person-square'
            onClickHandler={() =>
              router.push('/usuario/perfil/actualizacion-datos')}
          />
          <IconArrowButton
            title='Cuenta bancaria'
            description='Elige la cuenta de deposito que desees'
            image='icon-account-balance'
            onClickHandler={() =>
              router.push('/usuario/perfil/cuentas-bancarias')}
          />
          <IconArrowButton
            title='Elimina tu cuenta'
            description='Esta zona es peligrosa, tu cuenta desaparecerá'
            image='icon-trash-can'
            onClickHandler={() => setShowModal(true)}
          />
        </div>
        <Modal
          showModal={showModal}
          title='Eliminar cuenta'
          description='<p>Estas a punto de eliminar tu cuenta en mundo negocios. <strong>¿Estás seguro de realizar esta acción?</strong></p>'
          negativeButtonText='Volver'
          positiveButtonText='Eliminar'
          disable={loading}
          handleClickNegative={() => setShowModal(false)}
          handleClickPositive={() => disableUser()}
          borderRedButton
        />
      </section>
    </main>
  )
}

export default Profile
