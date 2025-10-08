/**
 * TicketStatuses store the properties of the tickets statuses
 */
export const TicketStatuses = [
  {
    status: 'pending',
    text: 'Pendiente',
    icon: '/images/round-timer-icon.png',
    background: 'bg-progress-color text-black',
  },
  {
    status: 'default',
    text: 'En mora',
    icon: '/images/round-timer-icon.png',
    background: 'bg-delay-color text-white',
  },
  {
    status: 'paid',
    text: 'Pagado',
    icon: '/images/square-check-icon.png',
    background: 'bg-success-color-two text-white',
  },
]
