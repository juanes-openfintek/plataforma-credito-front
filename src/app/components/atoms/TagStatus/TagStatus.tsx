import { CreditStatusesProperties } from '../../../constants/CreditStatusesProperties'

interface TagStatusProps {
  text: string
  center?: boolean
}

/**
 * Renders a tag with a status text and background color based on the text value.
 * @param {Object} props - The component props.
 * @param {string} props.text - The status text to be displayed.
 * @param {boolean} props.center - Whether to center the tag horizontally.
 * @returns {JSX.Element} - The rendered component.
 */
const TagStatus = ({ text, center }: TagStatusProps) => {
  const statusProperties = CreditStatusesProperties.find(
    (property: { status: string }) => property.status === text
  )
  return (
    <p className={`${center ? 'm-auto' : ''} font-poppins max-md:text-[0.75rem] justify-center self-center px-4 max-md:px-2 py-1 font-bold w-auto rounded-lg ${statusProperties?.background}`}>
      {statusProperties?.text}
    </p>
  )
}

export default TagStatus
