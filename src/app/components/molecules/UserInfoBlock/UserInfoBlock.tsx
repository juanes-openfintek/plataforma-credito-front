import parseToDocumentNumber from '../../../helpers/parseToDocumentNumber'

interface UserInfoBlockProps {
  name: string
  lastname: string
  documentNumber: string
}

/**
 * Component to show the user information in a block
 * @returns UserInfoBlock component
 */
const UserInfoBlock = ({ name, lastname, documentNumber }: UserInfoBlockProps) => {
  return (
    <div className='w-[750px] max-md:w-[90%] h-[266px] rounded-3xl bg-light-color-one mx-auto md:my-10'>
      <div className='bg-primary-color w-full h-[108px] relative rounded-t-3xl'>
        <div className='rounded-full mx-auto bg-light-color-three p-2 w-[100px] h-[100px] flex absolute top-[50px] left-0 right-0'>
          <span className='icon-user text-black text-[4rem] mx-auto self-center' />
        </div>
      </div>
      <div className='flex flex-row max-md:flex-col justify-between mx-10 max-md:text-center mt-24 max-md:mt-12'>
        <p className='text-[1.875rem] font-bold'>{name} {lastname}</p>
        <p className='text-black text-[1.25rem] font-semibold'>
          C.C. {parseToDocumentNumber(documentNumber)}
        </p>
      </div>
    </div>
  )
}

export default UserInfoBlock
