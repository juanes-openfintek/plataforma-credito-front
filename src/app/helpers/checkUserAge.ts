/**
 * agePerson is a function that validates if the user is adult
 * @param date - The date of birth of the user
 * @returns The age of the user
 */
export const agePerson = (date: string) => {
  const today = new Date()
  const birthDate = new Date(date)
  const age = today.getFullYear() - birthDate.getFullYear()
  const month = today.getMonth() - birthDate.getMonth()
  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
    return age - 1
  }
  return age
}
/**
 * isMinor is a function that validates if the user is adult
 */
export const isMinor = (date: string) => {
  const today = new Date()
  const birthDate = new Date(date)
  const age = today.getFullYear() - birthDate.getFullYear()
  if (age < 18) {
    return true
  }
  if (age > 18) {
    return false
  }
  if (today.getMonth() < birthDate.getMonth()) {
    return true
  }
  if (today.getMonth() > birthDate.getMonth()) {
    return false
  }
  if (today.getDate() < birthDate.getUTCDate()) {
    return true
  }
  return false
}
