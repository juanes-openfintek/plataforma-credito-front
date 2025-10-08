import SeeAttachFile from '../../atoms/SeeAttachFile/SeeAttachFile'

interface AdminValidateUserAccountProps {
  documentUrl: string
}

const AdminValidateUserAccount = ({ documentUrl }: AdminValidateUserAccountProps) => {
  return (
    <div className='py-8 border-b-2 border-black'>
      <h2 className='text-[1.5625rem] font-semibold my-4 mt-12'>
        Recuerde que antes de “Validar” debe rectificar el número de cuenta con
        el archivo adjunto cargado por el cliente
      </h2>
      <SeeAttachFile url={documentUrl} />
    </div>
  )
}

export default AdminValidateUserAccount
