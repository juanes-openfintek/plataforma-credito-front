import Link from 'next/link'

interface BreadcrumbLabelProps {
  link?: string
  text: string
  leftArrow?: boolean
  alternative?: boolean
  onClickHandler?: () => void
}
/**
 * Component to render a breadcrumb label
 * @param link - Link to redirect
 * @param text - Text to display
 * @param leftArrow - If true, display a left arrow icon
 * @returns the breadcrumb label component
 */
const BreadcrumbLabel = ({
  link,
  text,
  leftArrow,
  alternative,
  onClickHandler,
}: BreadcrumbLabelProps) => {
  return (
    <>
      {link ? (
        <Link
          href={link}
          onClick={onClickHandler}
          className='flex flex-row items-center mb-24 max-md:mb-10'
        >
          {leftArrow && (
            <span className={`icon-left-arrow text-[1.125rem] mr-2 ${alternative ? 'text-primary-color' : 'text-light-color-two'}`} />
          )}
          <p className={`${alternative ? 'text-primary-color font-semibold' : 'text-light-color-two'} text-[1.25rem]`}>{text}</p>
        </Link>
      ) : (
        <p className={`${alternative ? 'text-primary-color font-semibold' : 'text-light-color-two'} text-[1.25rem]`}>{text}</p>
      )}
    </>
  )
}

export default BreadcrumbLabel
