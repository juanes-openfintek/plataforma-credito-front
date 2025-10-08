interface LineTitleProps {
    title: string
    idTitle?: string
    headerAlternative?: boolean
}
/**
 * LineTitle component is used to display a title with a line around it
 * @param title - The title to be displayed
 * @param headerAlternative - If true, the title will be displayed with a white background and a primary color text
 * @returns A LineTitle component
 */
const LineTitle = ({ title, headerAlternative, idTitle } : LineTitleProps) => {
  return (
    <h4
      id={idTitle}
      className={`${
        headerAlternative
          ? 'text-primary-color'
          : 'bg-primary-color text-white px-4'
      } col-span-3 max-lg:col-span-1 py-2 mb-6 rounded-md text-[1.5625rem]`}
    >
      {title}
    </h4>
  )
}

export default LineTitle
