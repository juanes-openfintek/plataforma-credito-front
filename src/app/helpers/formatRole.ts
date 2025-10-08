const formatRole = (role: string) => {
  switch (role) {
    case 'admin':
      return 'Administrador'
    case 'user':
      return 'Usuario'
    case 'approver':
      return 'Aprobador'
    case 'disburser':
      return 'Desembolsador'
  }
}

export default formatRole
