/**
 * Determines the redirection path based on the user's role.
 * @param roles - An array of strings representing the user's roles.
 * @returns A string representing the redirection path.
 */
const redirectionByRole = (roles: string[]) => {
  if (roles.includes('admin')) {
    return '/admin'
  }
  // Nuevos roles de analistas
  if (roles.includes('analyst1')) {
    return '/analista1/creditos'
  }
  if (roles.includes('analyst2')) {
    return '/analista2/creditos'
  }
  if (roles.includes('analyst3')) {
    return '/analista3/creditos'
  }
  // Roles legacy (mantener para compatibilidad mapeando al nuevo flujo)
  if (roles.includes('approver')) {
    // Aprobar -> flujo de analista inicial por defecto
    return '/analista1/creditos'
  }
  if (roles.includes('disburser')) {
    // Desembolsador ahora estǭ cubierto por analista 3
    return '/analista3/creditos'
  }
  if (roles.includes('user')) {
    return '/usuario'
  }
  return '/'
}

export default redirectionByRole
