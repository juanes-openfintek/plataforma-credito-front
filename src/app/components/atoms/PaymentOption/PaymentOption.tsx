import { Field } from 'formik'
import NextImage from '../NextImage/NextImage'

interface PaymentOptionProps {
  name: string
  image: string
  title: string
}
/**
 * PaymentOption component is used to display a payment option
 * @param name - The name of the payment option
 * @param image - The image of the payment option
 * @param title - The title of the payment option
 * @returns A PaymentOption component
 */
const PaymentOption = ({ name, image, title }: PaymentOptionProps) => {
  return (
    <div className='flex flex-row items-center mb-4 w-[420px] max-md:w-[300px] border-b-2 border-progress-color py-2 relative'>
      <Field
        id='default-checkbox'
        type='radio'
        name={name}
        value={title}
        className='w-4 h-4 text-white bg-white border-black rounded'
      />
      <NextImage
        src={image}
        alt={title}
        width={40}
        height={40}
        className='ml-4'
      />
      <p className='absolute right-0 font-bold text-black uppercase'>{title}</p>
    </div>
  )
}

export default PaymentOption
