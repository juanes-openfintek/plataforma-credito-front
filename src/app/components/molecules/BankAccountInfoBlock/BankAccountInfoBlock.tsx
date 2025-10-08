import { useEffect, useState } from 'react'
import decryptCryptoData from '../../../helpers/decryptCryptoData'
import { censorCharacters } from '../../../helpers/censorCharacters'

interface BankAccountInfoBlockProps {
  title: string
  accountNumber: string
}

/**
 * This is the component for the bank account info block
 * @returns BankAccountInfoBlock
 */
const BankAccountInfoBlock = ({
  title,
  accountNumber,
}: BankAccountInfoBlockProps) => {
  const [showCensor, setShowCensor] = useState<boolean>(false)
  /**
   * Function to decipher the account number
   */
  const decipheredAccountNumber = decryptCryptoData(accountNumber ?? '')
  /**
   *  State to manage the censor of the account number
   */
  const [accountNumberCensored, setAccountNumberCensored] = useState(
    censorCharacters(decipheredAccountNumber)
  )
  /**
   * Function to handle the censor of the account number
   */
  const handleCensor = () => {
    if (showCensor) {
      setAccountNumberCensored(censorCharacters(decipheredAccountNumber))
      setShowCensor(false)
    } else {
      setAccountNumberCensored(decipheredAccountNumber)
      setShowCensor(true)
    }
  }
  /**
   * Effect to censor the account number when changes default
   */
  useEffect(() => {
    setAccountNumberCensored(censorCharacters(decipheredAccountNumber))
    setShowCensor(false)
  }, [accountNumber])

  return (
    <div className='w-[750px] max-md:w-[90%] h-[266px] rounded-3xl bg-light-color-one mx-auto md:my-10'>
      <div className='bg-primary-color w-full h-[108px] flex rounded-t-3xl items-center justify-center'>
        <h3 className='text-white font-semibold text-[1.5625rem]'>
          Cuenta seleccionada
        </h3>
      </div>
      <p className='w-fit px-10 py-2 bg-accent-light-color rounded-lg uppercase text-center text-[1.25rem] font-semibold text-black mx-auto mt-6 max-md:mt-2'>
        {title}
      </p>
      <div className='flex flex-row max-md:flex-col justify-between items-center mx-10 max-md:text-center mt-10 max-md:mt-2 text-black'>
        <p className='text-[1.25rem]'>
          No. de cuenta:{' '}
          <span className='font-semibold'>{accountNumberCensored}</span>
        </p>
        <span className='icon-eye text-accent-color cursor-pointer' onClick={handleCensor} />
      </div>
    </div>
  )
}

export default BankAccountInfoBlock
