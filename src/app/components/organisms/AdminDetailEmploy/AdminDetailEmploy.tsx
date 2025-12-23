import { useFormik } from 'formik'
import SquareButton from '../../atoms/SquareButton/SquareButton'
import ThreeColumnInputs from '../../molecules/ThreeColumnInputs/ThreeColumnInputs'
import { useEffect, useState } from 'react'
import { validateEmployData } from '../../../helpers/validationsForms'
import Modal from '../../molecules/Modal/Modal'
import postCreateUserAdmin from '../../../services/postCreateUserAdmin'
import { Employee } from '../../../interfaces/employee.interface'
import putUpdateUserAdmin from '../../../services/putUpdateUserAdmin'
import postDisableUserAdmin from '../../../services/postDisableUserAdmin'

interface AdminDetailEmployProps {
  userData?: Employee | null
  setShowForm: (value: boolean) => void
}

const AdminDetailEmploy = ({
  userData,
  setShowForm,
}: AdminDetailEmployProps) => {
  /**
   * Formik instance to manage the forms
   */
  const formik = useFormik({
    initialValues: {
      id: '',
      uid: '',
      completeName: '',
      email: '',
      asignPassword: '',
      role: '',
      identificationNumber: '',
      commission: '',
    },
    validate: (values) => validateEmployData(values, !userData),
    onSubmit: async (values) => {
      setLoading(true)
      let response;
      if (userData) {
        response = await putUpdateUserAdmin(values)
      } else {
        response = await postCreateUserAdmin(values)
      }
      setLoading(false)
      if (response?.error) {
        if (response.error === 'Conflict') {
          setErrorMessage(
            'Ya existe un correo electrónico registrado con el correo ingresado'
          )
          return
        }
        setErrorMessage(response.error)
        return
      }
      setShowForm(false)
    },
  })
  /**
   * This state is used to show the modal
   */
  const [showModal, setShowModal] = useState<boolean>(false)
  /**
   * This state is used to show the loading
   */
  const [loading, setLoading] = useState<boolean>(false)
  /**
   * A string that contains the error message.
   */
  const [errorMessage, setErrorMessage] = useState<string>('')
  /**
   * This function is used to remove the user
   */
  const removeUser = async () => {
    setLoading(true)
    await postDisableUserAdmin(userData?._id ?? '')
    setLoading(false)
    setShowModal(false)
    setShowForm(false)
  }
  /**
   * Array of objects to manage the personal information inputs
   */
  /**
   * An array of objects representing personal information fields for a new employee profile.
   * @typedef {Object} PersonalInfoField
   * @property {string} value - The current value of the field.
   * @property {string} errors - The error message associated with the field, if any.
   * @property {string} type - The type of input field (e.g. 'text', 'select').
   * @property {string} label - The label for the input field.
   * @property {string} name - The name of the input field.
   * @property {string[]} [options] - An array of options for a select input field.
   */

  /**
   * An array of objects representing personal information fields for a new employee profile.
   * @type {PersonalInfoField[]}
   */
  // Detectar si el rol es comercial
  const isCommercialRole = formik.values.role === 'commercial'

  const personalInfo = [
    {
      value: formik.values.completeName,
      errors: formik.errors.completeName,
      type: 'text',
      label: 'Nombre Completo*',
      name: 'completeName',
    },
    {
      value: formik.values.email,
      errors: formik.errors.email,
      type: 'text',
      readonly: !!userData,
      label: isCommercialRole ? 'Usuario asignado*' : 'Correo asignado*',
      name: 'email',
      placeholder: isCommercialRole ? 'Ej: comercial1' : 'correo@ejemplo.com',
    },
    {
      value: formik.values.asignPassword,
      errors: formik.errors.asignPassword,
      type: 'text',
      inputMode: isCommercialRole ? 'numeric' : undefined,
      pattern: isCommercialRole ? '[0-9]*' : undefined,
      label: isCommercialRole ? 'Código asignado (mín. 8 dígitos)*' : 'Clave asignada*',
      name: 'asignPassword',
      placeholder: isCommercialRole ? '12345678' : '••••••••',
      minLength: isCommercialRole ? 8 : undefined,
      maxLength: isCommercialRole ? 20 : undefined,
    },
    {
      value: formik.values.role,
      errors: formik.errors.role,
      type: 'select',
      options: [
        { text: '-- Seleccione una opción --', value: '' },
        { text: 'Usuario', value: 'user' },
        { text: 'Comercial', value: 'commercial' },
        { text: 'Analista 1', value: 'analyst1' },
        { text: 'Analista 2', value: 'analyst2' },
        { text: 'Analista 3', value: 'analyst3' },
        { text: 'Administrador', value: 'admin' },
      ],
      label: 'Rol*',
      name: 'role',
    }
  ]
  /**
   * Array of objects to manage the administrative information inputs
   */
  const administrativeInfo = [
    {
      value: formik.values.identificationNumber,
      errors: formik.errors.identificationNumber,
      type: 'text',
      label: 'Número identidad del representante*',
      name: 'identificationNumber',
    },
    {
      value: formik.values.commission,
      errors: formik.errors.commission,
      type: 'number',
      label: 'Comision por transacción*',
      name: 'commission',
    },
  ]
  useEffect(() => {
    if (userData) {
      formik.setValues({
        id: userData._id,
        uid: userData.uid,
        completeName: userData.name + ' ' + userData.lastname,
        email: userData.email,
        asignPassword: '*****',
        role: userData.roles[0],
        identificationNumber: userData.identificationNumber,
        commission: userData.commission,
      })
    } else {
      formik.resetForm()
    }
  }, [userData])

  return (
    <section>
      <div className='flex flex-row justify-between my-10'>
        {userData ? (
          <h3 className='font-semibold text-[1.5625rem]'>Editar perfil</h3>
        ) : (
          <h3 className='font-semibold text-[1.5625rem]'>Crear perfil</h3>
        )}
        {userData && (
          <div className='w-[200px]'>
            <SquareButton
              text='Eliminar perfil'
              error
              onClickHandler={() => setShowModal(true)}
            />
          </div>
        )}
      </div>
      {errorMessage && (
        <p className='text-center text-white bg-red-300 py-4 mb-6 rounded'>
          {errorMessage}
        </p>
      )}
      <form
        onSubmit={formik.handleSubmit}
        className='bg-light-color-one px-6 lg:px-14 w-full rounded-2xl'
      >
        <ThreeColumnInputs
          fields={personalInfo}
          title='Información personal'
          noLowerLine
          onHandleChange={formik.handleChange}
        />
        {formik.values.role === 'approver' &&
          <ThreeColumnInputs
            fields={administrativeInfo}
            title='Información administrativa'
            noLowerLine
            onHandleChange={formik.handleChange}
          />}
      </form>
      <div className='flex flex-row md:w-[30%] m-auto mt-8 gap-8'>
        <SquareButton
          text='Cancelar'
          gray
          disable={loading}
          onClickHandler={() => setShowForm(false)}
        />
        <SquareButton
          text={userData ? 'Guardar cambios' : 'Crear'}
          disable={loading}
          onClickHandler={() => formik.handleSubmit()}
        />
      </div>
      <Modal
        showModal={showModal}
        title='Eliminar perfil'
        description={`<p>Estás a punto de eliminar el perfil de <strong>${userData?.name} ${userData?.lastname} ¿Estás segur@ de realizar esta acción?</strong></p>`}
        negativeButtonText='Volver'
        positiveButtonText='Eliminar perfil'
        disable={loading}
        handleClickNegative={() => setShowModal(false)}
        handleClickPositive={() => removeUser()}
        fillRedButton
      />
    </section>
  )
}

export default AdminDetailEmploy
