/**
 * Parses a string representing a number into a formatted document number.
 * @param numberStr - The string representing the number to be formatted.
 * @returns The formatted document number.
 */
const parseToDocumentNumber = (numberStr: string | undefined) => {
  if (!numberStr) {
    return ''
  }
  const groups = []
  let group = ''

  for (let i = numberStr?.length - 1, j = 1; i >= 0; i--, j++) {
    group = numberStr[i] + group
    if (j % 3 === 0) {
      groups.unshift(group)
      group = ''
    }
  }

  if (group.length > 0) {
    groups.unshift(group)
  }

  const formattedNumber = groups.join('.')

  return formattedNumber
}

export default parseToDocumentNumber
