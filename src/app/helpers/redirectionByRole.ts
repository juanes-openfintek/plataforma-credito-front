/**
 * Determines the redirection path based on the user's role.
 * @param roles - An array of strings representing the user's roles.
 * @returns A string representing the redirection path.
 */
const redirectionByRole = (roles: string[]) => {
  if (roles.includes('admin')) {
    return '/admin'
  }
  if (roles.includes('approver')) {
    return '/aprobador'
  }
  if (roles.includes('disburser')) {
    return '/desembolsador'
  }
  if (roles.includes('user')) {
    return '/usuario'
  }
  return '/'
}

export default redirectionByRole
