/**
 * Formats a given date string to a human-readable format with date and time.
 * @param inputDate - The date string to format.
 * @returns A string with the formatted date and time.
 */
const formatDateAdmin = (inputDate: string, type: string) => {
  if (!inputDate) {
    return ''
  }
  const optionDays = {
    year: 'numeric' as const,
    month: '2-digit' as const,
    day: '2-digit' as const,
  }

  const optionHours = {
    hour: '2-digit' as const,
    minute: '2-digit' as const,
  }

  const date = new Date(inputDate)
  const formattedDate = date.toLocaleString('es-ES', optionDays)
  const formattedHours = date.toLocaleString('es-ES', optionHours)

  switch (type) {
    case 'admin':
      return `${formattedDate} a las ${formattedHours} horas`
    case 'onlyDate':
      return `${formattedDate}`
    case 'onlyHours':
      return `${formattedHours} horas`
    default:
      return `${formattedDate} ${formattedHours}`
  }
}

export default formatDateAdmin
