'use client'
import useDecryptedSession from '../../../hooks/useDecryptedSession'

const WelcomeMessage = () => {
  /**
   * nameUser is the name of the user in session
   */
  const nameUser: string = useDecryptedSession()?.name
  return (
    <h2 className='text-[2.1875rem] max-md:leading-[2rem] leading-[1.5625rem] font-bold mb-2 mt-4'>
      Hola, {nameUser}
    </h2>
  )
}

export default WelcomeMessage
