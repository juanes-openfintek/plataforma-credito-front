/**
 * CreditStatusesProperties store the properties of the credit statuses
 */
export const CreditStatusesProperties = [
  {
    status: 'pending',
    text: 'En estudio',
    icon: '/images/round-timer-icon.png',
    background: 'bg-progress-color text-black',
  },
  {
    status: 'approved',
    text: 'Aprobado',
    icon: '/images/square-check-icon.png',
    background: 'bg-success-color text-black',
  },
  {
    status: 'denied',
    text: 'Rechazado',
    icon: '/images/square-reject-icon.png',
    background: 'bg-reject-color text-white',
  },
  {
    status: 'default',
    text: 'Mora',
    icon: '/images/round-timer-icon.png',
    background: 'bg-delay-color text-white',
  },
  {
    status: 'validated',
    text: 'Validado',
    icon: '/images/square-check-icon.png',
    background: 'bg-success-color text-black',
  },
  {
    status: 'noSign',
    text: 'Pagaré NO firmado',
    icon: '/images/round-timer-icon.png',
    background: 'bg-no-sign-color text-black',
  },
  {
    status: 'signed',
    text: 'Pagaré firmado',
    icon: '/images/round-timer-icon.png',
    background: 'bg-signed-color text-white',
  },
  {
    status: 'disbursed',
    text: 'Desembolsado',
    icon: '/images/square-check-icon.png',
    background: 'bg-accent-color text-white',
  },
  {
    status: 'confirmed',
    text: 'Confirmado',
    icon: '/images/round-timer-icon.png',
    background: 'bg-accent-light-color text-white',
  },
  {
    status: 'paid',
    text: 'Pagado',
    icon: '/images/square-check-icon.png',
    background: 'bg-success-color-two text-white',
  },
]
