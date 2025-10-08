/**
 * Formatea el tipo de cuenta
 * @param type Tipo de cuenta
 * @returns Tipo de cuenta formateado
 */
const formatTypeAccount = (type: string) => {
  switch (type) {
    case 'savings_account':
      return 'Ahorros'
    case 'checking_account':
      return 'Corriente'
    case 'electronic_deposit':
      return 'Depósito electrónico'
    default:
      return '-'
  }
}

export default formatTypeAccount
