/**
 * Censors all characters except the last 4
 * @param str - string to censor
 * @returns censored string
 */
export const censorCharacters = (str: string): string => {
  let censoredString = ''
  const stringLength = str.length
  censoredString = '*****' + str.slice(stringLength - 4)
  return censoredString
}
