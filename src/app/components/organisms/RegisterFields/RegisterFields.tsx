'use client'
import React, { useState } from 'react'
import PersonalDataRegister from '../../molecules/PersonalDataRegister/PersonalDataRegister'
import DocumentDataRegister from '../../molecules/DocumentDataRegister/DocumentDataRegister'

/**
 * RegisterFields is a component that renders the register fields
 * @example <RegisterFields />
 * @returns The RegisterFields component
 */
const RegisterFields = () => {
  const [personalVisibility, setPersonalVisibility] = useState(true)

  return (
    <>
      {personalVisibility && (
        <PersonalDataRegister setPersonalVisibility={setPersonalVisibility} />
      )}
      {!personalVisibility && <DocumentDataRegister setPersonalVisibility={setPersonalVisibility} />}
    </>
  )
}

export default RegisterFields
