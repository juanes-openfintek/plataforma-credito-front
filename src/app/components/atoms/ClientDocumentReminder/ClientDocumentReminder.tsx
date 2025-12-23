'use client'
import React from 'react'

interface ClientDocumentReminderProps {
  className?: string
  message?: string
}

const DEFAULT_MESSAGE =
  'Recuerda diligenciar esta informacion exactamente como aparece en el documento del cliente.'

const ClientDocumentReminder = ({ className = '', message = DEFAULT_MESSAGE }: ClientDocumentReminderProps) => {
  return (
    <p className={`text-sm font-semibold text-primary-color ${className}`}>
      {message}
    </p>
  )
}

export default ClientDocumentReminder
